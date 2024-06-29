<?php

namespace App\Http\Controllers;

use App\Events\NotificationSent;
use App\Models\Comment;
use App\Notifications\ReplyNotification;

class ReplyController extends Controller
{
    public function __invoke()
    {
        $commentData = request()->validate([
            'text' => 'required|min:1',
            'post_id' => 'required',
            'user_id' => 'required',
            'comment_id' => 'required',
        ]);

        $reply = Comment::create($commentData);
        $comment = Comment::with('replies.user')->find($reply->comment_id);
        $uniqueUsers = [];

        foreach ($comment->replies as $reply) {
            if (! isset($uniqueUsers[$reply->user_id]) && $reply->user_id != $comment->user_id && $reply->user_id != auth()->user()->id) {
                $uniqueUsers[$reply->user_id] = $reply->user;
            }
        }
        foreach ($uniqueUsers as $user) {
            $latestReply = $comment->replies()->latest()->first();
            sleep(0.2);
            $user->notify(new ReplyNotification($latestReply, ' has replied on a comment you follow.'));
            event(new NotificationSent($user->id));
        }

        if ($reply->user_id != $comment->user_id) {
            $comment->user->notify(new ReplyNotification($reply));
            event(new NotificationSent($comment->user_id));
        }

        return back();
    }
}
