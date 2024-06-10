<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $id;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($id)
    {
        $this->id = $id;
    }

    public function broadcastOn(): string
    {
        return new Channel('my-messages-'.$this->id);

    }

    public function broadcastAs(): string
    {
        return 'message-sent';
    }

    public function broadcastWith(): array
    {

        return [
            'id' => $this->id,
        ];
    }
}
