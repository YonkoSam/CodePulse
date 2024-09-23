<?php

namespace App\Http\Controllers\Pulse;

use App\Enums\XpAction;
use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Pulse;
use App\Notifications\CommentNotification;
use App\Notifications\MarkedAsBestAnswerNotification;
use App\Services\ProfanityFilterService;
use App\Services\XpService;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    public function store(ProfanityFilterService $profanityFilterService,XpService $xpService)
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
        $comment = $profanityFilterService->filter($comment,['text']);
        $commentObject = Comment::create($comment);

        if ($commentObject->user != $commentObject->pulse->user) {
             $commentObject->pulse->user->notify(new CommentNotification($commentObject));
            $xpService->assignPoints($commentObject->pulse->user?->profile, XpAction::RECEIVE_LIKE_ON_PULSE);
        }

        return back();

    }
    public function update(Comment $comment,ProfanityFilterService  $profanityFilterService)
    {

        $commentObject = request()->validate([
            'text' => 'required|min:1',
        ]);

        $commentObject = $profanityFilterService->filter($commentObject,['text']);

        $comment->update($commentObject);

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

    public function markBestAnswer(Pulse $pulse, Comment $comment,XpService $xpService)
    {
        if ($pulse->is_answered) {
            return back()->withErrors(['message'=>'this pulse already answered']);
        }
        $comment->markAsBestAnswer();
        $pulse->markAsAnswered();
        if($comment->user_id != $pulse->user_id) {
            $xpService->assignPoints($comment->user?->profile, XPAction::BE_CHOSEN_BEST_ANSWER);
            $comment->user->notify(new MarkedAsBestAnswerNotification($comment));
        }

        return back();
    }

}
