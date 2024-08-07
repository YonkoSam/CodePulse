<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Lukeraymonddowning\SelfHealingUrls\Concerns\HasSelfHealingUrls;
use Mpociot\Teamwork\TeamworkTeam;

class Pulse extends Model
{
    use HasFactory, HasSelfHealingUrls;

    protected string $slug = 'title';

    protected $fillable = ['user_id', 'text', 'title', 'code', 'team_id'];

    protected $casts = [
        'code' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(TeamworkTeam::class);
    }

    public function scopeVisibleToUser($query, $userId)
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

    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }
}
