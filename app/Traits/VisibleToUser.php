<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait VisibleToUser
{
    public function scopeVisibleToUser(Builder $query, $userId)
    {
        return $query->whereHas('user', function ($userQuery) {
            $userQuery->where('is_suspended', false);
        })->where(function ($query) use ($userId) {
            $query->where('user_id', $userId)
                ->orwhereNotIn('user_id', function ($query) use ($userId) {
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
}
