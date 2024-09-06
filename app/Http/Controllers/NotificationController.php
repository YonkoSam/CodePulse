<?php

namespace App\Http\Controllers;

use App\Models\FriendRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Mpociot\Teamwork\Facades\Teamwork;

class NotificationController extends Controller
{
    public function __invoke()
    {
        $user = Auth::user();

        return Inertia::render('Profiles/NotificationsPage', ['notifications' => $user->notifications()->latest()->paginate(20)]);
    }

    public function destroy(Request $request)
    {

        $notification = auth()->user()->notifications()->find($request->id);

        if ($notification->type == 'App\Notifications\FriendRequestNotification') {

            $friendRequest = FriendRequest::find($notification->data['request_id']);
            if ($friendRequest) {
                $friendRequest->delete();
            }
        }

        if ($notification->type == 'App\Notifications\TeamInviteNotification') {
            $invite = Teamwork::getInviteFromDenyToken($notification->data['deny_token']);
            if ($invite) {
                Teamwork::denyInvite($invite);
            }
        }

        if ($notification) {
            $notification->delete();
            return response()->json(['message' => 'Notification deleted successfully!']);
        }

        abort(404);

    }

    public function markAsRead(Request $request)
    {

        $notification = auth()->user()->notifications()->find($request->id);

        if ($notification) {
            $notification->markAsRead();

            return response()->json(['message' => 'Notification marked as read!']);
        }

        return response()->json(['message' => 'Notification was not found!']);
    }
}
