<?php

namespace App\Http\Controllers\api\comments;

use App\Models\Comment;
use App\Events\CommentBroadCastEvent;
use App\Events\CommentIncrement;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Validator;

class CommentController extends Controller
{
    // Create a new comment
    public function create(Request $request)
    {
        try {
            $validateComment = Validator::make($request->all(), [
                'comment' => 'required|string|min:2|max:20000',
                'post_id' => 'required|exists:posts,id',
            ]);

            if ($validateComment->fails()) {
                return response()->json([
                    'status' => 400,
                    'message' => 'Validation error',
                    'errors' => $validateComment->errors(),
                ], 400);
            }

            $comment = Comment::create([
                'comment' => $request->comment,
                'user_id' => Auth::id(),
                'post_id' => $request->post_id,
            ]);

            // Load the user & post relationship
            $comment->load('user:id,username,profile_image', 'post:id,comment_count');

            // Increment the post's comment count
            $comment->post->increment('comment_count', 1);

            // Transform the user_id key to include the user's info
            if ($comment->user) {
                $comment->user_id = [
                    'id' => $comment->user->id,
                    'username' => $comment->user->username,
                    'profile_image' => $comment->user->profile_image,
                ];
            }

             // Remove the user & post keys from the comment
             unset($comment->user);
             unset($comment->post);

            // Broadcast the comment
            CommentBroadCastEvent::dispatch($comment);

            // Broadcast the comment increment
            CommentIncrement::dispatch($comment->post_id);



            return response()->json([
                'status' => 200,
                'message' => 'Comment created successfully',
                'comment' => $comment,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 500,
                'message' => $th->getMessage(),
            ], 500);
        }
    }

    // Get all comments
    public function index($id)
    {
        try {
            // Get all comments in a post (post_id)
            $comments = Comment::with('user:id,username,profile_image')->where('post_id', $id)->cursorPaginate(10);

            // Tranform the user_id key to include the user's info
            $comments->transform(function ($comment) {
                if ($comment->user_id) {
                    $comment->user_id = [
                        'id' => $comment->user->id,
                        'username' => $comment->user->username,
                        'profile_image' => $comment->user->profile_image,
                    ];
                }
                // Remove the user key from the comment
                unset($comment->user);
                return $comment;
            });

            return response()->json([
                'status' => 200,
                'message' => 'All comments',
                'comments' => $comments,
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 500,
                'message' => $th->getMessage()
            ], 500);
        }
    }
}
