<?php

namespace App\Http\Controllers;

use App\Models\Trip;
use Illuminate\Http\Request;

class TripController extends Controller
{
    // GET /api/trips
    public function index()
    {
        return Trip::with(['user', 'comments', 'photos', 'matches', 'country'])->get();
    }

    // POST /api/trips
    public function store(Request $request)
    {
        $data = $request->validate([
            'Userid' => 'required|exists:users,id',
            'title' => 'required|string',
            'Description' => 'required|string',
            'Destination_country' => 'required|string',
            'Destination_city' => 'required|string',
            'Departuredate' => 'required|date',
            'Return_date' => 'required|date|after_or_equal:Departuredate',
            'Travel_STYLE' => 'required|string',
            'Budget_estimated' => 'required|numeric',
            'Looking_for' => 'required|string',
        ]);

        return Trip::create($data);
    }

    // GET /api/trips/{id}
    public function show($id)
    {
        return Trip::with(['user', 'comments', 'photos', 'matches', 'country'])->findOrFail($id);
    }

    // PUT /api/trips/{id}
    public function update(Request $request, $id)
    {
        $trip = Trip::findOrFail($id);

        $trip->update($request->only([
            'Userid', 'title', 'Description', 'Destination_country', 'Destination_city',
            'Departuredate', 'Return_date', 'Travel_STYLE', 'Budget_estimated', 'Looking_for'
        ]));

        return response()->json([
            'message' => 'Trip updated successfully.',
            'data' => $trip
        ]);
    }

    // DELETE /api/trips/{id}
    public function destroy($id)
    {
        Trip::destroy($id);

        return response()->json([
            'message' => 'Trip deleted successfully.'
        ]);
    }
}
