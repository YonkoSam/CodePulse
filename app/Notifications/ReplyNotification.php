<?php

namespace App\Notifications;

use App\Models\Comment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ReplyNotification extends Notification
{
    use Queueable;

    protected $reply;

    protected $message;

    /**
     * CreateAndUpdate a new notification instance.
     */
    public function __construct(Comment $reply, string $message = ' has replied on one of your comments.')
    {
        $this->reply = $reply;
        $this->message = $message;
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
            ->line($this->reply->user->name.$this->message)
            ->action('View Request', url('/pots/'.$this->reply->pulse_id))
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
            'reply_id' => $this->reply->id,
            'message' => "{$this->reply->user->name} {$this->message} {$this->reply->text}",
            'url' => route('pulses.show', ['pulse' => $this->reply->pulse_id]),
        ]; 
    }
}
