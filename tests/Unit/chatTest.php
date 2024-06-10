<?php

use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\TestCase;

uses(TestCase::class, RefreshDatabase::class);

it('allows a user to send a message', function () {

    $sender = User::factory()->create();
    $receiver = User::factory()->create();
    $message = new Message();
    $message->sender_id = $sender->id; // Replace with the sender's ID
    $message->receiver_id = $receiver->id; // Replace with the receiver's ID
    $message->message = 'Hello, this is a test message.';
    $message->save();
    expect($sender->message)->toBe($message);
});
