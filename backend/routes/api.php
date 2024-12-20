<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\auth\AuthController;

// Register & login routes
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    // Logged User route
    Route::get('auth/user', [AuthController::class, 'user']);
    // Logout route
    Route::post('auth/logout', [AuthController::class, 'logout']);
});
