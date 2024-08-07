<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Support\Facades\Auth;

class ExperienceController extends Controller
{
    public function store()
    {

        $experience = request()->validate([

            'job_title' => ['required', 'string', 'min:1', 'max:255'],
            'company' => ['required', 'string', 'min:1', 'max:255'],
            'location' => ['nullable', 'string', 'min:1', 'max:255'],
            'from' => ['required', 'date'],
            'to' => ['nullable', 'after:from'],
            'current' => ['required', 'boolean'],
            'description' => ['nullable', 'string', 'min:1'],

        ]);
        $experience['profile_id'] = Auth::user()->profile->id;
        Experience::create($experience);

        return redirect()->route('home');
    }

    public function update(Experience $experience)
    {

        $ValidatedExperience = request()->validate(
            [
                'job_title' => ['required', 'string', 'min:1', 'max:255'],
                'company' => ['required', 'string', 'min:1', 'max:255'],
                'location' => ['nullable', 'string', 'min:1', 'max:255'],
                'from' => ['required', 'date'],
                'to' => ['nullable', 'date'],
                'current' => ['required', 'boolean'],
                'description' => ['nullable', 'string', 'min:1'],
            ]
        );

        $experience->update($ValidatedExperience);

        return redirect()->route('home');
    }

    public function destroy(Experience $experience)
    {

        $experience->delete();

        return redirect()->route('home');
    }
}
