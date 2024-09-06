<?php

namespace App\Events;

use App\Models\Message;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSentGroupChat implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * CreateAndUpdate a new event instance.
     */
    protected Message $message;


    public function __construct($message)
    {
        $this->message = $message;

    }

    /**
     * Get the channels the event should broadcast on.
     */
    public function broadcastOn(): string
    {
        return new Channel("my-group-chat-{$this->message->team_id}");

    }

    public function broadcastAs(): string
    {
        return 'message-sent-group-chat';
    }

    public function broadcastWith(): array
    {

        return [
            'message' => $this->message,
        ];
    }
}
