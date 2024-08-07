<?php

namespace App\Models;

use App\Enums\MessageType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Mpociot\Teamwork\TeamworkTeam;

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

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function usersSeen(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_user_message_reads')
            ->withPivot('seen_at');
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(TeamworkTeam::class, 'team_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }
}
