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
            'pulse_id' => 'required|exists:pulses,id',
        ]);

        $user = Auth::user()->id;

        $existingLike = Like::where('user_id', $user)
            ->where('pulse_id', $data['pulse_id'])
            ->first();

        if ($existingLike) {
            $existingLike->delete();

            return response()->json(['like', false]);
        } else {
            $like = Like::create([
                'user_id' => $user,
                'pulse_id' => $data['pulse_id'],
            ]);

            $notificationExists = DB::table('notifications')
                ->where('type', 'App\Notifications\LikeNotification')
                ->where('data->pulse_id', $data['pulse_id'])
                ->where('data->user_id', $user)
                ->exists();

            if (! $notificationExists && $like->user_id != $like->pulse->user_id) {

                $notification = new LikeNotification($like);
                $like->pulse->user->notify($notification);
                event(new NotificationSent($like->pulse->user_id));

            }

            return response()->json(['like', true]);

        }

    }
}
