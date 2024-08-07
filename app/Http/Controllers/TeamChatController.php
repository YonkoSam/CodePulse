<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Inertia\Inertia;

class TeamChatController extends Controller
{
    public function index($teamId)
    {
        $messages = Message::where('team_id', $teamId)
            ->with(['sender', 'team', 'team.users'])
            ->get();

        return Inertia::render('simpleMessagerender', [
            'messages' => $messages,
        ]);
    }
}
