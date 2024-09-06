<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Queue\SerializesModels;

class NotificationSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * CreateAndUpdate a new event instance.
     */
    protected DatabaseNotification $notification;

    public function __construct(DatabaseNotification $notification)
    {
        $this->notification = $notification;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): string
    {
        return new Channel("my-notification-{$this->notification->notifiable_id}");

    }

    public function broadcastAs(): string
    {
        return 'notification-sent';
    }

    public function broadcastWith(): array
    {

        return [
            'notification' => $this->notification,
        ];
    }
}
