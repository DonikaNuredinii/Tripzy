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
        'Userid' => 'required|exists:users,Userid', // requester
        'Status' => 'required|string', // should be 'pending' initially
    ]);

    // Prevent duplicate
    $existing = \App\Models\TripMatch::where('Tripid', $data['Tripid'])
        ->where('Userid', $data['Userid'])
        ->first();

    if ($existing) {
        return response()->json(['message' => 'Match already requested.'], 409);
    }

    $match = TripMatch::create($data);

    return $match->load('trip', 'user');
}
public function myMatchRequests(Request $request)
{
    $userId = auth()->id();

    return TripMatch::with(['trip', 'user'])
        ->whereHas('trip', function ($query) use ($userId) {
            $query->where('Userid', $userId);
        })
        ->orderByDesc('created_at')
        ->get();
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
