<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use App\Models\TripPhoto;
use App\Models\TripMatch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class TripController extends Controller
{
    // GET /api/trips
    public function index()
    {
        return Trip::with(['user', 'photos', 'matches', 'country', 'likes.user'])
            ->withCount(['likes', 'comments'])
            ->get();
    }

    // GET /api/trips/match-requests
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

    // POST /api/trips
    public function store(Request $request)
    {
        Log::info('🚀 Incoming trip request', $request->all());

        try {
            $data = $request->validate([
                'Userid'            => 'required|exists:users,Userid',
                'title'             => 'required|string|max:255',
                'Description'       => 'required|string',
                'Countryid'         => 'required|exists:countries,Countryid',
                'Destination_city'  => 'required|string|max:100',
                'Departuredate'     => 'required|date',
                'Return_date'       => 'required|date|after_or_equal:Departuredate',
                'Travel_STYLE'      => 'required|string|max:100',
                'Budget_estimated'  => 'required|numeric',
                'Looking_for'       => 'required|string|max:255',
                'photos.*'          => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('❌ Validation failed', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        }

        $trip = Trip::create([
            'Userid'            => $data['Userid'],
            'title'             => $data['title'],
            'Description'       => $data['Description'],
            'Countryid'         => $data['Countryid'],
            'Destination_city'  => $data['Destination_city'],
            'Departuredate'     => $data['Departuredate'],
            'Return_date'       => $data['Return_date'],
            'Travel_STYLE'      => $data['Travel_STYLE'],
            'Budget_estimated'  => $data['Budget_estimated'],
            'Looking_for'       => $data['Looking_for'],
        ]);

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
            'title'             => 'sometimes|string|max:255',
            'Description'       => 'sometimes|string',
            'Countryid'         => 'sometimes|exists:countries,Countryid',
            'Destination_city'  => 'sometimes|string|max:100',
            'Departuredate'     => 'sometimes|date',
            'Return_date'       => 'sometimes|date|after_or_equal:Departuredate',
            'Travel_STYLE'      => 'sometimes|string|max:100',
            'Budget_estimated'  => 'sometimes|numeric',
            'Looking_for'       => 'sometimes|string|max:255',
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
