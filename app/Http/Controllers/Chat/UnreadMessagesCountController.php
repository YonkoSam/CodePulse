<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;

class UnreadMessagesCountController extends Controller
{
    public function __invoke()
    {
        $user = auth()->user();
        $unreadTeamChatCount = $user?->teams()->get()->sum(function ($team) use ($user) {
            return $team->unreadMessages($user)->count();
        });
        $unreadChatCount = $user?->unreadMessages()->count();

        $UnreadMessagesCount = $unreadTeamChatCount + $unreadChatCount;

        return response()->json(['unreadCount' => $UnreadMessagesCount]);
    }
}
