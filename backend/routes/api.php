<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TripController;
use App\Http\Controllers\TripMatchController;
use App\Http\Controllers\TripCommentController;
use App\Http\Controllers\TripPhotoController;
use App\Http\Controllers\CountryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;

Route::apiResource('trips', TripController::class);
Route::apiResource('trip-matches', TripMatchController::class);
Route::apiResource('trip-comments', TripCommentController::class);
Route::apiResource('trip-photos', TripPhotoController::class);
Route::apiResource('countries', CountryController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('roles', RoleController::class);


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

Route::get('/test-api', function () {
    return response()->json(['status' => 'API working']);
});