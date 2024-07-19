import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Badge, Box, Button, CircularProgress, Container, Divider, Grid, Paper, Typography} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Link, router, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import TextInput from "@/Components/TextInput";
import Echo from "laravel-echo";
import Pusher from 'pusher-js';
import {format} from "date-fns";
import {audio, echoConfig, useScrollToBottom} from "@/utils";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import {Errors} from "@inertiajs/inertia";
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FriendStatus from "@/Components/FriendStatus";
import {isTypingNotification, sendIsTyping, sendStoppedTyping} from "@/Components/chat/isTypingNotification";

const Messages = ({messages, friends, receiver}) => {
    const {auth} = usePage<PageProps>().props;
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const MessageBoxRef = useScrollToBottom(messages);
    const [errors, setErrors] = useState<Errors>({message: ""});
    const typingTimeout = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsLoading(true);
        router.post(route('chat.store'), {message, 'receiver_id': receiver.id}, {
            onSuccess: () => setMessage(''),
            onError: (err) => setErrors(err),
            onFinish: () => setIsLoading(false)
        });
    };

    const fetchMessages = () => {
        router.reload();
    };

    useEffect(() => {
        window.Pusher = Pusher;
        window.Echo = new Echo(echoConfig);
        window.Echo.channel(`my-messages-${auth.user.id}`)
            .listen('.message-sent', () => {
                fetchMessages();
                audio.play();
            })
            .listen('.is-seen', (e) => {
                fetchMessages();
            });

        return () => {
            window.Echo.leaveChannel(`my-messages-${auth.user.id}`);
        };
    }, [auth.user.id]);


    const handleFocus = () => sendIsTyping(receiver.id);
    const handleBlur = () => sendStoppedTyping(receiver.id);

    const renderMessages = () => {
        return messages.map((msg, index) => {
            const isSameSenderAsPrevious = index > 0 && messages[index - 1].sender_id === msg.sender_id;
            const isSeen = msg.seen_at !== null;

            return (
                <div key={msg.id}
                     className={`flex ${msg.sender_id === auth.user.id ? 'justify-end' : 'justify-start'} gap-2.5 mb-1`}>
                    {!isSameSenderAsPrevious && msg.sender_id !== auth.user.id && (
                        <Avatar src={`/${msg.sender.profile_image}`} className="w-10 h-11"/>
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
                                className={`px-3.5 py-2 ${msg.sender_id === auth.user.id ? 'bg-indigo-600' : 'bg-gray-300'} rounded-3xl`}>
                                <Typography variant="body2"
                                            className={`${msg.sender_id === auth.user.id ? 'text-white' : 'text-gray-900'}`}>
                                    {msg.message}
                                </Typography>
                            </Box>
                            <div className="flex items-center">
                                <Typography variant="caption" className="text-gray-500 py-1 text-right">
                                    {format(new Date(msg.created_at), 'Ppp')}

                                    {msg.sender_id === auth.user.id && isSeen ?
                                        <span className='block text-xs text-blue-500 font-light'>
                                            <span
                                                className='font-medium'>seen at</span> {format(new Date(msg.seen_at), 'Ppp')}
                                                </span>
                                        : <></>}

                                </Typography>
                                {msg.sender_id === auth.user.id && (
                                    <span className="ml-2 flex items-center">
                                    {isSeen ? <DoneAllIcon fontSize="small" color="primary"/> :
                                        <DoneIcon fontSize="small" color="disabled"/>}
                                </span>
                                )}
                            </div>
                        </div>
                    </div>
                    {msg.sender_id === auth.user.id && !isSameSenderAsPrevious && (
                        <Avatar src={`/${msg.sender.profile_image}`} className="w-10 h-11"/>
                    )}
                </div>
            );
        });
    };


    const renderFriends = () => {
        return friends.map(friend => (
            <Link href={route('chatWithId.index', friend.id)} className="cursor-pointer flex gap-x-3 " key={friend.id}>
                <FriendStatus friend={friend}/>
                <Badge
                    color="error"
                    badgeContent={friend.unreadMessagesCount}
                    overlap="circular">
                </Badge>
            </Link>
        ));
    };

    return (
        <AuthenticatedLayout renderChat={false} user={auth.user} title='Messages'
                             header={<Typography variant="h5" className="font-semibold text-white">Your
                                 Profile</Typography>}>
            <Container>
                <Grid container spacing={2} className="bg-white rounded-xl shadow-md">
                    <Grid ref={MessageBoxRef} item xs={8}
                          className="w-full max-h-[90vh] bg-white overflow-auto rounded-xl p-4">
                        <Paper elevation={3} className="p-4">
                            <div className="grid pb-11">
                                {renderMessages()}
                                {isTypingNotification(receiver)}
                            </div>
                            <Divider/>
                            <div className="w-full pl-3 pr-1 py-1 flex items-center justify-between flex-col">
                                <form onSubmit={handleSubmit} className="flex w-full space-x-3">
                                    <TextInput
                                        size="small"
                                        name="message"
                                        variant="outlined"
                                        placeholder="Type here..."
                                        value={message}
                                        onFocus={handleFocus}
                                        onBlur={handleBlur}
                                        onChange={e => setMessage(e.target.value)}
                                    />
                                    <Button variant="contained" color="primary" type="submit"
                                            disabled={message.length <= 0 || (friends.length <= 0 && messages.length <= 0) || isLoading}
                                            endIcon={isLoading ? <CircularProgress size={20}/> : <SendIcon/>}>
                                        Send
                                    </Button>
                                </form>

                                <InputError message={errors.message} className="mt-2"/>
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={4} className="p-3 border-l border-gray-200">
                        <Typography variant="h6" className="font-semibold mb-4">Friends</Typography>
                        {friends.length > 0 ? (
                            <div className="grid gap-4">{renderFriends()}</div>
                        ) : (
                            <div className="mb-4">
                                <Typography variant="body2"
                                            className="block text-blue-600 py-2 font-bold mb-2 text-center">
                                    It looks like you don't have any friends yet. Let's add some developers!
                                </Typography>
                                <div className="flex flex-wrap justify-center">
                                    <Link href={route('profiles.index')} className="text-white">
                                        <PrimaryButton>Add Developers</PrimaryButton>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </AuthenticatedLayout>
    );
};

export default Messages;
