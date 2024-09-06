<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TeamPolicy{
    use HandlesAuthorization;


    public function teamOwner(User $user,Team $team): bool
    {
        return $user->isOwnerOfTeam($team);
    }


}
