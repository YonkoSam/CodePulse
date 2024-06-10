<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FriendController extends Controller
{
    public function index()
    {

        $friends = Auth::user()->friends()->with(['profile' => function ($query) {
            $query->select('user_id', 'status', 'profiles.id');
        }])->get();

        return Inertia::render('Friends/index', [
            'friends' => $friends,
        ]);
    }

    public function destroy(User $friend)
    {
        $user = Auth::user();

        if ($user->friends()->where('friend_id', $friend->id)->exists() || $user->friendOf()->where('user_id', $user->id)->exists()) {

            $user->friends()->detach($friend->id);

            $user->friendOf()->detach($friend->id);

            return back();

        } else {
            return back()->withErrors(['message' => 'Friendship was not found!']);
        }

    }
}
