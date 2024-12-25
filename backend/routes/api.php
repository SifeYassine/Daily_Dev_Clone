<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\auth\AuthController;
use App\Http\Controllers\api\users\UserController;
use App\Http\Controllers\api\posts\PostController;

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
