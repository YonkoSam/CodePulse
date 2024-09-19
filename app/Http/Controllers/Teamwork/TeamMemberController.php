<?php

namespace App\Http\Controllers\Teamwork;

use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Mpociot\Teamwork\TeamInvite;
use Teamwork;

class TeamMemberController extends Controller
{
    public function show(Team $team)
    {

        $team->load('invites');

        $users = $team->users()->paginate(10);

        foreach ($team->invites as $invite) {
            $invite->email = substr($invite->email, 0, 3).str_repeat('*', 20).substr($invite->email, -1);
        }

        return Inertia::render('TeamWork/Members/list', [
            'team' => $team,
            'users' => $users,
        ]);
    }

    public function destroy(Team $team, User $user)
    {
        $auth = auth()->user();
        if ($auth->isOwnerOfTeam($team) || $user->id == auth()->id()) {
            $user->detachTeam($team);
        }

        return redirect(route('teams.index'));
    }

    public function invite(Request $request, Team $team)
    {
        $request->validate([
            'id' => 'required_without:email',
            'email' => 'nullable|email|required_without:id',

        ]);

        if (request('email')) {
            if (auth()->user()->email == request('email')) {
                return back()->withErrors([
                    'email' => 'you cant invite yourself.',
                ]);
            }

            if (! Teamwork::hasPendingInvite($request->email, $team)) {
                Teamwork::inviteToTeam($request->email, $team, function ($invite) {
                    Mail::send('teamwork.emails.invite', ['team' => $invite->team, 'invite' => $invite], function ($m) use ($invite) {
                        $m->to($invite->email)->subject('Invitation to join team '.$invite->team->name);
                    });
                });
            }
        } elseif (request('id')) {
            $user = User::find($request->id);
            if (! Teamwork::hasPendingInvite($user->email, $team)) {
                Teamwork::inviteToTeam($user->email, $team, function ($invite) {
                    Mail::send('teamwork.emails.invite', ['team' => $invite->team, 'invite' => $invite], function ($m) use ($invite) {
                        $m->to($invite->email)->subject('Invitation to join team '.$invite->team->name);
                    });
                });
            }
        } else {
            return back()->withErrors([
                'email' => 'The email address is already invited to the team.',
            ]);
        }

        return redirect(route('teams.members.show', $team->id));
    }

    public function resendInvite($invite_id)
    {
        $invite = TeamInvite::findOrFail($invite_id);

        defer(fn () => Mail::send('teamwork.emails.invite', ['team' => $invite->team, 'invite' => $invite], function ($m) use ($invite) {
            $m->to($invite->email)->subject('Invitation to join team '.$invite->team->name);
        }));

        return redirect(route('teams.members.show', $invite->team));
    }
}
