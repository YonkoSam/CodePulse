<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SocialLogin;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialLoginController extends Controller
{
    public function toProvider($driver)
    {
        return Socialite::driver($driver)->redirect();
    }

    public function handleCallBack($driver)
    {

        $user = Socialite::driver($driver)->user();
        $userAccount = SocialLogin::where('provider_id', $user->getId())->first();

        if ($userAccount) {
            Auth::login($userAccount->user);
            Session::regenerate();

            return redirect()->route('home');
        }

        $dbUser = User::where('email', $user->getEmail())->first();

        if ($dbUser) {
            SocialLogin::create([
                'provider_id' => $user->getId(),
                'provider' => $driver,
                'user_id' => $dbUser->id,
            ]);
        } else {
            $avatarPath = null;
            if ($user->getAvatar()) {
                $fileName = Str::random(40).'.jpg';
                $avatarContents = file_get_contents($user->getAvatar());
                Storage::disk('public')->put('profile_images/'.$fileName, $avatarContents);
                $avatarPath = 'profile_images/'.$fileName;
            }

            $dbUser = User::create([
                'email' => $user->getEmail(),
                'password' => bcrypt(rand(100, 9999)),
                'name' => $user->getName() ?? $user->getNickname(),
                'profile_image' => $avatarPath,
            ]);

        }
        Auth::login($dbUser);
        Session::regenerate();

        return redirect()->route('home');

    }
}
