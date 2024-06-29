<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::has('profile')
            ->with(['profile' => function ($query) {
                $query->select('user_id', 'status', 'profiles.id');
            }])->paginate(10);

        return Inertia::render('Profiles/index', [
            'users' => $users,
        ]);
    }
}
