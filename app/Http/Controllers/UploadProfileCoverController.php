<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\Encoders\AutoEncoder;
use Intervention\Image\ImageManager;

class UploadProfileCoverController extends Controller
{
    public function __invoke()
    {
        request()->validate([
            'cover' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $file = request()->file('cover');
        $coverName= hexdec(uniqid()).'.'.$file->getClientOriginalExtension();
        $manager = new ImageManager(new Driver());
        $image = $manager->read(file_get_contents($file));
        $image->coverDown(1500, 300,'top');
        Storage::put('covers/'. $coverName,(string) $encoded = $image->encode(new AutoEncoder(quality: 65)));
        $coverPath = 'covers/' . $coverName;
        $oldCover = auth()->user()->profile->cover;
        auth()->user()->profile->update(['cover' => $coverPath]);
        if ($oldCover) {
            Storage::delete($oldCover);
        }

        return back();
    }
}
