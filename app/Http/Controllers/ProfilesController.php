<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\Profile;
use App\Models\Social;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ProfilesController extends Controller
{
    public function show(Profile $profile)
    {
        $authUser = Auth::user();

        $profile->load('user', 'experiences', 'socials', 'educations');
        $messages = Message::where('receiver_id', $profile->user_id)
            ->where('sender_id', $authUser->id)
            ->orWhere('sender_id', $profile->user_id)
            ->where('receiver_id', $authUser->id)
            ->with(['sender', 'receiver'])
            ->get();
        $isFriend = $profile->isFriend($authUser);
        $isOnline = $profile->user->isOnline();

        return Inertia::render('Home', [
            'profile' => $profile,
            'isFriend' => $isFriend,
            'isOnline' => $isOnline,
            'messages' => $messages,

        ]);
    }

    public function me()
    {

        $profile = Profile::with('user', 'experiences', 'socials', 'educations')->where('user_id', Auth::user()->id)->first();

        return Inertia::render('Home', [
            'profile' => $profile,
        ]);
    }

    public function create()
    {

        return Inertia::render('Profiles/create');
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
        ]);

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
            $file = request()->file('profile_image');
            $fileName = $user->id.'.'.$file->getClientOriginalExtension();
            $filePath = $file->storeAs('profile_images', $fileName, 'public');

            $user->update(
                [
                    'profile_image' => $filePath ?? '',
                ]
            );

        }

        return Redirect::route('home');

    }

    public function edit()
    {

        $profile = Profile::with('user', 'socials')->where('user_id', Auth::user()->id)->first();

        return Inertia::render('Profiles/create', ['profile' => $profile]);
    }
}
