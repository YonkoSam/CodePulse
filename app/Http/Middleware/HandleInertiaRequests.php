<?php

namespace App\Http\Middleware;

use App\Models\Message;
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
        $unreadMessagesCount = Message::where('seen_at', null)
            ->where('receiver_id', auth()->id())
            ->limit(100)->count();
        if ($unreadMessagesCount > 99) {
            $unreadMessagesCount = '+99';
        }

        return [
            ...parent::share($request),

            'auth' => [
                'user' => $request->user(),
                'hasProfile' => $request->user()?->profile()->exists(),
            ],

            'unreadMessagesCount' => $unreadMessagesCount,
            'notifications' => $request->user()?->notifications()->limit(10)->get(),
        ];
    }
}
