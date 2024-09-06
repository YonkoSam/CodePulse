import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {usePage} from "@inertiajs/react";
import {Message, PageProps, User} from "@/types";
import {Avatar, CircularProgress, IconButton, Slide, Stack} from "@mui/material";
import {CloseRounded} from "@mui/icons-material";
import {isTypingNotification} from "@/Components/chat/isTypingNotification";
import {renderMessages} from "@/Components/chat/renderMessages";
import {ArrowDown} from "lucide-react";
import {motion} from 'framer-motion';
import MessageSubmitForm from "@/Components/chat/MessageSubmitForm";
import {audio} from "@/utils";
import {sendMessageSeen} from "@/Components/ChatChannelListener";
import {format} from "date-fns";


const Chat = forwardRef(({open, messages: initialMessages, receiverId, close, showName, fetchOlderMessages}: {
    open: boolean;
    messages: Message[] | {
        receiver: User
    };
    receiverId: number;
    close: Function;
    showName: boolean;
    fetchOlderMessages: Function;

}, ref) => {
    const {auth} = usePage<PageProps>().props;
    const [minimized, setMinimized] = useState(true);
    const [imagePreview, setImagePreview] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const endRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(2)
    const [isLoading, setIsLoading] = useState(false);
    const [showScrollDownArrow, setShowScrollDownArrow] = useState(false)
    const topRef = useRef(null);
    const chatBoxRef = useRef(null);
    const [hasMore, setHasMore] = useState(true);
    const [messages, setMessages] = useState(initialMessages);
    const [isUserScrolling, setIsUserScrolling] = useState(false);

    useEffect(() => {
        window.Echo.channel(`my-messages-${auth.user.id}-${receiverId}`)
            .listen('.message-sent', async (e) => {
                messageUpdate(e.message);
                if (e.message.sender_id != auth.user.id) {
                    await sendMessageSeen(e.message.id);
                }
                try {
                    await audio.play();
                } catch (e) {
                    console.error(`Error: ${e}`);
                }
            })
            .listen('.is-seen', () => {
                updateSeen();
            })
            .listen('.is-typing', (e) => {
                setIsTyping(e.isTyping)
            });

        return () => {
            window.Echo.leaveChannel(`my-messages-${auth.user.id}-${receiverId}`);
        };
    }, [auth.user.id, receiverId]);

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({behavior: "smooth"});
    }

    const messageUpdate = (message: Message) => {
        //  setIsUserScrolling(false) here so it will scroll to the bottom when a new message is received
        setIsUserScrolling(false);
        setMessages(prev => Array.isArray(prev) ? [...prev, message] : [message]);
    };

    useEffect(() => {
        if (isUserScrolling) return;
        scrollToBottom();
    }, [open, minimized, messages]);
    const updateSeen = () => {
        setMessages(prevState => Array.isArray(prevState) &&
            prevState.map(msg =>
                !msg.seen_at
                    ? {...msg, seen_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                    : msg
            )
        );
    }
    const onDelete = (msgId) => {
        setMessages(prevState => Array.isArray(prevState) &&
            prevState.filter(msg => msg.id != msgId)
        );
    };

    const handleToggleMinimize = () => {
        setMinimized(!minimized);
    };

    useImperativeHandle(ref, () => ({
        openChat() {
            setMinimized(false);
        }
    }));

    useEffect(() => {
        const chatBox = chatBoxRef.current;
        const options = {
            root: chatBox,
            rootMargin: '0px',
            threshold: 1.0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !isLoading && hasMore) {
                    loadOlderMessages();
                }
            });
        }, options);

        if (topRef.current) {
            observer.observe(topRef.current);
        }


        return () => {
            if (topRef.current) {
                observer.unobserve(topRef.current);
            }
        };

    }, [isLoading]);

    const handleScroll = (e) => {
        const {scrollTop, scrollHeight, clientHeight} = e.target;
        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
        setShowScrollDownArrow(distanceFromBottom > 300);
        setIsUserScrolling(distanceFromBottom > 1000);

    }
    const loadOlderMessages = async () => {
        if (!fetchOlderMessages) return;
        setIsLoading(true);
        const {more, data} = await fetchOlderMessages(receiverId, currentPage);

        setHasMore(more);
        setCurrentPage(prevState => prevState + 1);

        if (more && data.length > 0) {
            setMessages(prev => Array.isArray(prev) ? [...data, ...prev] : [...data]);
        }

        const scrollHeight = chatBoxRef.current.scrollHeight;
        setTimeout(() => {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight - scrollHeight;
        }, 0);

        setIsLoading(false);
    };


    return (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
            <div
                className={`rounded bg-gray-800 rounded-t-2xl max-w-2xl text-xs text-white ${showName && 'min-w-72'} mt-auto `}>
                <Stack direction='row' alignItems='center'>
                    <div className='text-white !h-fit flex justify-between w-full cursor-pointer'
                         onClick={handleToggleMinimize}>
                        <div
                            className='text-sm font-medium p-3 flex items-center gap-2 border-white/30 border-b-2 w-full'>
                            {Array.isArray(messages) && messages.length > 0 ? (
                                <>
                                    <Avatar className='!w-6 !h-6'
                                            src={`/${messages[0].receiver?.id === auth.user.id ? messages[0].sender.profile_image : messages[0].receiver?.profile_image}`}>
                                    </Avatar>
                                    {(showName || !minimized) && (messages[0].receiver?.id === auth.user.id ? messages[0].sender.name : messages[0].receiver.name)}
                                </>) : (

                                !Array.isArray(messages) && <> <Avatar className='!w-6 !h-6'
                                                                       src={messages.receiver?.profile_image && '/' + messages.receiver?.profile_image}></Avatar>
                                    <span>{(showName || !minimized) && messages.receiver?.name}</span></>


                            )}
                        </div>

                        <IconButton onClick={() => close(receiverId)}>
                            <CloseRounded/>
                        </IconButton>
                    </div>
                </Stack>
                <div id="chat-box" ref={chatBoxRef}
                     onScroll={handleScroll}
                     className={`overflow-y-auto max-h-96 h-fit `}
                >


                    <div style={{display: minimized ? 'none' : 'block'}}>
                        <div className='relative px-2'>
                            {showScrollDownArrow && (
                                <motion.button
                                    className='fixed bottom-20 z-50 p-2 ml-2 hover:bg-blue-500 rounded-full'
                                    onClick={scrollToBottom}
                                    animate={{y: [0, 10, 0]}}
                                    transition={{repeat: Infinity, duration: 1}}
                                >
                                    <ArrowDown/>
                                </motion.button>
                            )}

                            {Array.isArray(messages) ? (
                                <>
                                    {isLoading && (
                                        <span className='flex py-2 items-start justify-center'>
                    <CircularProgress className='!text-gray-200' size={20}/>
                </span>
                                    )}
                                    <div ref={topRef} className='h-1'></div>
                                    {renderMessages(auth, messages, imagePreview, setImagePreview, onDelete, true)}
                                </>
                            ) : (
                                <p className='text-center pb-2 text-xs text-gray-400 font-bold'>
                                    Be the First One to Send a Message
                                </p>
                            )}

                            {isTypingNotification(
                                auth,
                                isTyping,
                                (Array.isArray(messages) ? (messages[0].receiver_id === auth.user.id ? messages[0].sender : messages[0].receiver) : messages?.receiver)
                            )}
                        </div>
                        <div ref={endRef}></div>
                    </div>
                </div>
                {
                    !minimized && <div className='border-white/30 border-t-2 max-w-80 p-1'>
                        <MessageSubmitForm receiverId={receiverId} updateMessages={messageUpdate} size='small'/>
                    </div>
                }

            </div>
        </Slide>
    );
});

export default Chat;
