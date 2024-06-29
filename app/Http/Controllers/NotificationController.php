<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user();

        return Inertia::render('Profiles/NotificationsPage', ['notifications' => $user->notifications()->latest()->paginate(20)]);
    }
}
