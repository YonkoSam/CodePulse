<?php

namespace App\Http\Controllers;

use App\Models\Education;
use Illuminate\Support\Facades\Auth;

class EducationController extends Controller
{
    public function store()
    {

        $education = request()->validate(
            [
                'school' => ['required', 'string', 'min:1', 'max:255'],
                'degree' => ['required', 'string', 'min:1', 'max:255'],
                'fieldofstudy' => ['required', 'string', 'min:1', 'max:255'],
                'from' => ['required', 'date', 'before:to'],
                'to' => ['nullable', 'date'],
                'current' => ['required', 'boolean'],
            ]
        );

        $education['profile_id'] = Auth::user()->profile->id;
        Education::create($education);

        return redirect()->route('home');
    }

    public function update(Education $education)
    {

        $ValidatedEducation = request()->validate(
            [
                'school' => ['required', 'string', 'min:1', 'max:255'],
                'degree' => ['required', 'string', 'min:1', 'max:255'],
                'fieldofstudy' => ['required', 'string', 'min:1', 'max:255'],
                'from' => ['required', 'date'],
                'to' => ['nullable', 'date'],
                'current' => ['required', 'boolean'],
            ]
        );

        $education->update($ValidatedEducation);

        return redirect()->route('home');
    }

    public function destroy(Education $education)
    {

        $education->delete();

        return redirect()->route('home');
    }
}
