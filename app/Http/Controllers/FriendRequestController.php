<?php

namespace App\Http\Controllers;

use App\Models\FriendRequest;
use App\Models\Friendship;
use App\Models\User;
use App\Notifications\FriendRequestNotification;
use App\Notifications\FriendRequestStatus;
use Illuminate\Http\Request;

class FriendRequestController extends Controller
{
    public function sendRequest(Request $request)
    {
        $request->validate([
            'sender_id' => 'required',
            'receiver_id' => 'required',
        ]);

        $sender = User::find($request->sender_id);
        $receiver = User::find($request->receiver_id);

        if (!$sender || !$receiver || $sender->id === $receiver->id) {
            return response()->json(['message' => 'Invalid users!'], 404);
        }

        if ($sender->isFriend($receiver)) {
            return response()->json(['message' => 'You are already friends with this user!'], 409);
        }

        if ($sender->id === auth()->id() && $sender->sentFriendRequests()->where('receiver_id', $receiver->id)->exists()) {
            return response()->json(['message' => 'You already sent a friend request to this user!'], 409);
        }

        if ($receiver->id === auth()->id() && $receiver->receivedFriendRequests()->where('sender_id', $sender->id)->exists()) {
            return response()->json(['message' => 'You already have a pending friend request from this user!'], 409);
        }


        $friendRequest = FriendRequest::create([
            'sender_id' => $sender->id,
            'receiver_id' => $receiver->id,
        ]);

        $receiver->notify(new FriendRequestNotification($friendRequest));

        return response()->json(['message' => 'Friend request sent!','requestId'=>$friendRequest->id],);
    }

    public function acceptRequest(Request $request)
    {
        return $this->handleRequest($request, 'accepted');
    }

    private function handleRequest(Request $request, string $status)
    {
        $request->validate(['request_id' => 'required']);
        $friendRequest = FriendRequest::findOrFail($request->request_id);

        $sender = $friendRequest->sender;
        $receiver = $friendRequest->receiver;
        $notification = $receiver->notifications()
            ->where('type', FriendRequestNotification::class)
            ->where('data->request_id', $friendRequest->id)
            ->firstOrFail();

        $notificationData = $notification->data;
        $notificationData['message'] = "Friend request $status!";

        switch ($status) {
            case 'accepted':
                Friendship::create([
                    'user_id' => $friendRequest->sender_id,
                    'friend_id' => $friendRequest->receiver_id
                ]);
                $sender->allMessagesWithFriend($receiver->id)->withTrashed()->restore();
                $sender->notify(new FriendRequestStatus($receiver->name, $status));
                break;
            case 'rejected':
                if (auth()->id() !== $friendRequest->receiver_id) {
                    return response()->json(['message' => 'Unauthorized to reject this request'], 403);
                }
                break;
            case 'cancelled':
                if (auth()->id() !== $friendRequest->sender_id) {
                    return response()->json(['message' => 'Unauthorized to cancel this request'], 403);
                }
                $notification->delete();
                return response()->json(['message' => "Friend request $status!"]);
            default:
                return response()->json(['message' => 'Invalid status'], 400);
        }

        $notification->update([
            'data' => $notificationData,
            'read_at' => now()
        ]);

        $friendRequest->delete();

        return response()->json(['message' => "Friend request $status!"]);
    }

    public function rejectRequest(Request $request)
    {
        return $this->handleRequest($request, 'rejected');
    }

    public function cancelRequest(Request $request)
    {
        return $this->handleRequest($request, 'cancelled');
    }



}
