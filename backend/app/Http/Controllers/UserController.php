<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function index()
    {
        return User::with('role')->get();
    }

    public function show($id)
    {
        return User::with('role')->findOrFail($id);
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'Name'           => 'required|string|max:255',
        'Lastname'       => 'required|string|max:255',
        'Email'          => 'required|email|unique:users,Email',
        'Password'       => 'required|min:6',
        'Bio'            => 'nullable|string',
        'Profile_photo'  => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        'Birthdate'      => 'nullable|date',
        'Gender'         => 'nullable|string|max:10',
        'Country'        => 'nullable|string|max:100',
        'Verified'       => 'boolean',
        'Roleid'         => 'sometimes|exists:roles,Roleid',
    ]);

    if (!isset($validated['Roleid'])) {
        $validated['Roleid'] = 2;
    }

    // Handle image upload
    if ($request->hasFile('Profile_photo')) {
        $path = $request->file('Profile_photo')->store('profile_photos', 'public');
        $validated['Profile_photo'] = $path;
    }

    $user = User::create($validated);

    return $user->load('role');
}


    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
    
        $rules = [
            'Name'           => 'required|string|max:255',
            'Lastname'       => 'required|string|max:255',
            'Bio'            => 'nullable|string|max:255',
            'Birthdate'      => 'nullable|date',
            'Gender'         => 'nullable|string|max:10',
            'Country'        => 'nullable|string|max:100',
            'Verified'       => 'boolean',
            'Roleid'         => 'sometimes|exists:roles,Roleid',
            'Password'       => 'nullable|string|min:6',
        ];
    
        if ($request->hasFile('Profile_photo')) {
            $rules['Profile_photo'] = 'image|mimes:jpg,jpeg,png|max:2048';
        }
    
        try {
            $request->validate($rules);
        } catch (\Illuminate\Validation\ValidationException $e) {
            logger('Validation failed:', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        }
    
        $data = $request->except(['Password', 'Profile_photo']);
    
        if ($request->hasFile('Profile_photo')) {
            logger('Uploading profile image...');
            $path = $request->file('Profile_photo')->store('profile_photos', 'public');
            logger('Stored at: ' . $path);
            $data['Profile_photo'] = $path;
        }
    
        $user->update($data);
    
        if ($request->filled('Password')) {
            $user->Password = Hash::make($request->Password);
            $user->save();
        }
    
        return $user->load('role');
    }




    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
