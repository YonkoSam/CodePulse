<?php

namespace App\Policies;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProfilePolicy
{
    use HandlesAuthorization;

    public function view(User $user, Profile $profile): bool
    {
        return !$user->profile?->isBlocked($profile->user);
    }
}
