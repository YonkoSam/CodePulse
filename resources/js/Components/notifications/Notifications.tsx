import React, {useEffect, useState} from 'react';
import {Link, router, usePage} from "@inertiajs/react";
import {Badge, Button, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {Clear, NotificationsRounded} from "@mui/icons-material";
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import {handleDelete, listenForEvent, renderNotificationActions, StopListening} from "./renderNotificationActions";
import {Notification, PageProps} from "@/types";
import {AnimatePresence, motion} from 'framer-motion';

export default function Notifications({notifications: initialNotifications, unreadCount, setUnreadCount}: {
    notifications: Notification[],
    unreadCount: number, setUnreadCount: (unreadCount: (prev: number) => number) => void;
}) {
    const [notifications, setNotifications] = useState(initialNotifications || [])
    const [displayNotifications, setDisplayNotifications] = useState<boolean | undefined>(false);
    const [loading, setLoading] = useState<{ id: number | null; type: string | null }>({id: null, type: null});

    const {auth} = usePage<PageProps>().props;

    useEffect(() => {
        const handleNotificationReceived = (newNotification: Notification) => {
            setNotifications(prev => {
                if (!prev.some(notification => notification.id === newNotification.id)) {
                    return [newNotification, ...prev].slice(0, 10);
                }
                return prev;
            });
            setUnreadCount((prev: number) => prev + 1);
            if (newNotification?.type === "App\\Notifications\\FriendRequestStatus") {
                router.reload({only: ['isFriend']});
            }
        };

        listenForEvent(auth.user, handleNotificationReceived);
        return () => {
            StopListening(auth.user);
        };
    }, [auth.user.id]);


    return (
        <>
            <Badge
                className='!text-white cursor-pointer '
                component={motion.div}
                animate={unreadCount > 0 ? {
                    rotate: [-5, 5, -5, 5, 0],
                    transition: {
                        duration: 0.5,
                        repeat: Infinity,
                        repeatType: "loop"
                    }
                } : {}}
                whileHover={{scale: 1.15}}
                color="error"
                badgeContent={unreadCount}
                overlap="circular"
                onClick={() => setDisplayNotifications(!displayNotifications)}
            >
                <NotificationsRounded/>
            </Badge>
            <AnimatePresence>

                {displayNotifications && (
                    <List
                        component={motion.div}
                        initial={{opacity: 0, scale: 0.5, y: -20}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.5, y: -20}}
                        transition={{type: 'spring', stiffness: 300, damping: 20}}

                        className='!absolute   right-0 left-0 sm:right-16 sm:left-auto  z-[1000] bg-black !px-2 !rounded max-w-xl'>
                        {notifications.length === 0 ?
                            <ListItemText className='bg-gray-200 rounded text-black p-2'
                                          primary='it seems you dont have any notification'/> : <></>
                        }
                        {notifications.map((notification: any) => (
                            <ListItem
                                key={notification.id}
                                className={notification.read_at ? '!text-gray-400' : '!text-black'}
                                sx={{bgcolor: notification.read_at ? 'grey.200' : 'white', mb: 1, borderRadius: 1}}
                            >
                                <ListItemIcon>
                                    {notification.read_at ? <MarkChatReadIcon/> : <MarkChatUnreadIcon/>}
                                </ListItemIcon>

                                <ListItemText
                                    primary={<span
                                        className='line-clamp-3 text-sm px-2'> {notification.data.message} </span>}/>
                                {!notification.read_at && renderNotificationActions(notification, setNotifications, loading, setLoading)}
                                <ListItemIcon className='pl-2'>
                                    <Clear
                                        onClick={() =>
                                            handleDelete(notification.id, false).then(() =>
                                                setNotifications(prev => prev.filter(notif => notif.id != notification.id))
                                            )}/>
                                </ListItemIcon>
                            </ListItem>
                        ))}

                        {notifications.length >= 10 && (
                            <Link href={route('my-notifications')}>
                                <Button
                                    color='primary'
                                    fullWidth
                                    variant="contained"
                                    className="!text-xs !font-bold hover:bg-blue-600"
                                >
                                    See previous
                                    notifications...
                                    {unreadCount > 0 && notifications.filter(not => !not.read_at).length == 0 ? `(${unreadCount})` : null}
                                </Button>
                            </Link>
                        )}
                    </List>

                )}
            </AnimatePresence>

        </>

    );
}

