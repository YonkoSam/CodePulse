<?php

namespace App\Notifications;

use App\Models\Like;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LikeNotification extends Notification
{
    use Queueable;

    protected $like;

    /**
     * CreateAndUpdate a new notification instance.
     */
    public function __construct(Like $like)
    {
        $this->like = $like;
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
            ->line($this->like->user->name.' has Liked on one of your Pulse.')
            ->action('View Request', url('/pots/'.$this->like->pulse_id))
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
            'pulse_id' => $this->like->pulse_id,
            'user_id' => $this->like->user_id,
            'message' => $this->like->user->name.' has Liked on one of your Pulse.',
            'url' => route('pulses.show', ['pulse' => $this->like->pulse_id]),
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {

        return new BroadcastMessage([
            'pulse_id' => $this->like->pulse_id,
            'user_id' => $this->like->user_id,
            'message' => $this->like->user->name.' has Liked on one of your Pulse',
            'url' => route('pulses.show', ['pulse' => $this->like->pulse_id]),
        ]);
    }
}
