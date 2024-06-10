import React, {useEffect, useState} from 'react';
import {Avatar, Box, Button, Container, Grid, Stack, Typography} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import TextInput from "@/Components/TextInput";
import Echo from "laravel-echo";
import Pusher from 'pusher-js';

const Messages = ({messages, friends, receiverId}) => {
    const {auth} = usePage<PageProps>().props;
    const [message, setMessage] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('chat.store'), {message, 'receiver_id': receiverId}, {
            onSuccess: () => setMessage(''),
        });
    };

    const fetchMessages = () => {
        router.reload({only: ['messages']})
    };

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
        window.Echo.channel(`my-messages-${auth.user.id}`)
            .listen('.message-sent', (e) => {
                fetchMessages();
            });

        return () => {
            window.Echo.leaveChannel(`my-messages-${auth.user.id}`);
        };
    }, [import.meta.env.VITE_PUSHER_APP_KEY, import.meta.env.VITE_PUSHER_APP_CLUSTER]);

    const renderMessages = () => {
        return messages.map((msg, index) => {
            const isSameSenderAsPrevious = index > 0 && messages[index - 1].sender_id === msg.sender_id;

            return (
                <div key={msg.id}
                     className={`flex ${msg.sender_id === auth.user.id ? 'justify-end' : 'justify-start'} gap-2.5 mb-1`}>
                    {!isSameSenderAsPrevious && msg.sender_id !== auth.user.id && (
                        <Avatar src={`/${msg.sender.profile_image}`} className="w-10 h-11"></Avatar>
                    )}
                    <div className={`grid ${msg.sender_id === auth.user.id ? 'items-end' : 'items-start'}`}>
                        {!isSameSenderAsPrevious && (
                            <Typography variant="body2"
                                        className={`font-semibold pb-1 ${msg.sender_id === auth.user.id ? 'text-right' : ''}`}>
                                {msg.sender_id === auth.user.id ? 'You' : msg.sender.name}
                            </Typography>
                        )}
                        <div className={`w-max grid ${msg.sender_id === auth.user.id ? 'ml-auto' : ''}`}>
                            <Box
                                className={`px-3.5 py-2 ${msg.sender_id === auth.user.id ? 'bg-indigo-600' : 'bg-gray-100'} rounded justify-start items-center gap-3 inline-flex`}>
                                <Typography variant="body2"
                                            className={`${msg.sender_id === auth.user.id ? 'text-white' : 'text-gray-900'}`}>
                                    {msg.message}
                                </Typography>
                            </Box>
                            <div
                                className={`justify-end items-center inline-flex mb-2.5 ${msg.sender_id === auth.user.id ? 'text-right' : ''}`}>
                                <Typography variant="caption" className="text-gray-500 py-1">{msg.time}</Typography>
                            </div>
                        </div>
                    </div>
                    {msg.sender_id === auth.user.id && !isSameSenderAsPrevious && (
                        <Avatar src={`/${msg.sender.profile_image}`} className="w-10 h-11"></Avatar>
                    )}
                </div>
            );
        });
    };

    const renderFriends = () => {
        return friends.map(friend => (
            <Link href={route('chatWithId.index', friend.id)} className={'cursor-pointer'} key={friend.id}>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Avatar src={`/${friend.profile_image}`}/>
                    <Typography variant="body2" className="font-semibold">{friend.name}</Typography>
                </Stack>
            </Link>
        ));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<Typography variant="h5" className="font-semibold text-white">Your
            Profile</Typography>}>
            <Head title="Home"/>
            <Container>
                <Grid container spacing={2} className="w-full max-h-svh bg-white !rounded-2xl overflow-auto">
                    <Grid item xs={8} className="p-3">
                        <div className="grid pb-11">
                            {renderMessages()}
                        </div>
                        <div
                            className="w-full  pl-3 pr-1 py-1 flex items-center justify-between">

                            <form onSubmit={handleSubmit} className='flex w-full'>
                                <TextInput size='small' variant="outlined" placeholder="Type here..." value={message}
                                           onChange={(e) => setMessage(e.target.value)}/>
                                <Button variant="contained" color="primary" type="submit"
                                        endIcon={<SendIcon/>}>Send</Button>
                            </form>
                        </div>
                    </Grid>
                    <Grid item xs={4} className="p-3 border-l border-gray-200">
                        <Typography variant="h6" className="font-semibold mb-4">Friends</Typography>
                        <div className="grid gap-4">{renderFriends()}</div>
                    </Grid>
                </Grid>
            </Container>
        </AuthenticatedLayout>
    );
};

export default Messages;
