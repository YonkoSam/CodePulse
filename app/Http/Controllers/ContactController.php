<?php

namespace App\Http\Controllers;

use App\Mail\ContactAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function contactAdmin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        Mail::to('admin@example.com')->send(new ContactAdmin($request->email, $request->message));

        return response()->json(['message' => 'Email sent successfully']);
    }
}
