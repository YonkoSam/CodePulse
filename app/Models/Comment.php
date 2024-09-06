<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Comment extends Model
{
    protected $fillable = ['user_id', 'pulse_id', 'text', 'comment_id', 'code','is_best_answer'];

    protected $casts = [
        'code' => 'array',
    ];

    public function scopeVisibleToUser($query, int $userId)
    {
        return $query->whereNotIn('user_id', function ($query) use ($userId) {
            $query->select('friend_id')
                ->from('friendships')
                ->where('user_id', $userId)
                ->where('blocked', true)
                ->union(function ($query) use ($userId) {
                    $query->select('user_id')
                        ->from('friendships')
                        ->where('friend_id', $userId)
                        ->where('blocked', true);
                });
        });
    }
    public function markAsBestAnswer(): void
    {
        $this->is_best_answer = true;
        $this->save();
    }

    public function unmarkAsBestAnswer(): void
    {
        $this->is_best_answer = false;
        $this->save();
    }


    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reports(): MorphMany
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function pulse(): BelongsTo
    {
        return $this->belongsTo(Pulse::class);
    }

    public function replies(): hasMany
    {
        return $this->hasMany(Comment::class, 'comment_id')->with('replies','user');
    }
}
