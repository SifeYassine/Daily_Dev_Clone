<?php

namespace App\Http\Controllers\api\posts;

use App\Models\Post;
use App\Events\PostBroadCastEvent;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class PostController extends Controller
{
    // Create a new post
    public function create(Request $request)
    {
        try {
            $validatePost = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'url' => 'nullable|url:https',
                'image_url' => 'required|url:https,http',
            ]);
    
            if ($validatePost->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Validation error',
                    'errors' => $validatePost->errors(),
                ], 400);
            }

            $post = Post::create([
                'title' => $request->title,
                'description' => $request->description,
                'url' => $request->url,
                'image_url' => $request->image_url,
                'user_id' => Auth::id(),
            ]);
    
            // Load the user relationship
            $post->load('user');
    
            // Transform the user_id key to include the user's info
            if ($post->user) {
                $post->user_id = [
                    'id' => $post->user->id,
                    'username' => $post->user->username,
                    'profile_image' => $post->user->profile_image,
                ];
            }
    
            // Remove the user key from the post
            unset($post->user);
    
            // Broadcast the post
            PostBroadCastEvent::dispatch($post);
    
            // Return success response
            return response()->json([
                'status' => 200,
                'message' => 'Post created successfully',
                'post' => $post,
            ], 200);
        } catch (\Throwable $th) {
            // Handle any exceptions
            return response()->json([
                'status' => 500,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    // Get all posts
    public function index()
    {
        try {
            $posts = Post::with('user')->cursorPaginate(10);

            // Tranform the user_id key to include the user's info

            $posts->transform(function ($post) {
                if ($post->user_id) {
                    $post->user_id = [
                        'id' => $post->user->id,
                        'username' => $post->user->username,
                        'profile_image' => $post->user->profile_image,
                    ];
                }
                // Remove the user key from the post
                unset($post->user);
                return $post;
            });

            return response()->json([
                'status' => 200,
                'message' => 'All posts',
                'posts' => $posts,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
