<?php

namespace App\Http\Controllers;

use App\Models\TripPhoto;
use Illuminate\Http\Request;

class TripPhotoController extends Controller
{
    public function index()
    {
        return TripPhoto::with('trip')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'Tripid' => 'required|exists:trips,Tripid',
            'image_path' => 'required|string',
            'caption' => 'nullable|string',
            'created_at' => 'nullable|date',
        ]);

        return TripPhoto::create($data);
    }

    public function show($id)
    {
        return TripPhoto::with('trip')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $photo = TripPhoto::findOrFail($id);
        $photo->update($request->all());
        return $photo;
    }

    public function destroy($id)
    {
        TripPhoto::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
