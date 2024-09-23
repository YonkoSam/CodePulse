<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\User;

class isUserBlockedController extends Controller{
    public function __invoke(int $userId)
    {
        $isBlocked = User::find($userId)?->isBlocked(auth()->id());
        return response()->json(['isBlocked'=>$isBlocked]);

    }
}
