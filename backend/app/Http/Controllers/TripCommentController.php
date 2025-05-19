<?php
namespace App\Http\Controllers;

use App\Models\TripComment;
use Illuminate\Http\Request;

class TripCommentController extends Controller
{
    public function index()
    {
        return TripComment::with(['trip', 'user'])->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'Tripid' => 'required|exists:trips,Tripid',
            'Userid' => 'required|exists:users,id',
            'Comment' => 'required|string',
            'Created_at' => 'nullable|date',
        ]);

        return TripComment::create($data);
    }

    public function show($id)
    {
        return TripComment::with(['trip', 'user'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $comment = TripComment::findOrFail($id);
        $comment->update($request->all());
        return $comment;
    }

    public function destroy($id)
    {
        TripComment::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
