import React, {useEffect, useRef, useState} from 'react';
import {Avatar, Box, Button, CircularProgress, Container, Divider, Grid, Paper, Typography} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import TextInput from "@/Components/TextInput";
import Echo from "laravel-echo";
import Pusher from 'pusher-js';
import {format} from "date-fns";
import {audio, echoConfig, useScrollToBottom} from "@/utils";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";
import {Errors} from "@inertiajs/inertia";
import FriendStatus from "@/Components/FriendStatus";

const Messages = ({messages, friends, receiver}) => {
    const {auth} = usePage<PageProps>().props;
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
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
        router.reload({only: ['messages']});
    };

    useEffect(() => {
        window.Pusher = Pusher;
        window.Echo = new Echo(echoConfig);
        window.Echo.channel(`my-messages-${auth.user.id}`)
            .listen('.message-sent', () => {
                fetchMessages();
                audio.play();
            })
            .listen('.is-typing', (e) => {
                setIsTyping(e.isTyping);
            });

        return () => {
            window.Echo.leaveChannel(`my-messages-${auth.user.id}`);
        };
    }, [auth.user.id]);

    const sendIsTyping = () => {

        if (receiver) {
            router.post(route('is-typing', {receiver: receiver.id, isTyping: true}), {}, {
                preserveScroll: true,
                preserveState: true
            });
        }

    };

    const sendStoppedTyping = () => {
        if (receiver) {
            router.post(route('is-typing', {receiver: receiver.id, isTyping: false}), {}, {
                preserveScroll: true,
                preserveState: true
            });
        }
    };

    const handleFocus = () => sendIsTyping();
    const handleBlur = () => sendStoppedTyping();

    useEffect(() => {
        const handleBeforeUnload = () => sendStoppedTyping();

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const renderMessages = () => {
        return messages.map((msg, index) => {
            const isSameSenderAsPrevious = index > 0 && messages[index - 1].sender_id === msg.sender_id;
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
                                className={`px-3.5 py-2 ${msg.sender_id === auth.user.id ? 'bg-indigo-600' : 'bg-gray-100'} rounded-3xl`}>
                                <Typography variant="body2"
                                            className={`${msg.sender_id === auth.user.id ? 'text-white' : 'text-gray-900'}`}>
                                    {msg.message}
                                </Typography>
                            </Box>
                            <Typography variant="caption" className="text-gray-500 py-1">
                                {format(new Date(msg.created_at), 'Ppp')}
                            </Typography>
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
            <Link href={route('chatWithId.index', friend.id)} className="cursor-pointer" key={friend.id}>
                <FriendStatus friend={friend}/>
            </Link>
        ));
    };

    return (
        <AuthenticatedLayout renderChat={false} user={auth.user}
                             header={<Typography variant="h5" className="font-semibold text-white">Your
                                 Profile</Typography>}>
            <Head title="Home"/>
            <Container>
                <Grid container spacing={2} className="bg-white rounded-xl shadow-md">
                    <Grid ref={MessageBoxRef} item xs={8}
                          className="w-full max-h-[90vh] bg-white overflow-auto rounded-xl p-4">
                        <Paper elevation={3} className="p-4">
                            <div className="grid pb-11">
                                {renderMessages()}
                                {isTyping && (
                                    <div className="flex items-center px-3.5 py-2 space-x-1">
                                        <p className="text-xs text-gray-400">{receiver.name} is typing</p>
                                        <div
                                            className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div
                                            className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                        <div
                                            className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                                    </div>
                                )}
                            </div>
                            <Divider/>
                            <div className="w-full pl-3 pr-1 py-1 flex items-center justify-between flex-col">
                                <form onSubmit={handleSubmit} className="flex w-full">
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
