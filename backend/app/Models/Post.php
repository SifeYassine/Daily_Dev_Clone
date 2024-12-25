<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'url',
        'image_url',
        'comment_count',
        'vote',
        'user_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
