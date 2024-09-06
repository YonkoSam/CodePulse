<?php

namespace Database\Factories;

use App\Enums\MessageType;
use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition(): array
    {
        return [
            'message' => $this->faker->colorName(),
            'seen_at' => null,
            'type' => MessageType::text,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
//            'sender_id' => 1,
//            'team_id' => 1,
        ];
    }
}
