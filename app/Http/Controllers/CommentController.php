<?php

namespace App\Http\Controllers;

use App\Events\NotificationSent;
use App\Models\Comment;
use App\Notifications\CommentNotification;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function store()
    {
        $comment = request()->validate([
            'text' => 'required|min:1',
            'post_id' => 'required',
            'user_id' => 'required',
        ]);

        $commentObject = Comment::create($comment);

        if ($commentObject->user != $commentObject->post->user) {
            $commentObject->post->user->notify(new CommentNotification($commentObject));
            event(new NotificationSent($commentObject->post->user_id));
        }

        return back();

    }

    public function destroy(Comment $comment)
    {

        $comment->replies()->delete();
        $comment->delete();
        $notification = DB::table('notifications')
            ->where('data->comment_id', $comment->id)
            ->first();

        if ($notification) {
            DB::table('notifications')->delete($notification->id);
        }

        return back();

    }
}
