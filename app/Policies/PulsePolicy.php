<?php

namespace App\Policies;

use App\Models\Pulse;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PulsePolicy
{
    use HandlesAuthorization;

    public function view(?User $user , Pulse $pulse): bool
    {

        $doesUserBelongsToPulseTeam = true;
        if ($pulse->team()->exists()) {
            $doesUserBelongsToPulseTeam = $pulse->team->hasUser($user);
        }


        return Pulse::where('id', $pulse->id)->visibleToUser($user->id)->exists() && $doesUserBelongsToPulseTeam;
    }
    public function edit(User $user, Pulse $pulse): bool
    {

        return $pulse->user_id == $user->id;
    }

    public function delete(User $user, Pulse $pulse): bool
    {

        return $pulse->user_id == $user->id;
    }
}
