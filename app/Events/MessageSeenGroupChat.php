<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSeenGroupChat implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * CreateAndUpdate a new event instance.
     */
    protected int $teamId;
    protected int $userId;

    public function __construct($teamId,$userId)
    {
        $this->teamId = $teamId;
        $this->userId = $userId;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): string
    {
        return new Channel('my-group-chat-'.$this->teamId);

    }

    public function broadcastAs(): string
    {
        return 'is-seen-group-chat';
    }

    public function broadcastWith(): array
    {

        return [
            'userId' => $this->userId,
        ];
    }
}
