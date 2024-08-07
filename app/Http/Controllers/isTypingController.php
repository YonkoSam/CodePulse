<?php

namespace App\Http\Controllers;

use App\Events\isTypingEvent;
use App\Events\isTypingGroupChat;
use Illuminate\Http\Request;

class isTypingController extends Controller
{
    public function __invoke(Request $request)
    {
        request()->validate([
            'receiver' => 'required_without:team',
            'team' => 'required_without:receiver',
            'isTyping' => 'required',
        ]);

        $receiver = $request->receiver;
        $team = $request->team;
        $isTyping = $request->isTyping;

        if ($receiver) {
            event(new isTypingEvent($receiver, auth()->id(), $isTyping));
        }

        if ($team) {
            event(new isTypingGroupChat(auth()->user(), $team, $isTyping));
        }

    }
}
