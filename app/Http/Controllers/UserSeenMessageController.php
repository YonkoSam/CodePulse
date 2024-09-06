<?php

namespace App\Http\Controllers;

use App\Events\MessageSeen;
use App\Events\MessageSeenGroupChat;
use App\Models\Message;
use App\Models\Team;

class UserSeenMessageController extends Controller{
    public function __invoke()
    {
        $user = auth()->user();
        if (!auth()->check() )
            abort(401);
        request()->validate(
            [
                'msgId' => 'required',
            ],
        );


        $message = Message::findOrFail(request()->msgId);
        if($message->receiver_id){
            if ($message->receiver_id != $user->id )
                abort(401);
            $message->markAsSeen();
            event(new MessageSeen($message->sender_id, $message->receiver_id));
            return;
        }
        if($message->team_id) {
            $team = Team::findOrFail($message->team_id);
            if (!$team->hasUser($user))
                abort(401);
            $message->markAsSeen($user->id);


            event(new MessageSeenGroupChat($team->id,$user));
        }

    }
}
