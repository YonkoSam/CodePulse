<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class isTypingGroupChat implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * CreateAndUpdate a new event instance.
     */
    protected User $sender;

    protected int $teamId;

    protected bool $isTyping;

    public function __construct($sender, $teamId, $isTyping)
    {
        $this->sender = $sender;
        $this->teamId = $teamId;
        $this->isTyping = $isTyping;
    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): string
    {
        return new Channel("my-group-chat-{$this->teamId}");

    }

    public function broadcastAs(): string
    {
        return 'is-typing-group-chat';
    }

    public function broadcastWith(): array
    {

        return [
            'id' => $this->sender->id,
            'name' => $this->sender->name,
            'isTyping' => $this->isTyping,
        ];
    }
}
