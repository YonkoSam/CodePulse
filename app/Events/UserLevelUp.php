<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserLevelUp implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * CreateAndUpdate a new event instance.
     */
    protected int $userId;
    protected int $newLevel;
    protected int $xp;

    public function __construct($userId, $newLevel,$xp)
    {
        $this->userId = $userId;
        $this->newLevel = $newLevel;
        $this->xp = $xp;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): string
    {
        return new Channel("user-level-up-{$this->userId}");

    }

    public function broadcastAs(): string
    {
        return 'level-up';
    }

    public function broadcastWith(): array
    {

        return [
            'newLevel' => $this->newLevel,
            'xp' => $this->xp,
        ];
    }
}
