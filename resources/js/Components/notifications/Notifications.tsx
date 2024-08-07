import React, {useEffect, useState} from 'react';
import {Link, usePage} from "@inertiajs/react";
import {Badge, Button, List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import {Clear, NotificationsRounded} from "@mui/icons-material";
import MarkChatReadIcon from '@mui/icons-material/MarkChatRead';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import {handleDelete, listenForEvent, renderNotificationActions, StopListening} from "./renderNotificationActions";
import {PageProps} from "@/types";
import {AnimatePresence, motion} from 'framer-motion';

export default function Notifications({notifications, count}) {
    const [displayNotifications, setDisplayNotifications] = useState<boolean | undefined>(false);
    const {auth} = usePage<PageProps>().props;

    useEffect(() => {
        listenForEvent(auth.user);
        return () => {
            StopListening(auth.user);
        };
    }, [import.meta.env.VITE_PUSHER_APP_KEY, import.meta.env.VITE_PUSHER_APP_CLUSTER]);

    return (
        <>
            <Badge className='!text-white hover:scale-110 hover:rotate-6  duration-300 ease-in-out cursor-pointer '
                   color="error"
                   badgeContent={count}
                   overlap="circular"
                   onClick={() => setDisplayNotifications(!displayNotifications)}><NotificationsRounded/>
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
                                {!notification.read_at && renderNotificationActions(notification)}
                                <ListItemIcon className='pl-2'>
                                    <Clear
                                        onClick={() => handleDelete(notification.id)}/>
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
                                    See previous notifications...
                                </Button>
                            </Link>
                        )}
                    </List>

                )}
            </AnimatePresence>

        </>

    );
}

