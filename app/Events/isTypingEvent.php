<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class isTypingEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public int $id;

    public bool $isTyping;

    public function __construct($id, $isTyping)
    {
        $this->id = $id;
        $this->isTyping = $isTyping;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): string
    {
        return new Channel('my-messages-'.$this->id);

    }

    public function broadcastAs(): string
    {
        return 'is-typing';
    }

    public function broadcastWith(): array
    {

        return [
            'isTyping' => $this->isTyping,
        ];
    }
}
