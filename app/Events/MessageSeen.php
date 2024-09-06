<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSeen implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * CreateAndUpdate a new event instance.
     */
    protected int $receiver_id;

    protected int $sender_id;


    public function __construct($receiver_id, $sender_id)
    {
        $this->receiver_id = $receiver_id;
        $this->sender_id = $sender_id;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): string
    {
        return new Channel("my-messages-{$this->receiver_id}-{$this->sender_id}");
    }

    public function broadcastAs(): string
    {
        return 'is-seen';
    }

    public function broadcastWith(): array
    {

        return [];
    }
}
