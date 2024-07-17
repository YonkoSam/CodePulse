<?php

namespace App\Http\Controllers;

use App\Models\Friendship;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FriendController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $friends = $user->friends()->with(['profile' => function ($query) {
            $query->select('user_id', 'status', 'profiles.id');
        }])->get();
        $friendOf = $user->friendOf()->with(['profile' => function ($query) {
            $query->select('user_id', 'status', 'profiles.id');
        }])->get();
        $blockedFriendShip = Friendship::where(['blocked_initiator' => $user->id, 'blocked' => '1'])->get();

        $blockedFriends = [];
        foreach ($blockedFriendShip as $friendShip) {
            if ($friendShip->user_id == $user->id) {
                $blockedFriends[] = User::find($friendShip->friend_id);
            }
            if ($friendShip->friend_id == $user->id) {
                $blockedFriends[] = User::find($friendShip->user_id);
            }
        }

        return Inertia::render('Friends/index', [
            'friends' => array_merge($friends->toArray(), $friendOf->toArray()),
            'blockedFriends' => $blockedFriends,
        ]);
    }

    public function destroy(User $friend)
    {
        $user = Auth::user();

        if ($user->friends()->where('friend_id', $friend->id)->exists() || $user->friendOf()->where('user_id', $friend->id)->exists()) {

            $user->friends()->detach($friend->id);

            $user->friendOf()->detach($friend->id);

            return back();

        } else {
            return back()->withErrors(['message' => 'Friendship was not found!']);
        }

    }

    public function block(User $friend)
    {
        $user = Auth::user();
        $friendship = Friendship::where(function ($query) use ($user, $friend) {
            $query->where('user_id', $user->id)
                ->where('friend_id', $friend->id);
        })->orWhere(function ($query) use ($user, $friend) {
            $query->where('user_id', $friend->id)
                ->where('friend_id', $user->id);
        })->first();

        if ($friendship) {
            if ($friendship->blocked) {
                return back()->withErrors(['message' => 'you cant block this user!']);
            }
            $friendship->blocked = true;
            $friendship->blocked_initiator = $user->id;
            $friendship->save();

            return back();
        } else {
            return back()->withErrors(['message' => 'Friendship was not found!']);
        }
    }

    public function unblock(User $friend)
    {

        $user = Auth::user();

        $friendship = Friendship::where(function ($query) use ($user, $friend) {
            $query->where('user_id', $user->id)
                ->where('friend_id', $friend->id);
        })->orWhere(function ($query) use ($user, $friend) {
            $query->where('user_id', $friend->id)
                ->where('friend_id', $user->id);
        })->first();

        if ($friendship) {
            $friendship->delete();

            return back();
        } else {
            return back()->withErrors(['message' => 'Friendship was not found!']);
        }

    }
}
