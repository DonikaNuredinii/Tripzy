<?php

namespace App\Http\Controllers;

use App\Models\TripMatch;
use Illuminate\Http\Request;

class TripMatchController extends Controller
{
    public function index()
    {
        return TripMatch::with(['trip', 'user'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'Tripid' => 'required|exists:trips,Tripid',
            'Userid' => 'required|exists:users,id',
            'Status' => 'required|string',
        ]);

        return TripMatch::create($data);
    }

    public function show($id)
    {
        return TripMatch::with(['trip', 'user'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $match = TripMatch::findOrFail($id);
        $match->update($request->all());
        return $match;
    }

    public function destroy($id)
    {
        TripMatch::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
