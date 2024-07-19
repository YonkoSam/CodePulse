<?php

namespace App\Http\Controllers;

use App\Events\isTypingEvent;
use Illuminate\Http\Request;

class isTypingController extends Controller
{
    public function __invoke(Request $request)
    {
        request()->validate([
            'receiver' => 'required',
            'isTyping' => 'required',
        ]);

        $receiver = $request->receiver;
        $isTyping = $request->isTyping;
        event(new isTypingEvent($receiver, auth()->id(), $isTyping));
    }
}
