<?php

namespace App\Http\Controllers;

use App\Events\NotificationSent;
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

        if ($sender && $receiver && $sender->id !== $receiver->id) {
            if (! $sender->sentFriendRequests()->where('receiver_id', $receiver->id)->exists()) {
                $friendrequest = FriendRequest::create([
                    'sender_id' => $sender->id,
                    'receiver_id' => $receiver->id,
                ]);

                $receiver->notify(new FriendRequestNotification($friendrequest));
                event(new NotificationSent($request->receiver_id));

                return back()->with(['message' => 'Friend request sent!']);
            } else {
                return back()->withErrors(['message' => 'You already sent a friend request to this user!']);
            }

        }

        return back()->withErrors(['message' => 'invalid User!']);
    }

    public function acceptRequest(Request $request)
    {

        $friendRequest = FriendRequest::find($request->request_id);

        if ($friendRequest) {
            Friendship::create(['user_id' => $friendRequest->sender_id, 'friend_id' => $friendRequest->receiver_id]);
            Friendship::create(['user_id' => $friendRequest->receiver_id, 'friend_id' => $friendRequest->sender_id]);
            $sender = $friendRequest->sender;
            $receiver = $friendRequest->receiver;
            $friendRequest->delete();

            $sender->notify(new FriendRequestStatus($receiver->name, 'accepted'));
            event(new NotificationSent($sender->id));

            return back()->with(['message' => 'Friend request accepted!']);
        }

        return back()->with(['message' => 'Friend request was not found!']);
    }

    public function rejectRequest(Request $request)
    {

        $friendRequest = FriendRequest::find($request->request_id);

        if ($friendRequest) {
            $sender = $friendRequest->sender;
            $receiver = $friendRequest->receiver;
            $friendRequest->delete();

            $sender->notify(new FriendRequestStatus($receiver->name, 'rejected'));
            event(new NotificationSent($sender->id));

            return back()->with(['message' => 'Friend request rejected!']);
        }

        return back()->with(['message' => 'Friend request was not found!']);
    }

    public function deleteNotification(Request $request)
    {
        if ($request->has('request_id')) {
            $friendRequest = FriendRequest::find($request->request_id);

            if ($friendRequest) {
                $friendRequest->delete();
            }
        }
        $notification = auth()->user()->notifications()->find($request->id);

        if ($notification) {
            $notification->delete();

            return back()->with(['message' => 'Notification deleted successfully!']);
        }

        return back()->with(['message' => 'Notification was not found!']);
    }

    public function markAsRead(Request $request)
    {

        $notification = auth()->user()->notifications()->find($request->id);

        if ($notification) {
            $notification->markAsRead();

            return back()->with(['message' => 'Notification marked as read!']);
        }

        return back()->with(['message' => 'Notification was not found!']);
    }
}
