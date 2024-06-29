import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Link, router, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import {Avatar, IconButton, Slide, Stack, TextField} from "@mui/material";
import {SendIcon} from "lucide-react";
import {CloseRounded} from "@mui/icons-material";
import {useScrollToBottom} from "@/utils";

const Chat = forwardRef(({open, messages, receiverId, messageSent, close}: any, ref) => {

    const [message, setMessage] = useState('');
    const {auth} = usePage<PageProps>().props;
    const [openChat, setOpenChat] = useState(false);
    const [minimized, setMinimized] = useState(true);
    const chatBoxRef = useScrollToBottom([openChat, open, minimized, messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('chat.store'), {message, 'receiver_id': receiverId}, {
            onSuccess: () => {
                setMessage('');
                messageSent(receiverId);

            }
        });
    };

    const handleToggleMinimize = () => {
        setMinimized(!minimized);
    };

    useImperativeHandle(ref, () => ({
        openChat() {
            setMinimized(false);
        }

    }));


    return (
        <Slide direction="up" in={open || openChat} mountOnEnter unmountOnExit>

            <div
                className='rounded bg-white max-w-2xl text-xs text-gray-800 min-w-52 mt-auto'>
                <Stack direction='row' alignItems='center'>

                    <div className='!text-gray-800 !h-fit flex justify-between w-full cursor-pointer'
                         onClick={handleToggleMinimize}>
                        {messages && messages.length > 0 ? (
                            <div className='text-sm font-medium p-3 flex items-center gap-2'>
                                <Avatar className='!w-6 !h-6'
                                        src={`/${messages[0].receiver?.name === auth.user.name ? messages[0].sender.profile_image : messages[0].receiver?.profile_image}`}>
                                </Avatar>
                                {messages[0].receiver?.name === auth.user.name ? messages[0].sender.name : messages[0].receiver.name}
                            </div>
                        ) : (
                            <div className='text-sm font-medium p-3 flex items-center gap-2'>
                                <Avatar className='!w-6 !h-6' src={`/${messages.receiver.profile_image}`}></Avatar>
                                <span>{messages.receiver.name}</span>
                            </div>
                        )}
                        <IconButton onClick={() => close(receiverId)}>
                            <CloseRounded/>
                        </IconButton>
                    </div>
                </Stack>
                <div id="chat-box" ref={chatBoxRef}
                     className={`overflow-y-auto max-h-96   h-fit ${minimized ? '' : 'border-2 p-2'} `}>
                    <div style={{display: minimized ? 'none' : 'block'}}>
                        <div id="chat-box">
                            {messages.length >= 10 ? <Link href={route('chatWithId.index', receiverId)}><span
                                className='text-gray-600 mb-1 font-bold flex justify-center '>more messages ... </span>
                            </Link> : <></>
                            }

                            {messages && !messages.receiver ? messages.map((msg, index) => {
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
                                        <p className={msg.sender_id === auth.user.id ? 'px-3.5 text-blue-500 py-2 bg-gray-100 rounded-3xl rounded-br-none my-2 max-w-52  break-words'
                                            : 'px-3.5 py-2 bg-gray-100 rounded-3xl rounded-tl-none my-2 max-w-52  break-words'}>
                                            {msg.message}
                                        </p>
                                    </div>
                                );
                            }) : null}
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
                            <IconButton type="submit" disabled={message.length <= 0}>
                                <SendIcon/>
                            </IconButton>
                        </form>
                    </div>
                </div>
            </div>
        </Slide>


    );
});

export default Chat;
