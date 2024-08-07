<?php

namespace App\Http\Controllers;

use App\Enums\MessageType;
use App\Events\MessageSeen;
use App\Events\MessageSent;
use App\Models\Friendship;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Mpociot\Teamwork\TeamworkTeam;

class ChatController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $latestMessage = Message::where(function ($query) use ($user) {
            $query->where(function ($subQuery) use ($user) {
                $subQuery->where('sender_id', $user->id)
                    ->whereNotNull('receiver_id')
                    ->orWhere('receiver_id', $user->id);
            })
                ->orWhere(function ($subQuery) use ($user) {
                    $subQuery->where('sender_id', $user->id)
                        ->whereIn('team_id', $user->teams()->pluck('id'));
                })
            ;
        })->latest()->first();

        if ($latestMessage) {
            if ($latestMessage->team_id) {
                return redirect()->route('chat.team', ['teamId' => $latestMessage->team_id]);
            } else {
                return redirect()->route('chat.user', ['receiverId' => $latestMessage->sender_id === $user->id ? $latestMessage->receiver_id : $latestMessage->sender_id]);
            }
        } else {
            $friend = $user->allFriends()->first();
            if ($friend) {
                return redirect()->route('chat.user', ['receiverId' => $friend->id]);
            } else {
                $team = $user->teams()->first();
                if ($team) {
                    return redirect()->route('chat.team', ['teamId' => $team->id]);
                } else {
                    return $this->renderChat(null);
                }
            }
        }
    }

    protected function renderChat($messages, $receiver = null, $team = null)
    {
        $user = Auth::user();
        $friends = $user->allFriends()
            ->with([
                'profile' => function ($query) {
                    $query->select('user_id', 'profiles.id');
                },
            ])
            ->withCount([
                'receivedMessages as last_message_timestamp' => function ($query) use ($user) {
                    $query->select(DB::raw('MAX(created_at)'))
                        ->where(function ($q) use ($user) {
                            $q->where('sender_id', $user->id)
                                ->orWhere('receiver_id', $user->id);
                        });
                },
            ])
            ->orderByDesc('last_message_timestamp')
            ->simplePaginate(7, ['*'], 'friends');

        $friends->getCollection()->transform(function ($friend) use ($user) {
            if ($friend->isOnline()) {
                $friend->online = $friend->isOnline();
            } else {
                $friend->lastTimeOnline = $friend->lastTimeOnline();
            }

            $friend->unreadMessagesCount = $user->unreadMessages($friend)->count();

            return $friend;
        });

        $teams = $user->teams()->with(['users' => function ($query) {
            $query->select('id', 'name', 'profile_image', 'current_team_id');
            $query->with(['profile' => function ($profileQuery) {
                $profileQuery->select('user_id', 'status');
            }])->limit(5);
        }])->get();

        $teams->each(function ($team) use ($user) {
            $team->unreadMessagesCount = $team->unreadMessages($user)->count();
        });

        $blockInitiatorId = ($receiver && $user->profile->isBlocked($receiver))
            ? Friendship::findFriendShip($receiver->id)->blocked_initiator
            : null;

        return Inertia::render('Friends/Messages', [
            'messages' => $messages,
            'friends' => $friends,
            'receiver' => $receiver,
            'team' => $team,
            'blockInitiatorId' => $blockInitiatorId,
            'teams' => $teams,
            'blockedList' => $user->blockedUsers(),
        ]);

    }

    public function userChat($receiverId = null)
    {
        $user = Auth::user();
        $receiver = User::find($receiverId);

        if (! $receiver) {
            return redirect()->route('chat.index')->withErrors(['Receiver not found']);
        }

        if($receiver->isOnline()) {
            $receiver->online = $receiver->isOnline();

        }else {
            $receiver->lastTimeOnline = $receiver->lastTimeOnline();

        }

        $messages = Message::where(function ($query) use ($user, $receiverId) {
            $query->where('sender_id', $user->id)
                ->where('receiver_id', $receiverId);
        })
            ->orWhere(function ($query) use ($user, $receiverId) {
                $query->where('sender_id', $receiverId)
                    ->where('receiver_id', $user->id);
            })
            ->latest()
            ->with(['sender', 'receiver'])
            ->simplePaginate(50, ['*'], 'messages');

        $messageIds = $messages->pluck('id')->toArray();

        $updatedRowsCount = DB::table('messages')
            ->whereIn('id', $messageIds)
            ->where('receiver_id', $user->id)
            ->whereNull('seen_at')
            ->update(['seen_at' => now()]);

        if ($updatedRowsCount) {
            event(new MessageSeen($receiverId));
        }

        return $this->renderChat($messages, $receiver);

    }

    public function teamChat($teamId = null)
    {
        $team = TeamworkTeam::find($teamId);
        $user = Auth::user();

        if (!$team) {
            abort('404');
        }

        if (!$team->hasUser($user)) {
            abort('404');
        }


        $messages = Message::where('team_id', $teamId)
            ->visibleSinceJoined($teamId,$user->id)
            ->with(['sender', 'team', 'team.users', 'usersSeen'])
            ->latest()
            ->simplePaginate(50, ['*'], 'messages');

        $rowsAffected = false;

        $messages->each(function ($message) use ($user, &$rowsAffected) {
            if ($message->sender_id !== $user->id) {
                $userSeen = $message->usersSeen()->where('user_id', $user->id)->first();
                if (! $userSeen) {
                    $rowsAffected = true;
                    $message->usersSeen()->attach($user->id, ['seen_at' => now()]);
                }
            }
        });


        if ($rowsAffected) {
            event(new MessageSeen($messages->first()->sender_id));
        }

        return $this->renderChat($messages, null, $team);
    }

    public function show($receiverId)
    {

        $user_id = Auth::user()?->id;

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
            ->take(20)
            ->get();

        if ($messages->count() <= 0) {
            return response()->json([
                'receiver' => User::find($receiverId),
            ]);
        }

        $messageIds = $messages->pluck('id')->toArray();
        $updatedRowsCount = DB::table('messages')
            ->whereIn('id', $messageIds)
            ->where('receiver_id', $user_id)
            ->whereNull('seen_at')
            ->update(['seen_at' => now()]);

        if ($updatedRowsCount) {
            event(new MessageSeen($receiverId));
        }

        return response()->json($messages);

    }

    public function store(Request $request)
    {

        $request->validate([
            'receiver_id' => 'required_without:team_id',
            'team_id' => 'required_without:receiver_id',
            'code' => 'nullable',
            'message' => 'required_without_all:code,audioBlob,image',
            'audioBlob' => 'nullable|mimes:webm',
            'image' => 'nullable|image',
        ]);

        $user = User::find($request->receiver_id);
        if ($user) {
            if ($user->profile->isBlocked(auth()->user())) {
                return back()->withErrors(['message' => 'Sorry , you can not send a message to this user.']);
            }
        }

        $message = new Message();
        $message->sender_id = Auth::id();

        if (request('team_id')) {
            $team = TeamworkTeam::find(request('team_id'));
            if (! $team) {
                abort('404');
            }

            if (! $team->hasUser(auth()->user())) {
                abort('404');
            }
            $message->team_id = $request->team_id;
        }
        if (request('receiver_id')) {
            $message->receiver_id = $request->receiver_id;
        }

        if (request('audioBlob')) {
            $audioPath = request('audioBlob')->store('audio-files');
            $message->type = MessageType::audio;
            $message->message = $audioPath;
        } elseif (request('image')) {
            $imagePath = request('image')->store('image-files');
            $message->type = MessageType::image;
            $message->message = $imagePath;
        } else {
            $message->type = MessageType::text;
            $message->message = $request->message;
        }

        $message->save();


        if ($message->team_id) {

            $memberIds = TeamworkTeam::find($message->team_id)->users()->pluck('id')->toArray();
            foreach ($memberIds as $memberId) {
                if($message->sender_id != $memberId) {
                    event(new MessageSent($memberId,$message->sender_id,'team'));
                }
            }


        } else {
            event(new MessageSent($message->receiver_id, $message->sender_id));
        }

        return back();
    }


    public function destroy(Message $message) {

        if($message->sender_id != auth()->id()){
            return back()->withErrors(['message'=>'you cant delete this message you are not the owner of it.']);
        }

        if ( Carbon::parse($message->created_at)->lte(Carbon::now()->subHour())) {
            return back()->withErrors(['message'=>'you cant delete this message time limit reached']);
        }

        $message->delete();
        return back();
    }
}
