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
use App\Http\Controllers\AuthController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\TripLikeController;


Route::post('/debug-trip', function (Request $request) {
    Log::info('✅ Reached /debug-trip', $request->all());
    return response()->json(['status' => 'received']);
    
});


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/trips', [TripController::class, 'index']);
    Route::post('/trips/{tripId}/likes', [TripLikeController::class, 'store']);
    Route::delete('/trips/{tripId}/likes', [TripLikeController::class, 'destroy']);
    Route::get('/trips/{tripId}/comments', [TripCommentController::class, 'index']);
    Route::post('/trips/{tripId}/comments', [TripCommentController::class, 'store']);
    Route::get('/my-match-requests', [TripMatchController::class, 'myPendingMatches']);

});

Route::get('/trips/{trip}', [TripController::class, 'show']);
Route::post('/trips', [TripController::class, 'store']);
Route::put('/trips/{trip}', [TripController::class, 'update']);
Route::delete('/trips/{trip}', [TripController::class, 'destroy']);

Route::apiResource('trip-matches', TripMatchController::class);
Route::apiResource('trip-photos', TripPhotoController::class);
Route::apiResource('countries', CountryController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('roles', RoleController::class);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/messages', [MessageController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store']);

Route::get('/test-api', function () {
    return response()->json(['status' => 'API working']);
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user()->load('role'); 
});

Route::middleware('auth:sanctum')->put('/users/{id}', [UserController::class, 'update']);
