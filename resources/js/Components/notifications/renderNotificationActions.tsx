import {Box, Button, IconButton, Stack} from "@mui/material";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import {Link, router} from "@inertiajs/react";
import React from "react";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import {audio, echoConfig, Toast} from "@/utils";
import {User} from "@/types";

const renderNotificationActions = (notification: any) => {


    const markAsRead = (id: number) => {
        router.post(route('notifications.markAsRead'), {
            'id': id,
        }, {
            preserveScroll: true,
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

            }
        })
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
            }

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
        case 'App\\Notifications\\CommentNotification':
        case 'App\\Notifications\\ReplyNotification':
        case 'App\\Notifications\\LikeNotification':
            return (
                <Box>
                    <IconButton
                        onClick={() => markAsRead(notification.id)}>
                        <MarkChatReadIcon color='info'/>
                    </IconButton>
                    <Link href={notification.data.url}>
                        <Button variant='contained' onClick={() => markAsRead(notification.id)} size='small'>
                            Visit
                        </Button>
                    </Link>

                </Box>

            );
        case 'App\\Notifications\\FriendRequestStatus':
            return (
                <IconButton
                    onClick={() => markAsRead(notification.id)}>
                    <MarkChatReadIcon color='info'/>
                </IconButton>
            )
        default:
            return null;
    }
};
const fetchNotifications = () => {
    router.reload({only: ['notifications']})
};
const handleDelete = (id: number, requestID: number) => {
    router.post(route('notifications.delete'), {
        'id': id,
        'request_id': requestID
    }, {
        preserveScroll: true,
        onSuccess: () => {
            fetchNotifications();
        }
    });
};

const listenForEvent = (user: User) => {
    window.Pusher = Pusher;
    window.Echo = new Echo(echoConfig);

    window.Echo.channel(`my-notification-${user.id}`)
        .listen('.notification-sent', () => {
            fetchNotifications();
            audio.play();
        });
}

const StopListening = (user: User) => {
    window.Echo.leaveChannel(`my-notification-${user.id}`);
}

export {renderNotificationActions, handleDelete, StopListening, listenForEvent};


