<?php

namespace App\Http\Controllers\Teamwork;

use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Mpociot\Teamwork\Facades\Teamwork;

class AuthController extends Controller
{
    public function acceptInvite($token)
    {

        $invite = Teamwork::getInviteFromAcceptToken($token);

        if (! $invite) {
            return back()->withErrors(['message' => 'Invite request was not found!']);
        }

        if (auth()->check()) {
            Teamwork::acceptInvite($invite);

            return redirect()->route('teams.index');
        } else {
            session(['invite_token' => $token]);

            return redirect()->to('login');
        }
    }

    /**
     * Accept the given invite.
     *
     * @return RedirectResponse
     */
    public function denyInvite($token)
    {

        $invite = Teamwork::getInviteFromDenyToken($token);

        if (! $invite) {
            return back()->withErrors(['message' => 'Invite request was not found!']);
        }

        if (auth()->check()) {
            Teamwork::denyInvite($invite);

            return redirect()->route('teams.index');
        } else {
            session(['invite_token' => $token]);

            return redirect()->to('login');
        }
    }
}
