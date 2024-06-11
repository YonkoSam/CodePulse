<?php

// app/Http/Controllers/ChatController.php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index($receiverId = -1)
    {

        $user = Auth::user();

        if ($receiverId == -1) {
            $latestMessage = Message::where('receiver_id', $user->id)
                ->latest()->first();

            $receiverId = $latestMessage ? $latestMessage->sender_id : Auth::user()->friends()->first()->id;
        }

        $messages = Message::where(function ($query) use ($user, $receiverId) {
            $query->where('sender_id', $user->id)
                ->where('receiver_id', $receiverId);
        })
            ->orWhere(function ($query) use ($user, $receiverId) {
                $query->where('sender_id', $receiverId)
                    ->where('receiver_id', $user->id);
            })
            ->with(['sender', 'receiver'])
            ->get();

        // Fetch friends with profile
        $friends = $user->friends()->with(['profile' => function ($query) {
            $query->select('user_id', 'profiles.id');
        }])
            ->get()
            ->each(function ($friend) {
                $friend->online = $friend->isOnline();
            });

        return Inertia::render('Messages', [
            'messages' => $messages,
            'friends' => $friends,
            'receiverId' => $receiverId,
        ]);

    }

    public function store(Request $request)
    {

        $message = new Message();
        $message->sender_id = Auth::id();
        $message->receiver_id = $request->input('receiver_id');
        $message->message = $request->input('message');
        $message->save();

        event(new MessageSent($message->receiver_id));

    }
}
