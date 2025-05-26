<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TripLike;
use Illuminate\Support\Facades\Auth;

class TripLikeController extends Controller
{
    public function store($tripId)
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Prevent duplicate like
        $existing = TripLike::where('Tripid', $tripId)
            ->where('Userid', $userId)
            ->first();

       if ($existing) {
    return response()->json(['message' => 'Already liked'], 200); 
}


        TripLike::create([
            'Tripid' => $tripId,
            'Userid' => $userId,
        ]);

        return response()->json(['message' => 'Liked'], 201);
    }

    public function destroy($tripId)
    {
        $userId = Auth::id();

        if (!$userId) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $like = TripLike::where('Tripid', $tripId)
            ->where('Userid', $userId)
            ->first();

        if ($like) {
            $like->delete();
            return response()->json(['message' => 'Unliked']);
        }

        return response()->json(['message' => 'Not found'], 404);
    }
}
