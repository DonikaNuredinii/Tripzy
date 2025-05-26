<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\TripPhoto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class TripController extends Controller
{
    // GET /api/trips
public function index()
{
    return Trip::with(['user', 'photos', 'matches', 'country', 'likes.user'])
        ->withCount(['likes', 'comments'])
        ->get();
}



    // POST /api/trips
    public function store(Request $request)
    {
        Log::info('🚀 Incoming trip request', $request->all());

        try {
            $data = $request->validate([
                'Userid'              => 'required|exists:users,Userid',
                'title'               => 'required|string|max:255',
                'Description'         => 'required|string',
                'Destination_country' => 'required|string|max:100',
                'Destination_city'    => 'required|string|max:100',
                'Departuredate'       => 'required|date',
                'Return_date'         => 'required|date|after_or_equal:Departuredate',
                'Travel_STYLE'        => 'required|string|max:100',
                'Budget_estimated'    => 'required|numeric',
                'Looking_for'         => 'required|string|max:255',
                'photos.*'            => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('❌ Validation failed', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        }

        $trip = Trip::create($data);

        if ($request->hasFile('photos')) {
            foreach ($request->file('photos') as $photo) {
                $path = $photo->store('trip_photos', 'public');

                TripPhoto::create([
                    'Tripid'     => $trip->Tripid,
                    'image_path' => $path,
                ]);
            }
        }

        return response()->json([
            'message' => 'Trip created successfully.',
            'trip'    => $trip->load('photos'),
        ], 201);
    }

    // GET /api/trips/{id}
    public function show($id)
    {
        return Trip::with(['user', 'comments', 'photos', 'matches', 'country'])
            ->withCount(['likes', 'comments'])
            ->findOrFail($id);
    }

    // PUT /api/trips/{id}
    public function update(Request $request, $id)
    {
        $trip = Trip::findOrFail($id);

        $validated = $request->validate([
            'title'               => 'sometimes|string|max:255',
            'Description'         => 'sometimes|string',
            'Destination_country' => 'sometimes|string|max:100',
            'Destination_city'    => 'sometimes|string|max:100',
            'Departuredate'       => 'sometimes|date',
            'Return_date'         => 'sometimes|date|after_or_equal:Departuredate',
            'Travel_STYLE'        => 'sometimes|string|max:100',
            'Budget_estimated'    => 'sometimes|numeric',
            'Looking_for'         => 'sometimes|string|max:255',
        ]);

        $trip->update($validated);

        return response()->json([
            'message' => 'Trip updated successfully.',
            'trip'    => $trip,
        ]);
    }

    // DELETE /api/trips/{id}
    public function destroy($id)
    {
        $trip = Trip::findOrFail($id);

        // Delete photos from storage and DB
        foreach ($trip->photos as $photo) {
            Storage::disk('public')->delete($photo->image_path);
            $photo->delete();
        }

        $trip->delete();

        return response()->json(['message' => 'Trip deleted successfully.']);
    }
}
