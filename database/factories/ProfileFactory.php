<?php

namespace Database\Factories;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProfileFactory extends Factory
{
    protected $model = Profile::class;



    public function definition(): array
    {
        $statuses = [
        'Developer',
        'Junior Developer',
        'Senior Developer',
        'Manager',
        'Senior Manager',
        'Team Lead',
        'Intern',
        'Consultant',
        'Student',
    ];
        return [
            'company' => fake()->company(),
            'website' => fake()->url(),
            'country' => fake()->country(),
            'location' => fake()->city(),
            'status' => fake()->randomElement($statuses),
            'skills' => 'PHP, Laravel, JavaScript',
            'bio' => fake()->text(),
            'xp'=>fake()->randomNumber(),
        ];
    }
}
