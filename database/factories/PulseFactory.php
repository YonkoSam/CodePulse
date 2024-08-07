<?php

namespace Database\Factories;

use App\Models\Pulse;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class PulseFactory extends Factory
{
    protected $model = Pulse::class;

    public function definition(): array
    {

        $users = User::pluck('id')->toArray();

        return [
            'user_id' => $this->faker->randomNumber($users),
            'title' => $this->faker->realText(20),
            'text' => $this->faker->text(),
            'code' => [
                'language' => 'HTML',
                'sourceCode' => $this->faker->randomHtml(),
            ],
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ];
    }
}
