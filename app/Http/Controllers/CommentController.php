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
            'pulse_id' => 'required',
            'user_id' => 'required',
            'code' => 'nullable',
        ]);

        if (! isset(request()->code['sourceCode'])) {
            $comment['code'] = null;
        }
        $commentObject = Comment::create($comment);

        if ($commentObject->user != $commentObject->pulse->user) {
            $commentObject->pulse->user->notify(new CommentNotification($commentObject));
            event(new NotificationSent($commentObject->pulse->user_id));
        }

        return back();

    }

    public function destroy(Comment $comment)
    {

        if($comment->user_id != auth()->id()){
            abort(403);
        }
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
