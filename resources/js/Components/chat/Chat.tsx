import React, {forwardRef, useImperativeHandle, useMemo, useState} from 'react';
import {Link, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import {Avatar, Button, IconButton, Slide, Stack} from "@mui/material";
import {CloseRounded} from "@mui/icons-material";
import {useScrollToBottom} from "@/utils";
import {isTypingNotification} from "@/Components/chat/isTypingNotification";
import {renderMessages} from "@/Components/chat/renderMessages";
import MessageSubmitForm from "@/Components/chat/MessageSubmitForm";

const Chat = forwardRef(({open, messages, receiverId, messageSent, close, showName}: any, ref) => {

    const {auth} = usePage<PageProps>().props;
    const [openChat, setOpenChat] = useState(false);
    const [minimized, setMinimized] = useState(true);
    const chatBoxRef = useScrollToBottom([openChat, open, minimized, messages]);
    const [imagePreview, setImagePreview] = useState(null)


    const reversedMessages = useMemo(() => {
        if (messages.length && !messages.receiver) {
            return [...messages].reverse();
        }
        return messages;
    }, [messages]);
    const MessagesRefresh = () => {
        messageSent(receiverId);
    }


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
                className={`rounded bg-gray-800 rounded-t-2xl max-w-2xl text-xs text-white ${showName && 'min-w-72'}  mt-auto `}>
                <Stack direction='row' alignItems='center'>

                    <div className='text-white !h-fit flex justify-between  w-full cursor-pointer'
                         onClick={handleToggleMinimize}>
                        {messages && messages.length > 0 ? (
                            <div className='text-sm font-medium p-3 flex items-center gap-2'>
                                <Avatar className='!w-6 !h-6'
                                        src={`/${messages[0].receiver?.id === auth.user.id ? messages[0].sender.profile_image : messages[0].receiver?.profile_image}`}>
                                </Avatar>
                                {(showName || !minimized) && (messages[0].receiver?.id === auth.user.id ? messages[0].sender.name : messages[0].receiver.name)}
                            </div>
                        ) : (
                            <div className='text-sm font-medium p-3 flex items-center gap-2'>
                                <Avatar className='!w-6 !h-6'
                                        src={messages.receiver.profile_image && '/' + messages.receiver.profile_image}></Avatar>
                                <span>{(showName || !minimized) && messages.receiver.name}</span>
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
                            {messages.length >= 10 ? <Link href={route('chat.user', receiverId)}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    className="!mb-2 !text-xs !font-bold hover:bg-blue-600"
                                    size='small'
                                >
                                    See previous messages...
                                </Button>
                            </Link> : <></>
                            }

                            {reversedMessages && !messages.receiver ? renderMessages(reversedMessages, imagePreview, setImagePreview, true) :
                                <p className='text-center pb-2 text-xs text-gray-400 font-bold'>Be
                                    the
                                    First One to Send a
                                    Message</p>}

                            {isTypingNotification(messages.receiver ?? (messages[0].receiver_id === auth.user.id ? messages[0].sender : messages[0].receiver), MessagesRefresh)}
                        </div>

                        <div className='bg-blue-500 rounded-2xl max-w-80 p-1'>
                            <MessageSubmitForm receiverId={receiverId} callBack={MessagesRefresh} size='small'/>
                        </div>
                    </div>
                </div>
            </div>
        </Slide>


    );
});

export default Chat;
