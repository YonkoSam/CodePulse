<?php

namespace Database\Factories;

use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class MessageFactory extends Factory
{
    protected $model = Message::class;

    public function definition(): array
    {
        return [
            'message' => $this->faker->word(),
            'seen_at' => null,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
            'sender_id' => 20,
            'receiver_id' => 17,
        ];
    }
}
