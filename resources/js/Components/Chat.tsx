import React, {useEffect, useState} from 'react';
import Echo from 'laravel-echo';
import {router, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import {Avatar, IconButton, Slide, Stack, TextField} from "@mui/material";
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import {SendIcon} from "lucide-react";
import Pusher from 'pusher-js';

const Chat = ({open, messages, receiverId}) => {

    const [message, setMessage] = useState('');

    const {auth} = usePage<PageProps>().props;


    const [openChat, setOpenChat] = useState(false);
    const [minimized, setMinimized] = useState(false);


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
            .listen('.message-sent', () => {
                setOpenChat(true);
                setMinimized(false);
                fetchMessages();
            });

        return () => {
            window.Echo.leaveChannel(`my-messages-${auth.user.id}`);
        };
    }, [import.meta.env.VITE_PUSHER_APP_KEY, import.meta.env.VITE_PUSHER_APP_CLUSTER]);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('chat.store'), {message, 'receiver_id': receiverId}, {
            onSuccess: () => setMessage(''),
        });
    };

    const handleToggleMinimize = () => {
        setMinimized(!minimized);
    };
    return (
        <Slide direction="up" in={open || openChat} mountOnEnter unmountOnExit>
            <div
                className='rounded absolute bottom-0 bg-white max-w-2xl text-xs text-gray-800 min-w-52 py-2 px-3 right-[15%] overflow-y-auto max-h-[50%]'>
                <Stack direction='row' alignItems='center'>
                    <div className='!text-gray-800 !h-fit'>
                        <IconButton onClick={handleToggleMinimize}>
                            {minimized ? <FullscreenIcon/> : <CloseFullscreenIcon/>}
                        </IconButton>
                    </div>
                    <p>Chat</p>

                </Stack>
                <div style={{display: minimized ? 'none' : 'block'}}>
                    <div id="chat-box">
                        {messages.map((msg, index) => {
                            const isSameSenderAsPrevious = index > 0 && messages[index - 1].sender_id === msg.sender_id;
                            return (
                                <div key={msg.id}
                                     className={`flex flex-col ${msg.sender_id === auth.user.id ? 'items-end' : 'items-start'}`}>
                                    {!isSameSenderAsPrevious && (
                                        <Stack direction={msg.sender_id === auth.user.id ? 'row-reverse' : 'row'}
                                               alignItems='center' gap={1}>
                                            <Avatar src={'/' + msg.sender.profile_image}></Avatar>
                                            <strong
                                                className='text-gray-900 font-semibold leading-snug pb-1'>{msg.sender_id === auth.user.id ? 'You' : msg.sender.name} </strong>
                                        </Stack>

                                    )}
                                    <p className={msg.sender_id === auth.user.id ? 'px-3.5 text-blue-500 py-2 bg-gray-100 rounded-3xl rounded-br-none my-2'
                                        : 'px-3.5 py-2 bg-gray-100 rounded-3xl rounded-tl-none my-2'}>
                                        {msg.message}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    <form onSubmit={handleSubmit} className='flex gap-2'>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a message..."
                            size='small'
                        />
                        <IconButton type="submit">
                            <SendIcon/>
                        </IconButton>
                    </form>
                </div>
            </div>
        </Slide>


    );
};

export default Chat;
