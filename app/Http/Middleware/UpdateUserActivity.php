<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redis;

class UpdateUserActivity
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        if (Auth::check()) {
            $userId = Auth::id();
            Redis::setex('user-online-'.$userId, 30, true);
            Redis::setex('user-last-time-online-'.$userId, 24 * 120 * 60, now()->toDateTimeString());
        }

        return $response;
    }
}
