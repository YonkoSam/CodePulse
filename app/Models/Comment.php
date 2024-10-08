<?php

namespace App\Models;

use App\Traits\VisibleToUser;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Comment extends Model
{
    use VisibleToUser;

    protected $fillable = ['user_id', 'pulse_id', 'text', 'comment_id', 'code', 'is_best_answer'];

    protected $casts = [
        'code' => 'array',
    ];

    public function markAsBestAnswer(): void
    {
        $this->is_best_answer = true;
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
        return $this->hasMany(Comment::class, 'comment_id')->with(['user', 'replies', 'user.profile' => fn ($query) => $query->select(['id', 'xp', 'user_id']), 'likes' => function ($query) {
            $query->select(['id', 'user_id', 'comment_id'])
                ->whereNotNull('comment_id');
        }]);
    }
}
