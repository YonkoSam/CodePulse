<?php

namespace App\Notifications;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Mpociot\Teamwork\TeamInvite;
use Mpociot\Teamwork\TeamworkTeam;

class TeamInviteNotification extends Notification
{
    use Queueable;

    protected TeamInvite $invite;

    /**
     * CreateAndUpdate a new notification instance.
     */
    public function __construct($invite)
    {
        $this->invite = $invite;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];

    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {

        $name = User::where('id', $this->invite->user_id)->value('name');

        return [
            'accept_token' => $this->invite->accept_token,
            'deny_token' => $this->invite->deny_token,
            'message' => 'you have been invited to join the team '.TeamworkTeam::find($this->invite->team_id)->name.' by '
                .$name,
        ];
    }
}
