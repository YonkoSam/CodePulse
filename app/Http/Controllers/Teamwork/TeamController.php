<?php

namespace App\Http\Controllers\Teamwork;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Mpociot\Teamwork\Exceptions\UserNotInTeamException;

class TeamController extends Controller
{

    public function index()
    {

        return inertia('TeamWork/index', [
            'teams' => auth()->user()->teams()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $teamModel = config('teamwork.team_model');

        $team = $teamModel::create([
            'name' => $request->name,
            'owner_id' => $request->user()->getKey(),
        ]);
        $request->user()->attachTeam($team);

        return back();
    }


    public function switchTeam(Team $team=null)
    {
        try {
            if($team)
            auth()->user()->switchTeam($team);
            else
          auth()->user()->switchTeam(null);
        } catch (UserNotInTeamException $e) {
            abort(403);
        }

        return back();
    }

    public function destroy(Team $team)
    {

        if (! auth()->user()->isOwnerOfTeam($team)) {
            abort(403);
        }

        $team->delete();

        $userModel = config('teamwork.user_model');
        $userModel::where('current_team_id', $team->id)
            ->update(['current_team_id' => null]);

        return back();
    }

    public function update(Request $request, Team $team)
    {

        $request->validate([
            'name' => 'required|string',
        ]);

        $teamModel = config('teamwork.team_model');

        if (! auth()->user()->isOwnerOfTeam($team)) {
            return back()->withErrors(['message' => 'You are not the team owner']);
        }
        $team->name = $request->name;
        $team->save();

        return back();
    }
}
