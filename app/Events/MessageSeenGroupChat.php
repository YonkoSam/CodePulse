<?php

namespace App\Events;

use App\Models\User;
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
    protected  User $user;
    public function __construct($teamId,$user)
    {
        $this->teamId = $teamId;
        $this->user = $user;
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
        return 'is-seen-group-chat';
    }

    public function broadcastWith(): array
    {

        return [
            'userSeen'=>[
                'id' => $this->user->id,
                'name' => $this->user->name,
                'profile_image' => $this->user->profile_image,
                'pivot' => [
                    'seen_at' => now(),
            ]
                ]
        ];
    }
}
