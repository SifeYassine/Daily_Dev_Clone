<?php

use App\Models\Post;
use App\Events\PostBroadCastEvent;
use App\Http\Controllers\api\auth\AuthController;
use App\Http\Controllers\api\users\UserController;
use App\Http\Controllers\api\posts\PostController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Register & login routes
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    // Logged User route
    Route::get('auth/user', [AuthController::class, 'user']);
    // Logout route
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // User routes
    Route::post('users/update-profile', [UserController::class, 'updateProfileImage']);

    // Post routes
    Route::post('posts/create', [PostController::class, 'create']);
    Route::get('/posts/index', [PostController::class, 'index']);
});

// Broadcast routes
Route::post("/test/channel", function (Request $request) {
    $post = Post::select("*")->with("user")->orderBy("id", "desc")->first();
    
    PostBroadCastEvent::dispatch($post);

    return response()->json([
        "message" => "Data sent to client successfully"
    ]);
});