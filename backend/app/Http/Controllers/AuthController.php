<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Register (Signup)
    public function register(Request $request)
{
    $request->validate([
        'Name' => 'required|string|max:255',
        'Lastname' => 'required|string|max:255',
        'Email' => 'required|email|unique:users,Email',
        'Password' => 'required|string|min:8|confirmed',
        'Gender' => 'required|string',
        'Birthdate' => 'required|date',
    ]);

    $user = User::create([
        'Name' => $request->Name,
        'Lastname' => $request->Lastname,
        'Email' => $request->Email,
        'Password' => $request->Password,
        'Gender' => $request->Gender,
        'Birthdate' => $request->Birthdate,
        'Verified' => false,
        'Roleid' => 2, // ✅ assign role by ID
    ]);

    return response()->json([
        'message' => 'Registration successful',
        'user' => $user->load('role'),
    ], 201);
}


    // Login
    public function login(Request $request)
    {
        $request->validate([
            'Email' => 'required|email',
            'Password' => 'required',
        ]);

        $user = User::where('Email', $request->Email)->first();

        if (!$user || !\Hash::check($request->Password, $user->Password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user->load('role'),
            'token' => $token,
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
