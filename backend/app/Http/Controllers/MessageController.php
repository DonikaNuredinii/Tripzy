<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\MessageSent;

class MessageController extends Controller
{
    public function index()
    {
        return Message::where('sender_id', Auth::user()->Userid)
            ->orWhere('receiver_id', Auth::user()->Userid)
            ->latest()
            ->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,Userid',
            'message' => 'required|string',
        ]);

        $senderId = Auth::user()->Userid; // ✅ Correct way to get your custom user ID

        $message = Message::create([
            'sender_id' => $senderId,
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        // ✅ Broadcast to the other user's private channel
        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message);
    }

    public function withUser($userId)
    {
        $currentUser = Auth::user();

        if (!$currentUser) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $messages = Message::where(function ($q) use ($currentUser, $userId) {
            $q->where('sender_id', $currentUser->Userid)
              ->where('receiver_id', $userId);
        })->orWhere(function ($q) use ($currentUser, $userId) {
            $q->where('sender_id', $userId)
              ->where('receiver_id', $currentUser->Userid);
        })->orderBy('created_at')->get();

        return response()->json($messages);
    }
}
