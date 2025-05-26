<?php

namespace App\Http\Controllers;

use App\Models\TripComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TripCommentController extends Controller
{
    // GET /api/trips/{tripId}/comments
    public function index($tripId)
    {
        return TripComment::with('user')
            ->where('Tripid', $tripId)
            ->orderBy('created_at', 'asc')
            ->get();
    }
    

    // POST /api/trips/{tripId}/comments
    public function store(Request $request, $tripId)
    {
        $request->validate([
            'Comment' => 'required|string|max:1000',
        ]);

        $comment = TripComment::create([
            'Tripid' => $tripId,
            'Userid' => Auth::id(),
            'Comment' => $request->Comment,
        ]);

        return $comment->load('user');
    }

    // GET /api/comments/{id}
    public function show($id)
    {
        return TripComment::with(['trip', 'user'])->findOrFail($id);
    }

    // PUT /api/comments/{id}
    public function update(Request $request, $id)
    {
        $comment = TripComment::findOrFail($id);

        $this->authorize('update', $comment); // optional: add policy later

        $comment->update($request->only('Comment'));

        return $comment;
    }

    // DELETE /api/comments/{id}
    public function destroy($id)
    {
        $comment = TripComment::findOrFail($id);

        $this->authorize('delete', $comment); // optional: add policy later

        $comment->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
