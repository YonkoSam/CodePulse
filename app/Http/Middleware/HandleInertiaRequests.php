<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        $user = $request->user();





        return [
            ...parent::share($request),

            'auth' => [
                'currentTeam' => $user?->currentTeam()->first(),
                'user' => $user,
            ],
            'notifications' => $request->user()?->notifications()->limit(10)->get(),
            'unreadNotificationsCount' => auth()->user()?->notifications()->where('read_at', null)->count(),
        ];
    }
}
