<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::all();
    }

    public function show($id)
    {
        return User::findOrFail($id);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Name' => 'required|string|max:255',
            'Lastname' => 'required|string|max:255',
            'Email' => 'required|email|unique:users,Email',
            'Password' => 'required|min:6',
        ]);
    
        // Create user
        $user = User::create($validated);
    
       
        // Return user with role info
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
