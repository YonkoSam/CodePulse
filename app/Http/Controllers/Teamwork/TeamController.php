<?php

namespace App\Http\Controllers\Teamwork;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Mpociot\Teamwork\Exceptions\UserNotInTeamException;

class TeamController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

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

    public function switchTeamApi($id = null)
    {
        if ($id) {
            $teamModel = config('teamwork.team_model');
            $team = $teamModel::findOrFail($id);
            try {
                auth()->user()->switchTeam($team);
            } catch (UserNotInTeamException $e) {
                return back()->withErrors(['message' => $e->getMessage()]);
            }
        } else {
            auth()->user()->switchTeam(null);
        }

        return back();
    }

    public function switchTeam($id)
    {
        $teamModel = config('teamwork.team_model');
        $team = $teamModel::findOrFail($id);
        try {
            auth()->user()->switchTeam($team);
        } catch (UserNotInTeamException $e) {
            abort(403);
        }

        return back();
    }

    public function destroy($id)
    {
        $teamModel = config('teamwork.team_model');

        $team = $teamModel::findOrFail($id);
        if (! auth()->user()->isOwnerOfTeam($team)) {
            abort(403);
        }

        $team->delete();

        $userModel = config('teamwork.user_model');
        $userModel::where('current_team_id', $id)
            ->update(['current_team_id' => null]);

        return back();
    }

    public function update(Request $request, $id)
    {

        $request->validate([
            'name' => 'required|string',
        ]);

        $teamModel = config('teamwork.team_model');

        $team = $teamModel::findOrFail($id);
        if (! auth()->user()->isOwnerOfTeam($team)) {
            return back()->withErrors(['message' => 'You are not the team owner']);
        }
        $team->name = $request->name;
        $team->save();

        return back();
    }
}
