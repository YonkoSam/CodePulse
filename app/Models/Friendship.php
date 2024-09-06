<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Friendship extends Model
{
    protected $fillable = ['user_id', 'friend_id', 'blocked', 'blocked_initiator','last_message_timestamp'];

    public static function findFriendShip(int $friendId): ?Friendship
    {

        $userId = auth()->id();

        return self::where(function ($query) use ($userId, $friendId) {
            $query->where('user_id', $userId)
                ->where('friend_id', $friendId);
        })->orWhere(function ($query) use ($userId, $friendId) {
            $query->where('user_id', $friendId)
                ->where('friend_id', $userId);
        })->first();
    }

    public function updateLastMessageTimestamp(): void
    {
        $this->update(['last_message_timestamp' => now()]);
    }


}
