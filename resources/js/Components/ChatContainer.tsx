import {useEffect, useRef, useState} from 'react';
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import {usePage} from "@inertiajs/react";
import Chat from "@/Components/Chat";
import {PageProps} from "@/types";
import {audio, echoConfig} from "@/utils";

const ChatContainer = ({id}) => {
    const [receiverIds, setReceiverIds] = useState(new Set<number>());
    const [friendsChat, setFriendsChat] = useState<Map<number, any>>(new Map());
    const chatBoxRef = useRef<Map<number, any>>(new Map());
    const {auth} = usePage<PageProps>().props;

    useEffect(() => {
        const storedReceiverIds = localStorage.getItem('receiverIds');

        if (storedReceiverIds) {
            setReceiverIds(new Set(JSON.parse(storedReceiverIds)));
        }

        if (id) {
            setReceiverIds(prevIds => new Set([...prevIds, id]));
            if (chatBoxRef.current.get(id)) {
                chatBoxRef.current.get(id).openChat();

            }
        }
    }, [id]);


    console.log(chatBoxRef.current);
    useEffect(() => {


        const fetchMessagesAndUpdateState = async (id: number) => {
            try {
                const response = await fetch(`/my-chat/${id}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const result = await response.json();
                setFriendsChat(prevState => {
                    const newState = new Map(prevState);
                    newState.set(id, result);
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

    useEffect(() => {
        window.Pusher = Pusher;
        window.Echo = new Echo(echoConfig);

        window.Echo.channel(`my-messages-${auth.user.id}`)
            .listen('.message-sent', async (e) => {
                setReceiverIds(prevIds => new Set([...prevIds, e.id]));
                await audio.play();

                if (chatBoxRef.current) {
                    if (chatBoxRef.current.get(e.id)) {
                        chatBoxRef.current.get(e.id).openChat();
                    } else {
                        setTimeout(() => {
                            chatBoxRef.current.get(e.id).openChat();
                        }, 100);
                    }
                }

            });

        return () => {
            window.Echo.leaveChannel(`my-messages-${auth.user.id}`);
        };
    }, [auth.user.id]);

    useEffect(() => {
        localStorage.setItem('receiverIds', JSON.stringify(Array.from(receiverIds)));
    }, [receiverIds]);

    const messageSent = async (receiverId: number) => {
        setReceiverIds(prevIds => new Set([...prevIds, receiverId]));
    };

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
        <div className="fixed right-20 bottom-0 flex gap-2 ">
            {friendsChat && Array.from(friendsChat).map(([receiverId, messages]) => (

                <Chat
                    ref={(el) => (chatBoxRef.current.set(receiverId, el))}
                    key={receiverId}
                    open={true}
                    messages={messages}
                    receiverId={receiverId}
                    messageSent={messageSent}
                    close={close}
                />
            ))}
        </div>
    );
};

export default ChatContainer;
