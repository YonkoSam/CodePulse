<?php

namespace App\Models;

use App\Enums\MessageType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Message extends Model
{
    use HasFactory,SoftDeletes;

    protected $fillable = ['sender_id', 'receiver_id', 'message', 'type', 'team_id'];

    protected $casts = [
        'type' => MessageType::class,
    ];

    public function scopeVisibleSinceJoined($query, $teamId, $userId)
    {
        $joinTimestamp = DB::table('team_user')
            ->where('team_id', $teamId)
            ->where('user_id', $userId)
            ->value('created_at');

        if ($joinTimestamp) {
            return $query->where('team_id', $teamId)
                ->where('created_at', '>=', $joinTimestamp);
        }

        return null;
    }

    public function scopeVisibleToUser($query, $userId)
    {
        return $query->whereHas('sender', function ($userQuery) {
            $userQuery->where('is_suspended', false);
        })->where(function ($query) use ($userId) {
            $query->where('user_id', $userId)
                ->orWhereNotIn('sender_id', function ($query) use ($userId) {
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
        });
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function reports(): MorphMany
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    public function markAsSeen(?int $userID = null): void
    {
        if ($this->receiver_id) {
            $this->seen_at = now();
            $this->save();
        } else {
            $this->usersSeen()->attach($userID, ['seen_at' => now()]);
        }
    }

    public function usersSeen(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_user_message_reads')
            ->withPivot('seen_at');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class, 'team_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
