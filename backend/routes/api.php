<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Broadcast;

use App\Http\Controllers\{
    TripController,
    TripMatchController,
    TripCommentController,
    TripPhotoController,
    CountryController,
    UserController,
    RoleController,
    AuthController,
    MessageController,
    NotificationController,
    TripLikeController
};

use App\Models\{User, Trip, TripMatch, TripComment};

// ✅ Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ✅ Public Resources
Route::apiResource('trip-photos', TripPhotoController::class);
Route::apiResource('countries', CountryController::class);
Route::apiResource('users', UserController::class);
Route::apiResource('roles', RoleController::class);

// ✅ Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // ✅ Trips
    Route::get('/trips', [TripController::class, 'index']);
    Route::post('/trips', [TripController::class, 'store']);
    Route::put('/trips/{trip}', [TripController::class, 'update']);
    Route::delete('/trips/{trip}', [TripController::class, 'destroy']);
    Route::get('/trips/{trip}', [TripController::class, 'show']);

    // ✅ Likes & Comments
    Route::post('/trips/{tripId}/likes', [TripLikeController::class, 'store']);
    Route::delete('/trips/{tripId}/likes', [TripLikeController::class, 'destroy']);
    Route::get('/trips/{tripId}/comments', [TripCommentController::class, 'index']);
    Route::post('/trips/{tripId}/comments', [TripCommentController::class, 'store']);

    // ✅ Trip Matches & Notifications
    Route::apiResource('trip-matches', TripMatchController::class);
    Route::get('/my-match-requests', [TripMatchController::class, 'myMatchRequests']);
    Route::get('/notifications', [NotificationController::class, 'index']);

    // ✅ User Info
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', fn(Request $request) => $request->user()->load('role'));
    Route::get('/user', fn(Request $request) => $request->user());
    Route::put('/users/{id}', [UserController::class, 'update']);

    // ✅ Messaging
    Route::get('/messages', [MessageController::class, 'index']);
    Route::post('/messages', [MessageController::class, 'store']);
    Route::get('/messages/with/{userId}', [MessageController::class, 'withUser']);
});

// ✅ Debug Route
Route::post('/debug-trip', function (Request $request) {
    Log::info('Reached /debug-trip', $request->all());
    return response()->json(['status' => 'received']);
});

// ✅ Public Test Endpoint
Route::get('/test-api', fn() => response()->json(['status' => 'API working']));

// ✅ Protected Statistics Endpoint
Route::middleware('auth:sanctum')->get('/statistics', function () {
    $mostLikedPosts = DB::table('trip_likes')
        ->select('Tripid', DB::raw('COUNT(*) as like_count'))
        ->groupBy('Tripid')
        ->orderByDesc('like_count')
        ->limit(5)
        ->get()
        ->map(function ($like) {
            $title = Trip::where('Tripid', $like->Tripid)->value('Title');
            return [
                'Tripid' => $like->Tripid,
                'Title' => $title ?? 'Untitled',
                'Likes' => $like->like_count,
            ];
        });

    return response()->json([
        'totalUsers' => User::count(),
        'totalTrips' => Trip::count(),
        'totalMatches' => TripMatch::count(),
        'totalComments' => TripComment::count(),
        'topCountries' => Trip::select('Destination_country')
            ->groupBy('Destination_country')
            ->selectRaw('Destination_country, COUNT(*) as count')
            ->orderByDesc('count')
            ->take(5)
            ->get(),
        'mostLikedPosts' => $mostLikedPosts,
    ]);
});
