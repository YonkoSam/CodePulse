<?php

namespace App\Listeners\Teamwork;

use App\Events\NotificationSent;
use App\Notifications\TeamInviteNotification;
use Mpociot\Teamwork\Events\UserInvitedToTeam;

class UserInvitedToTeamListener
{
    /**
     * CreateAndUpdate the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @return void
     */
    public function handle(UserInvitedToTeam $event)
    {
        $user = $event->getInvite()->user;
        $invite = $event->getInvite();

        if ($user) {
            $user->notify(new TeamInviteNotification($invite));
            event(new NotificationSent($user->id));
        }

    }
}
