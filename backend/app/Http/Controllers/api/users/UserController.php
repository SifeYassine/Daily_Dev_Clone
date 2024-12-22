<?php

namespace App\Http\Controllers\api\users;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class UserController extends Controller
{
    // Update Profile Image
    public function updateProfileImage(Request $request)
    {
        try {
            $validateUser = Validator::make($request->all(), [
                'profile_image' => 'required|image|mimes:png,jpeg,jpg,webp,svg|max:2048',
            ]);

            if ($validateUser->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Validation error',
                    'errors' => $validateUser->errors()
                ], 400);
            }

            $user = Auth::user();

            $user->update([
                'profile_image' => $request->profile_image->store('profile_images', 'public'),
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Profile image updated successfully',
                'user' => $user
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
