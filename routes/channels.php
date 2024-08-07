<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;
use Mpociot\Teamwork\TeamworkTeam;


Broadcast::channel('my-messages-{receiverId}-{senderId}', function (User $user, int $receiverId) {

    return $user->id === $receiverId;
});
Broadcast::channel('my-messages-{id}', function (User $user, int $sender_id) {
    return $user->id === $sender_id;
});

Broadcast::channel('my-notification-{id}', function (User $user, int $id) {

    return $user->id === $id;
});
Broadcast::channel('my-group-chat-{teamId}', function (User $user, int $teamId) {
    return TeamworkTeam::find($teamId)->hasUser($user);
});
