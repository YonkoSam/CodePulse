import {useEffect, useRef, useState} from 'react';
import {usePage} from "@inertiajs/react";
import Chat from "@/Components/chat/Chat";
import {PageProps} from "@/types";
import {audio, Toast, useWindowSize} from "@/utils";

const ChatContainer = ({id}) => {
    const [receiverIds, setReceiverIds] = useState(new Set<number>());
    const [friendsChat, setFriendsChat] = useState<Map<number, any>>(new Map());
    const chatBoxRef = useRef<Map<number, any>>(new Map());
    const {auth} = usePage<PageProps>().props;
    const {width} = useWindowSize();

    const getMaxBoxes = () => {
        if (width > 1280) {
            return 5;
        } else if (width > 768) {
            return 3;
        } else {
            return 1;
        }
    };


    useEffect(() => {
        const storedReceiverIds = sessionStorage.getItem('receiverIds');

        if (storedReceiverIds) {
            setReceiverIds(new Set(JSON.parse(storedReceiverIds)));
        }

        if (id) {
            if (friendsChat.size >= getMaxBoxes()) {
                Toast.fire({
                    icon: 'error',
                    title: "You have reached the maximum chat boxes.",
                    text: "Please close an existing one to open a new chat.",
                    width: 500

                });
                return;
            }
            setReceiverIds(prevIds => new Set([...prevIds, id]));
            if (chatBoxRef.current.get(id)) {
                chatBoxRef.current.get(id).openChat();
            }
        }


    }, [id]);

    useEffect(() => {

        const fetchMessagesAndUpdateState = async (id: number) => {
            try {
                const response = await fetch(route('chat.show', {receiverId: id}));
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const result = await response.json();
                setFriendsChat(prevState => {
                    const newState = new Map(prevState);
                    newState.set(id, result.data.reverse());
                    return newState;
                });

            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }

        };

        const fetchDataForAllReceiverIds = async () => {
            await Promise.all(Array.from(receiverIds).map(fetchMessagesAndUpdateState));
        };
        fetchDataForAllReceiverIds();
    }, [receiverIds]);
    const fetchOlderMessages = async (receiverId, page) => {

        try {
            const response = await fetch(route('chat.show', {receiverId, page}));
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            const hasMore = (result.current_page <= result.last_page)
            if (hasMore) {
                return {
                    more: true,
                    data: result.data.reverse(),
                };
            } else
                return {
                    more: false
                };

        } catch (error) {
            console.error('Failed to fetch older messages:', error);
        }
    };

    useEffect(() => {
        window.Echo.channel(`my-messages-${auth.user.id}`)
            .listen('.message-sent', async (e) => {
                if (e.sender) {
                    setReceiverIds(prevIds => new Set([...prevIds, e.sender?.id]));
                    try {
                        audio.play().catch(e => e);
                    } catch (e) {
                        console.error(`Error: ${e}`);
                    }

                    if (chatBoxRef.current) {
                        if (chatBoxRef.current.get(e.sender?.id)) {
                            chatBoxRef.current.get(e.sender?.id).openChat();
                        } else {
                            setTimeout(() => {
                                chatBoxRef.current.get(e.sender?.id)?.openChat();
                            }, 400);
                        }
                    }
                }


            })

        ;

        return () => {
            window.Echo.leaveChannel(`my-messages-${auth.user.id}`);
        };
    }, [auth.user.id]);

    useEffect(() => {
        sessionStorage.setItem('receiverIds', JSON.stringify(Array.from(receiverIds)));
    }, [receiverIds]);


    const close = (id) => {
        setFriendsChat(prevState => {
            const newState = new Map(prevState);
            newState.delete(id);
            return newState;
        });

        setReceiverIds(prevState => {
                const newState = new Set(prevState);
                newState.delete(id);
                return newState;
            }
        )


    }
    return (

        <div className='fixed right-20 bottom-0 flex gap-2 z-50'>
            {
                Array.from(friendsChat).map(([receiverId, messages], index) => (
                    <Chat
                        ref={(el) => (chatBoxRef.current.set(receiverId, el))}
                        key={receiverId}
                        open={true}
                        showName={index > friendsChat.size - 4}
                        messages={messages}
                        receiverId={receiverId}
                        fetchOlderMessages={fetchOlderMessages}
                        close={close}
                    />
                ))
            }
        </div>


    );
};

export default ChatContainer;
