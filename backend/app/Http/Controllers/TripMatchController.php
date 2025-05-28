<?php

namespace App\Http\Controllers;

use App\Models\TripMatch;
use Illuminate\Http\Request;
use App\Models\Notification;

class TripMatchController extends Controller
{
    public function index()
    {
        return TripMatch::with(['trip', 'user'])->get();
    }

    public function store(Request $request)
    {
        $data = [
            'Tripid' => $request->json('tripid'),
            'Userid' => $request->json('userid'),
            'Status' => $request->json('status'),
        ];

        validator($data, [
            'Tripid' => 'required|exists:trips,Tripid',
            'Userid' => 'required|exists:users,Userid',
            'Status' => 'required|string',
        ])->validate();

        $existing = TripMatch::where('Tripid', $data['Tripid'])
            ->where('Userid', $data['Userid'])
            ->where('sender_id', auth()->id())
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Match already requested.'], 409);
        }

        $match = TripMatch::create([
            'Tripid' => $data['Tripid'],
            'Userid' => $data['Userid'],
            'Status' => $data['Status'],
            'sender_id' => auth()->id(),
            
        ]);

        return $match->load('trip', 'user', 'sender');
    }

 public function myMatchRequests(Request $request)
{
    $userId = auth()->id();

    return TripMatch::with(['trip', 'user', 'sender']) 
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
    $match = TripMatch::with('user')->findOrFail($id);
    $oldStatus = $match->Status;

    $match->Status = $request->input('status');
    $match->save();

    if ($oldStatus !== $match->Status) {
        $receiverName = $match->user->Name ?? 'the user';

        if (strtolower($match->Status) === 'accepted') {
            Notification::create([
                'user_id' => $match->sender_id,
                'type' => 'match_accepted',
                'message' => "Your match request was accepted by $receiverName.",
            ]);
        } elseif (strtolower($match->Status) === 'rejected') {
            Notification::create([
                'user_id' => $match->sender_id,
                'type' => 'match_rejected',
                'message' => "$receiverName denied your match request.",
            ]);
        }
    }

    return $match->load('trip', 'user', 'sender');
}

    public function destroy($id)
    {
        TripMatch::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
