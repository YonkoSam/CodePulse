<?php

namespace App\Http\Middleware;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class isFriendMiddleware{
    public function handle(Request $request, Closure $next)
    {

        $user = $request->user();
        $friend = User::findOrFail(last(explode('-',$request->getPathInfo())));
        if (!$user->isFriend($friend) && !$user->isBlocked($friend->id)) {
            return to_route('profiles.show',$friend->profile?->id || null);
        }

        return $next($request);
    }
}
