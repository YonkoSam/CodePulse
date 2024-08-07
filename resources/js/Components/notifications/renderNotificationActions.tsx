import {Button, IconButton, Stack} from "@mui/material";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import {Link, router} from "@inertiajs/react";
import React from "react";
import {audio, Toast} from "@/utils";
import {User} from "@/types";

const renderNotificationActions = (notification: any) => {

    const markAsRead = (id: number) => {
        router.patch(route('notifications.markAsRead'), {
            'id': id,
        }, {
            preserveScroll: true,
            only: ['notifications'],
            onSuccess: () => {
                fetchNotifications();
            }
        });
    };

    const rejectRequest = (id: number, requestId: number) => {
        router.post(route('friend.request.reject'), {'request_id': requestId}, {
                onSuccess: () => {
                    Toast.fire({
                        icon: "success",
                        title: "Friend request Rejected Successfully"
                    })
                    markAsRead(id);

                },
                only: ['notifications'],

            }
        )
    };

    const acceptRequest = (id: number, requestId: number) => {
        router.post(route('friend.request.accept'), {'request_id': requestId}, {
            onSuccess: (session) => {
                Toast.fire({
                    icon: "success",
                    title: 'Friend request accepted!'
                })
                markAsRead(id);
            },
            onError: errors => {
                Toast.fire({
                    icon: "error",
                    title: errors.message
                })
            },
            only: ['notifications'],

        })
    };

    const acceptInvite = (id: number, acceptToken: string) => {
        router.get(route('teams.accept_invite', acceptToken), {}, {
            onSuccess: (session) => {
                Toast.fire({
                    icon: "success",
                    title: 'invite accepted!'
                })
                markAsRead(id);
            },
            onError: errors => {
                Toast.fire({
                    icon: "error",
                    title: errors.message
                })
            },
            only: ['notifications'],

        })
    };


    const rejectInvite = (id: number, denyToken: string) => {
        router.get(route('teams.deny_invite', denyToken), {}, {
            onSuccess: (session) => {
                Toast.fire({
                    icon: "success",
                    title: 'invite denied!'
                })
                markAsRead(id);
            },
            onError: errors => {
                Toast.fire({
                    icon: "error",
                    title: errors.message
                })
            },
            only: ['notifications'],

        })
    };


    switch (notification.type) {
        case 'App\\Notifications\\FriendRequestNotification':
            return (
                <Stack direction='row' spacing={2}>
                    <Button variant="contained" color="success" size='small'
                            onClick={() => acceptRequest(notification.id, notification.data.request_id)}>
                        Accept
                    </Button>
                    <Button variant="contained" color="error" size='small'
                            onClick={() => rejectRequest(notification.id, notification.data.request_id)}>
                        Reject
                    </Button>
                </Stack>

            );
        case 'App\\Notifications\\TeamInviteNotification':
            return (
                <Stack direction='row' spacing={2}>
                    <Button variant="contained" color="success" size='small'
                            onClick={() => acceptInvite(notification.id, notification.data.accept_token)}>
                        Accept
                    </Button>
                    <Button variant="contained" color="error" size='small'
                            onClick={() => rejectInvite(notification.id, notification.data.deny_token)}>
                        Reject
                    </Button>
                </Stack>);
        case 'App\\Notifications\\CommentNotification':
        case 'App\\Notifications\\ReplyNotification':
        case 'App\\Notifications\\LikeNotification':
            return (
                <Stack direction='row' alignItems='center'>
                    <IconButton
                        onClick={() => markAsRead(notification.id)}>
                        <MarkChatReadIcon color='primary'/>
                    </IconButton>
                    <Link href={`${notification.data.url}?markAsRead=${notification.id}`}>
                        <Button variant='contained' onClick={() => markAsRead(notification.id)} size='small'>
                            Visit
                        </Button>
                    </Link>
                </Stack>

            );
        case 'App\\Notifications\\FriendRequestStatus':

            return (
                <IconButton
                    onClick={() => markAsRead(notification.id)}>
                    <MarkChatReadIcon color='primary'/>
                </IconButton>
            )
        default:
            return null;
    }
};
const fetchNotifications = () => {
    router.reload({only: ['notifications', 'unreadNotificationsCount']})
};
const handleDelete = (id: number) => {
    router.delete(route('notifications.destroy', {
        'id': id,
    }), {
        preserveScroll: true,
        onSuccess: () => {
            fetchNotifications();
        }
    });
};

const listenForEvent = (user: User) => {
    window.Echo.channel(`my-notification-${user.id}`)
        .listen('.notification-sent', () => {
            fetchNotifications();
            try {
                audio.play().then().catch(e => console.error(`Error: ${e}`));
            } catch (e) {
                console.error(`Error: ${e}`);
            }
        });
}

const StopListening = (user: User) => {
    window.Echo.leaveChannel(`public:my-notification-${user.id}`);
}

export {renderNotificationActions, handleDelete, StopListening, listenForEvent};


