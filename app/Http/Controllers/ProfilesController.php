<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\Pulse;
use App\Models\Social;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class ProfilesController extends Controller
{
    public function index()
    {

        $profiles = User::has('profile')
        ->visible(auth()->id())
            ->whereNot('id', auth()->id())
            ->with('profile:id,status,user_id')
            ->paginate(12);

        return Inertia::render('Profiles/index', [
            'profiles' => $profiles,
        ]);
    }

    public function show(?Profile $profile = null)
    {
        $user = Auth::user();
        $isFriend = false;
        $isOnline = false;
        $lastTimeOnline = null;
        if (is_null($profile)) {
            $profile = $user->profile;
        } else {
            $isFriend = $profile->isFriend($user);
            $isOnline = $profile->user->isOnline();
            $lastTimeOnline = $profile->user->lastTimeOnline();

        }
        $profile?->load('user', 'experiences', 'socials', 'educations');

        $pulses = Pulse::where('user_id', $profile?->user_id)->whereNull('team_id')
            ->with('likes:id,user_id,pulse_id','user')
            ->withCount('comments')
            ->get();
        return Inertia::render('Profiles/ProfilePage', [
            'profile' => $profile,
            'isFriend' => Inertia::always($isFriend),
            'isOnline' => Inertia::always($isOnline),
            'lastTimeOnline' => $lastTimeOnline,
            'hasProfile' => $user?->profile()->exists(),
            'pulses' => $pulses,
            'friends' => $profile?->user->allFriends()->with('profile:id,status,user_id')->paginate(6),
        ]);
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
            'bio' => ['nullable', 'string', 'max:255'],
            'profile_image' => 'nullable|image',

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
            $file = request()->file('profile_image');
            $imageName= hexdec(uniqid()).'.'.$file->getClientOriginalExtension();
            $manager = new ImageManager(new Driver());
            $image = $manager->read(file_get_contents($file));
            $image = $image->scale(width: 300);
            Storage::put('profile_images/' . $imageName, (string) $image->encode());
            $filePath = 'profile_images/' . $imageName;
            $oldAvatar = auth()->user()->profile_image;
            $user->update(
                [
                    'profile_image' => $filePath,
                ]
            );
            if ($oldAvatar) {
                Storage::delete($oldAvatar);
            }

        }

        return Redirect::route('home');

    }

    public function create()
    {

        return Inertia::render('Profiles/CreateAndUpdate', ['hasProfile' => auth()->user()->profile()->exists()]);
    }

    public function edit()
    {

        $profile = Profile::with('user', 'socials')
            ->where('user_id', Auth::user()->id)->first();

        return Inertia::render('Profiles/CreateAndUpdate', ['profile' => $profile]);
    }
}
