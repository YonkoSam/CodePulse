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
        }

        return $response;
    }
}
