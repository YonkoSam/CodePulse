import React, {useEffect} from 'react';
import {List, ListItem, ListItemIcon, ListItemText} from "@mui/material";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import MarkChatUnreadIcon from "@mui/icons-material/MarkChatUnread";
import {
    handleDelete,
    listenForEvent,
    renderNotificationActions,
    StopListening
} from "@/Components/notifications/renderNotificationActions";
import {Clear} from "@mui/icons-material";
import Pagination from "@/Components/genralComp/Pagination";
import {PageProps} from "@/types";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {usePage} from "@inertiajs/react";

export default function NotificationsPage({notifications}) {

    const {auth} = usePage<PageProps>().props;


    useEffect(() => {
        listenForEvent(auth.user);
        return () => {
            StopListening(auth.user);
        };
    }, [import.meta.env.VITE_PUSHER_APP_KEY, import.meta.env.VITE_PUSHER_APP_CLUSTER]);


    return (
        <AuthenticatedLayout user={auth.user} renderNotifications={false} title="Notification"
                             header={<h2 className="font-semibold text-xl text-white leading-tight">Notifications</h2>}>
            <div className='container'>
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
                                <Clear onClick={() => handleDelete(notification.id)}/>
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

