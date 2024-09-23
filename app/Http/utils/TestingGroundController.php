<?php

namespace App\Http\utils;

use App\Http\Controllers\Controller;
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
