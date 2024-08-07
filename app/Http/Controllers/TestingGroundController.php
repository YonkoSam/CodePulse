<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class TestingGroundController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('TestingGround/TestingGround', [
            'language' => request('language') ?? '',
            'sourceCode' => request('sourceCode') ?? '',
        ]);
    }
}
