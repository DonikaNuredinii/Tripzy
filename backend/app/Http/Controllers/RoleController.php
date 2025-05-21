<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        return Role::with('user')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'Userid' => 'required|exists:users,Userid',
            'Name' => 'required|string|max:255',
        ]);

        return Role::create($validated);
    }

    public function show($id)
    {
        return Role::with('user')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $role->update($request->only(['Name']));

        return $role;
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(['message' => 'Role deleted']);
    }
}
