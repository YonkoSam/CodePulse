<?php

namespace App\Http\Controllers\Team;

use Illuminate\Routing\Controller;
use Mpociot\Teamwork\Facades\Teamwork;

class AuthController extends Controller
{
    public function acceptInvite($token)
    {

        $invite = Teamwork::getInviteFromAcceptToken($token);

        if (! $invite) {
            return response()->json(['message' => 'Invite request was not found!']);
        }

        if (auth()->check()) {
            Teamwork::acceptInvite($invite);
            return response()->json(['message' => 'Invite accepted!']);
        } else {
            session(['invite_token' => $token]);

            return redirect()->to('login');
        }
    }

    public function denyInvite($token)
    {

        $invite = Teamwork::getInviteFromDenyToken($token);

        if (! $invite) {
            return  response()->json(['message' => 'Invite request was not found!']);
        }

        if (auth()->check()) {
            Teamwork::denyInvite($invite);
            return response()->json(['message' => 'Invite rejected!']);
        } else {
            session(['invite_token' => $token]);

            return redirect()->to('login');
        }
    }
}
