<?php

namespace App\Http\Controllers;

use App\Enums\XpAction;
use App\Models\Like;
use App\Notifications\LikeNotification;
use App\Services\XpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LikeController extends Controller
{
    public function store(Request $request,XpService  $xpService)
    {

        $data = $request->validate([
            'pulse_id' => ['required'],
            'comment_id' => ['nullable'],
        ]);

        $userId = auth()->id();

        $likeableType = isset($data['comment_id']) ? 'comment_id' : 'pulse_id';
        $likeableId = $data[$likeableType];

        $existingLike = Like::where('user_id', $userId)
            ->where($likeableType, $likeableId)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            return response()->json(['like' => false]);
        }

        $like = Like::create([
            'user_id' => $userId,
            $likeableType => $likeableId,
        ]);

        $notificationExists = DB::table('notifications')
            ->where('type', LikeNotification::class)
            ->where("data->{$likeableType}", $likeableId)
            ->where('data->user_id', $userId)
            ->exists();


        if (!$notificationExists && $like->user_id) {
            if ($likeableType === 'comment_id' && $like->user_id != $like->comment->user_id) {
                $like->comment->user->notify(new LikeNotification($like));
                $xpService->assignPoints($like->comment->user->profile, XpAction::RECEIVE_LIKE_ON_COMMENT);
            } elseif ($likeableType === 'pulse_id' && $like->user_id != $like->pulse->user_id) {
                $like->pulse->user->notify(new LikeNotification($like));
                $xpService->assignPoints($like->pulse->user->profile, XpAction::RECEIVE_LIKE_ON_PULSE);
            }
        }


            return response()->json(['like'=> true]);


    }
}
