<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TripController;
use App\Http\Controllers\TripMatchController;
use App\Http\Controllers\TripCommentController;
use App\Http\Controllers\TripPhotoController;
use App\Http\Controllers\CountryController;

Route::apiResource('trips', TripController::class);
Route::apiResource('trip-matches', TripMatchController::class);
Route::apiResource('trip-comments', TripCommentController::class);
Route::apiResource('trip-photos', TripPhotoController::class);
Route::apiResource('countries', CountryController::class);


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
