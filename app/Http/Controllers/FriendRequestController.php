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
        $sender = User::find($request->sender_id);
        $receiver = User::find($request->receiver_id);

        if ($sender->isFriend($receiver)) {
            return back()->withErrors(['message' => 'You are already a friend with this user !']);
        }

        if ($receiver && $sender->id !== $receiver->id) {
            if (! $sender->sentFriendRequests()->where('receiver_id', $receiver->id)->exists()) {
                if($sender->allMessagesWithFriend($receiver->id)->withTrashed()->exists()){
                    $sender->allMessagesWithFriend($receiver->id)->restore();
                }
                $friendRequest = FriendRequest::create([
                    'sender_id' => $sender->id,
                    'receiver_id' => $receiver->id,
                ]);


                $receiver->notify(new FriendRequestNotification($friendRequest));

                return response()->json(['message' => 'Friend request sent!']);
            } else {
                return response()->json(['message' => 'You already sent a friend request to this user!'],401);
            }

        }

        return response()->json(['message' => 'invalid User!'],401);
    }

    public function acceptRequest(Request $request)
    {

        $friendRequest = FriendRequest::find($request->request_id);

        if ($friendRequest) {
            Friendship::create(['user_id' => $friendRequest->sender_id, 'friend_id' => $friendRequest->receiver_id]);
            $sender = $friendRequest->sender;
            $receiver = $friendRequest->receiver;
            $friendRequest->delete();
            $sender->notify(new FriendRequestStatus($receiver->name, 'accepted'));
            return response()->json(['message' => 'Friend request accepted!']);
        }

        return response()->json(['message' => 'Friend request was not found!'],401);
    }

    public function rejectRequest(Request $request)
    {

        $friendRequest = FriendRequest::find($request->request_id);

        if ($friendRequest) {
            $sender = $friendRequest->sender;
            $receiver = $friendRequest->receiver;
            $friendRequest->delete();

            $sender->notify(new FriendRequestStatus($receiver->name, 'rejected'));

            return response()->json(['message' => 'Friend request rejected!']);
        }

        return response()->json(['message' => 'Friend request was not found!'],401);
    }
}
