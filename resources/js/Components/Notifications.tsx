import React, {useEffect, useMemo, useState} from 'react';
import {Link, router, usePage} from "@inertiajs/react";
import {Badge, Box, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Stack} from "@mui/material";
import Swal from "sweetalert2";
import {Clear, NotificationsRounded} from "@mui/icons-material";
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import Echo from 'laravel-echo';
import {PageProps} from "@/types";
import Pusher from 'pusher-js';

export default function Notifications() {
    const Toast = useMemo(() => Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    }), []);

    const {auth} = usePage<PageProps>().props;

    const {notifications} = usePage().props;


    const [displayNotifications, setDisplayNotifications] = useState<boolean | undefined>(false);

    useEffect(() => {
        window.Pusher = Pusher;
        window.Echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT,
            wssPort: import.meta.env.VITE_REVERB_PORT,
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
        });

        window.Echo.channel(`my-notification-${auth.user.id}`)
            .listen('.notification-sent', () => {
                fetchNotifications();

            });


        return () => {
            window.Echo.leaveChannel(`my-notification-${auth.user.id}`);
        };
    }, [import.meta.env.VITE_PUSHER_APP_KEY, import.meta.env.VITE_PUSHER_APP_CLUSTER]);


    const fetchNotifications = () => {
        router.reload({only: ['notifications']})
    };

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
            onSuccess: () => {
                Toast.fire({
                    icon: "success",
                    title: "Friend request Accepted Successfully"
                })
                markAsRead(id);

            }
        })
    };

    const renderNotificationActions = (notification: any) => {
        switch (notification.type) {
            case 'App\\Notifications\\FriendRequestNotification':
                return (
                    <Stack direction='row' spacing={2}>
                        <Button variant="contained" color="success" size='small'
                                onClick={() => acceptRequest(notification.id, notification.data.request_id)}>
                            Accept Request
                        </Button>
                        <Button variant="contained" color="error" size='small'
                                onClick={() => rejectRequest(notification.id, notification.data.request_id)}>
                            Reject Request
                        </Button>
                    </Stack>
                );
            case 'App\\Notifications\\CommentNotification':
            case 'App\\Notifications\\LikeNotification':
                return (
                    <Box>
                        <IconButton
                            onClick={() => markAsRead(notification.id)}>
                            <MarkChatReadIcon color='info'/>
                        </IconButton>
                        <Link href={notification.data.url}>
                            <Button variant='contained' onClick={() => markAsRead(notification.id)} size='small'>
                                Visit the post
                            </Button>
                        </Link>

                    </Box>

                );
            default:
                return null;
        }
    };


    return (
        <>
            <Badge className='!text-white' color="error"
                   badgeContent={notifications.filter((e: any) => !e.read_at).length}
                   overlap="circular"
                   onClick={() => setDisplayNotifications(!displayNotifications)}><NotificationsRounded/>
            </Badge>
            {displayNotifications ? (
                <List className='!absolute right-16 z-50 bg-black !px-2 !rounded'>
                    {notifications.length === 0 ?
                        <ListItemText className='bg-gray-200 rounded text-black p-2'
                                      primary='it seems you dont have any notification'/> : <></>
                    }
                    {notifications.slice(0, 10).map((notification: any) => (
                        <ListItem
                            key={notification.id}
                            className={notification.read_at ? '!text-gray-400' : '!text-black'}
                            sx={{bgcolor: notification.read_at ? 'grey.200' : 'white', mb: 1, borderRadius: 1}}
                        >
                            <ListItemIcon>
                                {notification.read_at ? <MarkChatReadIcon/> : <MarkChatUnreadIcon/>}
                            </ListItemIcon>

                            <ListItemText primary={notification.data.message}/>
                            {!notification.read_at && renderNotificationActions(notification)}
                            <ListItemIcon className='pl-2'>
                                <Clear onClick={() => handleDelete(notification.id, notification.data.request_id)}/>
                            </ListItemIcon>
                        </ListItem>
                    ))}
                </List>
            ) : <></>}
        </>
    );
}

