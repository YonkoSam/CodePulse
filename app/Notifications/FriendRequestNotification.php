<?php

namespace App\Notifications;

use App\Models\FriendRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FriendRequestNotification extends Notification
{
    use Queueable;

    protected $friendRequest;

    /**
     * CreateAndUpdate a new notification instance.
     */
    public function __construct(FriendRequest $friendRequest)
    {
        $this->friendRequest = $friendRequest;
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
            ->line($this->friendRequest->sender->name.' has sent you a friend request.')
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

            'request_id' => $this->friendRequest->id,
            'sender_id' => $this->friendRequest->sender_id,
            'sender_username' => $this->friendRequest->sender->name,
            'message' => $this->friendRequest->sender->name.' has sent you a friend request.',
        ];
    }
}
