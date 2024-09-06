<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        //        User::factory()->create([
        //            'name' => 'Test User',
        //            'email' => 'test@example.com',
        //        ]);

//        $user =User::find(1);
////        $otherUsers = User::whereNotIn('id', $user->allFriends()->pluck('id'))->get();
////        foreach ($otherUsers as $otherUser) {
////            $user->friends()->attach($otherUser->id);
////        }
//        $user2 =User::find(2);
//
//        Message::factory(50)->create([
//            'sender_id' => $user->id,
//            'receiver_id' => $user2->id,
//        ]);

        User::factory(100)->create();

    }

}
