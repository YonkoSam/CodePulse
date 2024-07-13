import React, {useEffect} from 'react';
import {List, ListItem, ListItemIcon, ListItemText, Typography} from "@mui/material";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import {
    handleDelete,
    listenForEvent,
    renderNotificationActions,
    StopListening
} from "@/Components/notifications/renderNotificationActions";
import {Clear} from "@mui/icons-material";
import Pagination from "@/Components/Pagination";
import {usePage} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {PageProps} from "@/types";

export default function NotificationsPage({notifications}) {

    const {auth} = usePage<PageProps>().props;
    useEffect(() => {
        listenForEvent(auth.user);
        return () => {
            StopListening(auth.user);
        };
    }, [import.meta.env.VITE_PUSHER_APP_KEY, import.meta.env.VITE_PUSHER_APP_CLUSTER]);


    return (
        <AuthenticatedLayout user={auth.user} renderNotifications={false} title='Notifications'
                             header={<h2 className="font-semibold text-xl text-white leading-tight">Notifications</h2>}>
            <div style={{padding: '20px'}}>
                <Typography variant="h3" gutterBottom>Old Notifications</Typography>
                <List>
                    {notifications.data.map((notification: any) => (
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
                <Pagination links={notifications.links} currentPage={notifications.current_page}
                            lastPage={notifications.last_page}/>

            </div>
        </AuthenticatedLayout>

    );
};

