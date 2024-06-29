<?php

// app/Http/Controllers/ChatController.php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Message;
use App\Models\User;
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

            $receiverId = $latestMessage ? $latestMessage->sender_id : ($user->friends()->count() > 0 ? $user->friends()->first()->id : null);
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

        $friends = $user->friends()->with(['profile' => function ($query) {
            $query->select('user_id', 'profiles.id');
        }])
            ->get()
            ->each(function ($friend) {
                $friend->online = $friend->isOnline();
            });

        $friendOf = $user->friendOf()->with(['profile' => function ($query) {
            $query->select('user_id', 'profiles.id');
        }])
            ->get()
            ->each(function ($friend) {
                $friend->online = $friend->isOnline();
            });

        return Inertia::render('Friends/Messages', [
            'messages' => $messages,
            'friends' => array_merge($friendOf->toArray(), $friends->toArray()),
            'receiver' => User::find($receiverId),
        ]);

    }

    public function show($receiverId)
    {

        $user_id = Auth::user()->id;

        if (! $user_id) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        $messages = Message::where(function ($query) use ($user_id, $receiverId) {
            $query->where('sender_id', $user_id)
                ->where('receiver_id', $receiverId);
        })
            ->orWhere(function ($query) use ($user_id, $receiverId) {
                $query->where('sender_id', $receiverId)
                    ->where('receiver_id', $user_id);
            })
            ->with(['sender', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
        if ($messages->count() <= 0) {
            return response()->json([
                'receiver' => User::findOrFail($receiverId),
            ]);
        }

        return response()->json($messages->reverse()->values());

    }

    public function store(Request $request)
    {

        $request->validate([
            'receiver_id' => 'required',
            'message' => 'required',
        ]);

        $user = User::find($request->receiver_id);
        if ($user) {
            if ($user->profile->isBlocked(auth()->user())) {
                return back()->withErrors(['message' => 'Sorry , you can not send a message to this user.']);
            }
        }

        $message = new Message();
        $message->sender_id = Auth::id();
        $message->receiver_id = $request->input('receiver_id');
        $message->message = $request->input('message');
        $message->save();

        event(new MessageSent($message->receiver_id, $message->sender_id));

        return back();

    }
}
