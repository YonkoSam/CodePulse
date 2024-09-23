<?php

namespace App\Http\Controllers\Chat;

use App\Events\isTypingEvent;
use App\Events\isTypingGroupChat;
use App\Http\Controllers\Controller;
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

        $receiverId = $request->receiver;
        $team = $request->team;
        $isTyping = $request->isTyping;

        if ($receiverId) {
            event(new isTypingEvent($receiverId, auth()->id(), $isTyping));
        }

        if ($team) {
            event(new isTypingGroupChat(auth()->user(), $team, $isTyping));
        }

    }
}
