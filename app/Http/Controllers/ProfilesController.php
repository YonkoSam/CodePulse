<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Profile;
use App\Models\Social;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfilesController extends Controller
{
    public function show(Profile $profile)
    {
        $authUser = Auth::user();

        $profile->load('user', 'experiences', 'socials', 'educations');

        $isFriend = $profile->isFriend($authUser);
        $isOnline = $profile->user->isOnline();
        $isBlocked = $profile->isBlocked($authUser);
        $posts = $profile->user->posts->load('comments', 'likes', 'user');
        $friends = $profile->user->friends()->select('name', 'profile_image', 'users.id')->with(['profile' => function ($query) {
            $query->select('user_id', 'status', 'profiles.id');
        }])->get();

        return Inertia::render('Home', [
            'profile' => $profile,
            'isFriend' => $isFriend,
            'isOnline' => $isOnline,
            'isBlocked' => $isBlocked,
            'posts' => $posts,
            'friends' => $friends,
        ]);
    }

    public function me()
    {

        $profile = Profile::with('user', 'experiences', 'socials', 'educations')->where('user_id', Auth::user()->id)->first();
        $posts = Post::with('user', 'comments', 'likes')->where('user_id', Auth::user()->id)->limit(10)->get();
        $friends = Auth::user()->friends()->select('name', 'users.id', 'profile_image')->with(['profile' => function ($query) {
            $query->select('user_id', 'status', 'profiles.id');
        }])->get();
        $friendOf = Auth::user()->friendOf()->select('name', 'users.id', 'profile_image')->with(['profile' => function ($query) {
            $query->select('user_id', 'status', 'profiles.id');
        }])->get();

        return Inertia::render('Home', [
            'profile' => $profile,
            'posts' => $posts,
            'friends' => array_merge($friendOf->toArray(), $friends->toArray()),
        ]);
    }

    public function create()
    {

        return Inertia::render('Profiles/CreateAndUpdate');
    }

    public function store()
    {
        $profile = request()->validate([
            'company' => ['nullable', 'string', 'min:1'],
            'website' => ['nullable', 'string', 'min:1'],
            'country' => ['nullable', 'string', 'min:1'],
            'location' => ['nullable', 'string', 'min:1'],
            'status' => ['required', 'string', 'min:1'],
            'skills' => ['required', 'string', 'min:1'],
            'bio' => ['nullable'],
        ], ['skills' => 'Please add at least one skill before submitting']);

        $user = Auth::user();

        $profile['user_id'] = $user->id;

        $profile = Profile::updateOrCreate(
            ['user_id' => $user->id],
            $profile
        );

        $social = [
            'profile_id' => $profile->id,
            'facebook' => request()->facebook,
            'twitter' => request()->twitter,
            'instagram' => request()->instagram,
            'linkedin' => request()->linkedin,
            'youtube' => request()->youtube,
            'github' => request()->github,
        ];

        Social::updateOrCreate(
            ['profile_id' => $profile->id],
            $social);

        if (request()->hasFile('profile_image')) {
            request()->validate([
                'profile_image' => 'image',
            ]);

            $filePath = request()->profile_image->store('profile_images');
            $oldAvatar = auth()->user()->profile_image;
            $user->update(
                [
                    'profile_image' => $filePath ?? '',
                ]
            );
            if ($oldAvatar) {
                Storage::delete($oldAvatar);
            }

        }

        return Redirect::route('home');

    }

    public function edit()
    {

        $profile = Profile::with('user', 'socials')->where('user_id', Auth::user()->id)->first();

        return Inertia::render('Profiles/CreateAndUpdate', ['profile' => $profile]);
    }
}
