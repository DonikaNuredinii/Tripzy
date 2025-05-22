<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

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
        'Profile_photo'  => 'nullable|string',
        'Birthdate'      => 'nullable|date',
        'Gender'         => 'nullable|string|max:10',
        'Country'        => 'nullable|string|max:100',
        'Verified'       => 'boolean',
        'Roleid'         => 'sometimes|exists:roles,Roleid',
    ]);

    // Only assign default Roleid if it’s not provided
    if (!isset($validated['Roleid'])) {
        $validated['Roleid'] = 2;
    }

    $user = User::create($validated);

    return $user->load('role');
}



    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->except('Password'));

        if ($request->filled('Password')) {
            $user->Password = $request->Password;
            $user->save();
        }

        return $user;
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted']);
    }
}
