<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;

class UpdateLastTimeOnlineCommand extends Command
{
    protected $signature = 'update:last-time-online';

    protected $description = 'Update last time online for users who have not been online for the past 24 hours based on Redis data';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle(): void
    {
        $userKeys = Redis::keys('user-last-time-online-*');

        foreach ($userKeys as $key) {
            $userId = str_replace('codepulse_database_user-last-time-online-', '', $key);
            $rightKey = explode('_', $key)[2];

            $lastTimeOnline = Redis::get($rightKey);


            if ($lastTimeOnline) {
                $lastTimeOnline = Carbon::parse($lastTimeOnline);
                if ($lastTimeOnline->lte(Carbon::now()->subDay())) {

                    $user = User::find($userId);

                    if ($user) {
                        $user->last_time_online = $lastTimeOnline;
                        $user->save();
                    }
                    Redis::del($key);
                }
            }
        }

        $this->info('Last time online updated for users who were not online in the past 24 hours and removed from Redis.');
    }
}
