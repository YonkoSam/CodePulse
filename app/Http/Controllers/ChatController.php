<?php

namespace App\Http\Controllers;

use App\Enums\MessageType;
use App\Events\MessageSeen;
use App\Events\MessageSeenGroupChat;
use App\Http\Requests\MessageRequest;
use App\Models\Friendship;
use App\Models\Message;
use App\Models\Team;
use App\Models\User;
use App\Services\ProfanityFilterService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $latestMessage = $this->getLatestMessageForUser($user);

        if ($latestMessage) {
            return $this->redirectBasedOnLatestMessage($latestMessage, $user);
        }

        return $this->redirectToFirstFriendOrTeam($user);
    }

    private function getLatestMessageForUser($user)
    {
        return $user->sentMessages()->latest()->first() ?? $user->receivedMessages()->latest()->first() ;
    }

    private function redirectBasedOnLatestMessage($latestMessage, $user)
    {
        if ($latestMessage->team_id) {
            return redirect()->route('chat.team', ['teamId' => $latestMessage->team_id]);
        }

        $receiverId = $latestMessage->sender_id === $user->id ? $latestMessage->receiver_id : $latestMessage->sender_id;

        return redirect()->route('chat.user', ['receiverId' => $receiverId]);
    }

    private function redirectToFirstFriendOrTeam($user)
    {
        $friend = $user->allFriends()->first();
        if ($friend) {
            return redirect()->route('chat.user', ['receiverId' => $friend->id]);
        }

        $team = $user->teams()->first();
        if ($team) {
            return redirect()->route('chat.team', ['teamId' => $team->id]);
        }

        return $this->renderChat(null);
    }


    protected function renderChat($messages, $receiver = null, $team = null)
    {
        $user = Auth::user();

        $friends = $this->getFriendsWithUnreadMessages($user);
        $teams = $this->getTeamsWithUnreadMessages($user);

        $blockInitiatorId = $this->getBlockInitiatorId( $receiver);

        return Inertia::render('Chat/Messages', [
            'messages' => $messages,
            'friends' => $friends,
            'receiver' => $receiver,
            'team' => $team,
            'blockInitiatorId' => $blockInitiatorId,
            'teams' => $teams,
            'blockedList' => $user->blockedUsers(),
        ]);
    }

    private function getFriendsWithUnreadMessages($user)
    {
        return $user->allFriends(sort: true)
            ->with([
                'profile' => function ($query) {
                    $query->select('user_id', 'profiles.id');
                },
            ])
            ->simplePaginate(7, ['*'], 'friends')
            ->through(function ($friend) use ($user) {
                $friend->online = $friend->isOnline();
                $friend->unreadMessagesCount = $user->unreadMessages($friend)->count();
                return $friend;
            });
    }

    private function getTeamsWithUnreadMessages($user)
    {
        return $user->teams()
            ->with(['users' => function ($query) use ($user) {
                $query->select('id', 'name', 'profile_image', 'current_team_id')
                    ->visible($user->id)
                    ->with(['profile' => function ($profileQuery) {
                        $profileQuery->select('user_id', 'status');
                    }])
                    ->limit(5);
            }])
            ->orderByDesc('last_message_timestamp')
            ->get()
            ->each(function ($team) use ($user) {
                $team->unreadMessagesCount = $team->unreadMessages($user)->count();
            });

    }

    private function getBlockInitiatorId( $receiver)
    {
        if ($receiver) {
            $friedShip = Friendship::findFriendShip($receiver->id);
            if ($friedShip) {
                return $friedShip->blocked ? $friedShip->blocked_initiator : null;
            }}
        return null;
    }

    public function userChat($receiverId = null)
    {
        $user = Auth::user();
        $receiver = User::find($receiverId);

        if (! $receiver) {
            return redirect()->route('chat.index')->withErrors(['Receiver not found']);
        }
         $receiver->online = $receiver->isOnline();
        $receiver->load(['profile' => function ($query) {
            $query->select('user_id', 'profiles.id');
        }]);

        $messages =$user->allMessagesWithFriend($receiver->id)
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
            event(new MessageSeen($receiverId,$user->id));
        }

        return $this->renderChat($messages, $receiver);

    }

    public function teamChat($teamId = null)
    {
        $team = Team::find($teamId);
        $user = Auth::user();

        if (!$team) {
            abort('404');
        }

        if (!$team->hasUser($user)) {
            abort('404');
        }


        $messages = $user->allMessagesWithTeam($teamId)
            ->with([
                'sender:id,name,profile_image',
                'team:id,name',
                'usersSeen' => function ($query) {
                    $query->select(['users.id','users.name','users.profile_image'])->latest()->take(10);
                },
            ])
            ->withCount('usersSeen')
            ->latest()
            ->simplePaginate(50, ['*'], 'messages');


        $team->loadCount('users');
        $rowsAffected = false;

        foreach ($messages as $message) {
            if ($message->sender_id !== $user->id) {
                $userSeen = $message->usersSeen()->where('user_id', $user->id)->exists();
                if (!$userSeen) {
                    $rowsAffected = true;
                    $message->markAsSeen($user->id);
                }
            }
        }


        if ($rowsAffected) {
            event(new MessageSeenGroupChat($teamId,$user));
        }

        return $this->renderChat($messages, null, $team);
    }

    public function show($receiverId)
    {

        $user = Auth::user();

        $messages = $user->allMessagesWithFriend($receiverId)->with(['sender', 'receiver'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        if ($messages->count() <= 0) {
            return response()->json([
                'receiver' => User::find($receiverId),
            ]);
        }

        $messageIds = $messages->pluck('id')->toArray();


        $updatedRowsCount = DB::table('messages')
            ->whereIn('id', $messageIds)
            ->where('receiver_id', $user->id)
            ->whereNull('seen_at')
            ->update(['seen_at' => now()]);

        if ($updatedRowsCount) {
            event(new MessageSeen($receiverId,$user->id));
        }


        return response()->json($messages);

    }

    public function store(MessageRequest $request, ProfanityFilterService $profanityFilterService)
    {
        $validatedData = $request->validated();

        $receiver = null;
        $team = null;

        if (isset($validatedData['receiver_id'])) {
            $this->validateReceiver($validatedData['receiver_id']);
            $receiver = $validatedData['receiver_id'];
        } elseif (isset($validatedData['team_id'])) {
            $this->validateTeam($validatedData['team_id']);
            $team = $validatedData['team_id'];
        }

        $message = new Message();
        $message->sender_id = auth()->id();
        $message->receiver_id = $receiver;
        $message->team_id = $team;
        $message->type = $this->determineMessageType($request);
        $message->message = $this->processMessageContent($request, $profanityFilterService);
        $message->seen_at = null;
        $message->save();

        $message->load('sender', 'receiver');

        return response()->json($message);
    }

    private function validateReceiver($receiverId)
    {
        $user = auth()->user();
        $receiver = User::findOrFail($receiverId);

        if ($receiver->isBlocked($user->id) || !$user->isFriend($receiver)) {
            throw ValidationException::withMessages([
                'receiver_id' => ['Sorry, you are smart but not smart enough.'],
            ]);
        }
    }

    private function validateTeam($teamId)
    {
        $team = Team::findOrFail($teamId);

        if (!$team->hasUser(auth()->user())) {
            throw ValidationException::withMessages([
                'team_id' => ['You are not a member of this team.'],
            ]);
        }

    }


    private function determineMessageType(MessageRequest $request)
    {
        if ($request->hasFile('audioBlob')) {
            return MessageType::audio;
        } elseif ($request->hasFile('image')) {
            return MessageType::image;
        } else {
            return MessageType::text;
        }
    }

    private function processMessageContent(MessageRequest $request, ProfanityFilterService $profanityFilterService)
    {
        if ($request->hasFile('audioBlob')) {
            return $request->file('audioBlob')->store('audio-files');
        } elseif ($request->hasFile('image')) {
            return $request->file('image')->store('image-files');
        } else {
            return $profanityFilterService->filterString($request->input('message'));
        }
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
