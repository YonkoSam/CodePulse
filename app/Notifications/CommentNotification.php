<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommentNotification extends Notification
{
    use Queueable;

    protected $comment;

    /**
     * CreateAndUpdate a new notification instance.
     */
    public function __construct(Comment $comment)
    {
        $this->comment = $comment;
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
            ->line($this->comment->user->name.' has comment on one of your pulses.')
            ->action('View Request', url('/pots/'.$this->comment->pulse_id))
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
            'comment_id' => $this->comment->id,
            'message' => $this->comment->user->name.' has commented on one of your Pulse "'.$this->comment->text.' "',
            'url' => route('pulses.show', ['pulse' => $this->comment->pulse_id]),
        ];
    }
}
