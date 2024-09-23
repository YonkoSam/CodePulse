<?php

namespace App\Http\utils;

use App\Http\Controllers\Controller;
use App\Models\Pulse;
use App\Models\User;

class SearchController extends Controller
{
    public function __invoke($query)
    {

        if (! auth()->check()) {
            return response()->json(['error' => 'Unauthenticated'], 401);

        }
        $type = explode('*.*.*.*', $query)[1];
        $query = explode('*.*.*.*', $query)[0];
        $data = [];
        switch ($type) {
            case 'Friends':
                $data = auth()->user()->allFriends()
                    ->where('name', 'like', '%'.$query.'%')
                    ->limit(10)->get();
                break;
            case 'Users':
                $data = User::whereNot('id', auth()->id())
                    ->whereHas('profile')
                    ->visible(auth()->id())->where('name', 'LIKE', '%'.$query.'%')
                    ->with('profile:id,user_id')->limit(10)->get();
                break;
            case 'pulses':
                $data = Pulse::visibleToUser(auth()->id())
                    ->where('team_id', auth()->user()?->current_team_id)
                    ->where('title', 'LIKE', '%'.$query.'%')
                    ->limit(10)->get();
                break;
        }

        return response()->json(['data' => $data], 200);

    }
}
