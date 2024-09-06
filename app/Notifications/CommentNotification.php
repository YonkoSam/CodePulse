<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CommentNotification extends Notification
{
    use Queueable;

    protected Comment $comment;
    protected bool $isAiGenerated;

    /**
     * Create a new notification instance.
     */
    public function __construct(Comment $comment, $isAiGenerated = false)
    {
        $this->comment = $comment;
        $this->isAiGenerated = $isAiGenerated;
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
        $subject = $this->isAiGenerated
            ? 'AI-Generated Comment on Your Pulse'
            : 'New Comment on Your Pulse';

        return (new MailMessage)
            ->subject($subject)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line($this->getNotificationMessage())
            ->action('View Pulse', url('/pulses/' . $this->comment->pulse_id))
            ->line('Thank you for being a part of our community!');
    }

    /**
     * Get the notification message based on whether it's AI-generated or not.
     */
    private function getNotificationMessage(): string
    {
        if ($this->isAiGenerated) {
            return 'Our AI assistant has provided a comment on your Pulse: "' . $this->comment->text . '"';
        }

        $pulseTitle = $this->comment->pulse->title ?? 'your Pulse';
        return $this->comment->user->name . ' has commented on ' . $pulseTitle . ': "' . $this->comment->text . '"';
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
            'message' => $this->getNotificationMessage(),
            'url' => route('pulses.show', ['pulse' => $this->comment->pulse_id]),
        ];
    }
}
