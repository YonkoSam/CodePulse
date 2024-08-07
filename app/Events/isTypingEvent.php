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
     * CreateAndUpdate a new event instance.
     */
    public int $receiver;

    public int $sender;

    public bool $isTyping;

    public function __construct($receiver, $sender, $isTyping)
    {
        $this->sender = $sender;
        $this->receiver = $receiver;

        $this->isTyping = $isTyping;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): string
    {
        return new Channel('my-messages-'.$this->receiver.'-'.$this->sender);

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
