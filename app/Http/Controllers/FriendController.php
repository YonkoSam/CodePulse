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

        return Inertia::render('Friends/index', [
            'code-mates' => $user->allFriends()->with('profile:id,status,user_id')->paginate(12),
            'blockedList' => $user->blockedUsers(),
        ]);
    }

    public function destroy(User $friend)
    {
        $user = Auth::user();

        if ($user->isFriend($friend)) {
            $user->friends()->detach($friend->id);
            $user->friendOf()->detach($friend->id);
            $user->allMessagesWithFriend($friend->id)->delete();
            return back();

        } else {
            return back()->withErrors(['message' => 'Friendship was not found!']);
        }

    }

    public function block(User $friend)
    {
        $user = Auth::user();

        $friendship = Friendship::findFriendShip($friend->id);
        if ($friendship) {
            if ($friendship->blocked) {
                return back()->withErrors(['message' => 'you cant block this user!']);
            }
            $friendship->blocked = true;
            $friendship->blocked_initiator = $user->id;
            $friendship->save();

        } else {
            Friendship::create([
                'user_id' => $user->id,
                'friend_id' => $friend->id,
                'blocked' => true,
                'blocked_initiator' => $user->id,
            ]);

        }

        return redirect()->route('friends.index');
    }

    public function unblock(User $friend)
    {

        $friendship = Friendship::findFriendShip($friend->id);

        if ($friendship) {
            if ($friendship->blocked_initiator == $friend->id) {
                return back()->withErrors(['message' => 'you can unblock this user!']);
            }
            $friendship->delete();

            return back();
        } else {
            return back()->withErrors(['message' => 'Friendship was not found!']);
        }

    }
}
