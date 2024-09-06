<?php

namespace App\Http\Controllers;

use App\Models\Message;

class UserSeenListController extends Controller{
    public function __invoke(Message $message)
    {
        $user = auth()->user();
        $team = $message->team;
        $query = request()->query('search', '');
        if (!$team->hasUser($user)) {
            abort(403);
        }

        $query = trim($query);
        $usersSeenQuery = $message->usersSeen()->newQuery();

        if (!empty($query)) {
            $usersSeenQuery->where(function($q) use ($query) {
                $q->where('name','like',"%{$query}%");
            });
        }



        $usersSeen = $usersSeenQuery->paginate(10);

        return response()->json(['usersSeen' => $usersSeen]);
    }

}
