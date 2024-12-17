<?php

namespace App\Http\Controllers\api\auth;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Validator;

class AuthController extends Controller
{
    // Register new user
    public function register(Request $request)
    {
        try {
            $validateUser = Validator::make($request->all(), [
                'username' => 'required|string|max:50|unique:users,username',
                'email' => 'required|string|max:255|unique:users,email',
                'password' => 'required|string|min:6|confirmed',
                'profile_image' => 'nullable|string|max:255',
            ]);

            if ($validateUser->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Validation error',
                    'errors' => $validateUser->errors()
                ], 400);
            }

            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'profile_image' => $request->profile_image
            ]);

            return response()->json([
                'status' => 200,
                'message' => 'User registered successfully',
                'user' => $user
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    // Login user
    public function login(Request $request)
    {
        try {
            $validateUser = Validator::make($request->all(), [
                'username' => 'required|string',
                'password' => 'required|string'
            ]);

            if ($validateUser->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Validation error',
                    'errors' => $validateUser->errors()
                ], 400);
            }

            if (!Auth::attempt($request->only(['username', 'password']))) {
                return response()->json([
                    'status' => 401,
                    'message' => 'Wrong username and/or password',
                ], 401);
            }

            $user = Auth::user();
            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'message' => 'User logged in successfully',
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    // Logout user
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 200,
            'message' => 'User logged out successfully',
        ], 200);
    }
}
