<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;

class CountryController extends Controller
{
    public function index()
    {
        return Country::with('trip')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'Name' => 'required|string',
            'Image_path' => 'nullable|string',
        ]);

        return Country::create($data);
    }


    public function show($id)
    {
        return Country::with('trip')->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $country = Country::findOrFail($id);
        $country->update($request->all());
        return $country;
    }

    public function destroy($id)
    {
        Country::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
