<?php

namespace App\Http\Controllers;

use App\Events\NotificationSent;
use App\Models\Like;
use App\Notifications\LikeNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class LikeController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'post_id' => 'required|exists:posts,id',
        ]);

        $user = Auth::user()->id;

        $existingLike = Like::where('user_id', $user)
            ->where('post_id', $data['post_id'])
            ->first();

        if ($existingLike) {
            $existingLike->delete();

            return back();
        } else {
            $like = Like::create([
                'user_id' => $user,
                'post_id' => $data['post_id'],
            ]);

            $notificationExists = DB::table('notifications')
                ->where('type', 'App\Notifications\LikeNotification')
                ->where('data->post_id', $data['post_id'])
                ->where('data->user_id', $user)
                ->exists();

            if (! $notificationExists && $like->user_id != $like->post->user_id) {

                $notification = new LikeNotification($like);
                $like->post->user->notify($notification);
                event(new NotificationSent($like->post->user_id));

            }

            return back();

        }

    }
}
