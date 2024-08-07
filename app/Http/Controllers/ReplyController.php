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
            'pulse_id' => 'required',
            'user_id' => 'required',
            'comment_id' => 'required',
            'code' => 'nullable',
        ]);

        if (! isset(request()->code['sourceCode'])) {
            $commentData['code'] = null;
        }
        $reply = Comment::create($commentData);
        $comment = Comment::with('replies.user')->find($reply->comment_id);

        if ($reply->user_id != $comment->user_id ) {
            if($comment->comment_id){
                $comment->user->notify(new ReplyNotification($reply,' has replied on one of your replies'));
            }
            else {
                $comment->user->notify(new ReplyNotification($reply));
            }
            event(new NotificationSent($comment->user_id));
        }

        return back();
    }
}
