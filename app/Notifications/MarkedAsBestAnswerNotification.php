<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class MarkedAsBestAnswerNotification extends Notification
{
    use Queueable;

    protected Comment $comment;


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
    public function via(): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(): MailMessage
    {
        return (new MailMessage)
            ->line('your comment has been marked as best answer.')
            ->action('View Request', url('/pots/'.$this->comment->pulse_id))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(): array
    {

        return [
            'comment_id' => $this->comment->id,
            'message' => "your comment has been marked as best answer",
            'url' => route('pulses.show', ['pulse' => $this->comment->pulse_id]),
        ];
    }
}
