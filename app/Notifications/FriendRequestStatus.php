<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FriendRequestStatus extends Notification
{
    use Queueable;

    protected $name;

    protected $status;

    /**
     * CreateAndUpdate a new notification instance.
     */
    public function __construct($name, $status = 'accepted')
    {
        $this->name = $name;
        $this->status = $status;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];

    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->line($this->name.' '.$this->status.' your friend request.')
            ->action('View Request', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {

        return [
            'name' => $this->name,
            'message' => $this->name.' '.$this->status.' your friend request.',
        ];
    }
}
