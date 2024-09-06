<?php
namespace App\Services;

use App\Enums\XPAction;
use App\Events\UserLevelUp;
use App\Models\Profile;
use function event;

class XpService
{
    const POINTS_PER_LEVEL = 1000;

    public function assignPoints(Profile|null $profile, XPAction $action): void
    {
        if(!$profile) {
            return;
        }

        $currentLevel = floor($profile->xp / self::POINTS_PER_LEVEL);

        $profile->xp += $action->value;
        $newLevel = floor($profile->xp / self::POINTS_PER_LEVEL);

        $profile->save();

        if ($newLevel > $currentLevel) {
            event(new UserLevelUp($profile->user_id, $newLevel,$profile->xp));
        }

    }
}
