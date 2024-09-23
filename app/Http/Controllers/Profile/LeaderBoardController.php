<?php

namespace App\Http\Controllers\Profile;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Inertia\Inertia;

class LeaderBoardController extends Controller
{
    public function __invoke()
    {
        $authUserId = auth()->id();
        $profilesRanked = Profile::selectRaw('id, xp, status, country, user_id,
        ROW_NUMBER() OVER(ORDER BY xp DESC) as rank')
            ->with(['user' => function ($query) {
                $query->select('id', 'name', 'profile_image');
            }])
            ->visibleToUser($authUserId)
            ->orderBy('xp', 'desc')
            ->paginate(10);

        return Inertia::render('LeaderBoard', [
            'profiles' => $profilesRanked,
        ]);
    }
}
