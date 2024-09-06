import React, {useEffect, useState} from 'react';
import {
    InputLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Select,
    Stack,
    Typography
} from "@mui/material";
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
import ReactTimeAgo from "react-time-ago";

export default function NotificationsPage({notifications}) {
    const {auth} = usePage<PageProps>().props;
    const [loading, setLoading] = useState<{ id: number | null; type: string | null }>({id: null, type: null});
    const [filter, setFilter] = useState('all');

    const handleChange = (event) => {
        setFilter(event.target.value);
    };

    useEffect(() => {
        listenForEvent(auth.user);
        return () => {
            StopListening(auth.user);
        };
    }, [auth.user.id]);

    const filteredNotifications = notifications.data.filter(notification => {
        if (filter === 'all') return true;
        if (filter === 'read') return notification.read_at !== null;
        if (filter === 'unread') return notification.read_at === null;
        return true;
    });

    return (
        <AuthenticatedLayout user={auth.user} renderNotifications={false} title="Notification"
                             header={<h2 className="font-semibold text-xl text-white leading-tight">Notifications</h2>}>
            <div className='container'>
                <InputLabel id="team-selector-label" className='!text-white'>Filter :</InputLabel>
                <Select
                    labelId="team-selector-label"
                    value={filter}
                    onChange={handleChange}
                    className="!text-white  p-2"
                    variant='standard'>
                    <MenuItem value={'all'}>
                        <Typography variant="body2">All</Typography>
                    </MenuItem>
                    <MenuItem value={'read'}>
                        <Typography variant="body2">Read</Typography>
                    </MenuItem>
                    <MenuItem value={'unread'}>
                        <Typography variant="body2">Unread</Typography>
                    </MenuItem>
                </Select>
                <List>
                    {filteredNotifications.map((notification: any) => (
                        <ListItem
                            key={notification.id}
                            className={notification.read_at ? '!text-gray-400' : '!text-black'}
                            sx={{bgcolor: notification.read_at ? 'grey.200' : 'white', mb: 1, borderRadius: 1}}
                        >
                            <ListItemIcon>
                                {notification.read_at ? <MarkChatReadIcon/> : <MarkChatUnreadIcon/>}
                            </ListItemIcon>

                            <Stack width={'100%'}>
                                <ListItemText primary={notification.data.message}/>
                                <span className='text-xs font-light font-jetBrains'>
                                    <ReactTimeAgo date={notification.created_at}/>
                                </span>
                            </Stack>

                            {!notification.read_at && renderNotificationActions(notification, null, loading, setLoading)}
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
}
