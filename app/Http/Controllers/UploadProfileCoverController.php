<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;

class UploadProfileCoverController extends Controller
{
    public function __invoke()
    {
        request()->validate([
            'cover' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $coverPath = request()->cover->store('covers');
        $oldCover = auth()->user()->profile->cover;
        auth()->user()->profile->update(['cover' => $coverPath]);
        if ($oldCover) {
            Storage::delete($oldCover);
        }

        return back();
    }
}
