<?php

namespace App\Events;

use App\Models\Team;
use App\Models\User;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;



    public int $receiver_id;
    public User|null $sender;
    public Team|null $team;


    /**
     * CreateAndUpdate a new event instance.
     *
     * @return void
     */
    public function __construct( $receiver_id,$sender=null,$team=null)
    {
        $this->receiver_id = $receiver_id;
        $this->sender = $sender;
        $this->team = $team;
    }

    public function broadcastOn(): string
    {
        return new Channel("my-messages-{$this->receiver_id}");

    }

    public function broadcastAs(): string
    {
        return 'message-sent';
    }

    public function broadcastWith(): array
    {

        if($this->sender)
        return [
            'sender' => $this->sender,
        ];
        else
            return [
                'team' => $this->team,
            ];
    }
}
