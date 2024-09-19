<?php

namespace App\Observers;

use App\Events\MessageSent;
use App\Events\MessageSentGroupChat;
use App\Events\MessageSentUser;
use App\Models\Friendship;
use App\Models\Message;
use App\Models\Team;

class MessageObserver
{
    /**
     * Handle the Message "created" event.
     */
    public function created(Message $message): void
    {
        defer(function () use ($message) {
            if ($message->team_id) {
                $message->load('sender');
                $team = Team::find($message->team_id);
                $memberIds = $team?->users()->pluck('id')->toArray();
                $team?->updateLastMessageTimestamp();
                event(new MessageSentGroupChat($message));
                foreach ($memberIds as $memberId) {
                    if ($message->sender_id != $memberId && ! $message->sender->isBlocked($memberId)) {
                        event(new MessageSent($memberId, team: $message->team));
                    }
                }
            } else {
                $message->load('sender');
                $friendship = Friendship::findFriendShip($message->receiver_id);
                $friendship?->updateLastMessageTimestamp();
                event(new MessageSentUser($message));
                event(new MessageSent($message->receiver_id, sender: $message->sender));
            }
        });
    }
}
