import {useEffect, useState} from 'react';
import {audio} from "@/utils";
import {usePage} from "@inertiajs/react";
import {Message, PageProps} from "@/types";
import {isTypingNotification} from "@/Components/chat/isTypingNotification";
import axios from "axios";

export const sendMessageSeen = async (msgId: number) => {
    axios.post(route('message.seen', {msgId})).catch(e => console.log(e.message))
}
const ChatChannelListener = (updateMessages: {
    (message?: Message): void
}, updateSeen = null, team = null, receiver = null) => {
    const [isTyping, setIsTyping] = useState(false);
    const [typer, setTyper] = useState(null);
    const {auth} = usePage<PageProps>().props;

    const isBlocked = async (userId: number): Promise<boolean> => {
        try {
            const response = await axios.get(route('friend.is-blocked', {id: userId}));
            return response.data.isBlocked;
        } catch (e) {
            console.error(e.message);
            return false;
        }
    };


    useEffect(() => {
        if (team) {
            window.Echo.channel(`my-group-chat-${team.id}`)
                .listen('.message-sent-group-chat', async (e) => {
                    if (e.message.sender_id != auth.user.id) {
                        if (!await isBlocked(e.message.sender_id)) {
                            updateMessages(e.message)
                            await sendMessageSeen(e.message.id);
                            audio.play().catch((e) => e);
                        }


                    }

                })
                .listen('.is-seen-group-chat', async (e) => {
                    if (!await isBlocked(e.userSeen.id)) {
                        updateSeen(e.userSeen);
                    }
                })
                .listen('.is-typing-group-chat', async (e) => {
                    if (!await isBlocked(e.id)) {
                        setIsTyping(e.isTyping)
                        setTyper({
                            id: e.id,
                            name: e.name,
                        });
                    }
                })
            ;
        }
        if (receiver)
            window.Echo.channel(`my-messages-${auth.user.id}-${receiver.id}`)
                .listen('.message-sent', async (e) => {
                    updateMessages(e.message);
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
            window.Echo.leaveChannel(`my-messages-${auth.user.id}-${receiver?.id}`);
            window.Echo.leaveChannel(`my-group-chat-${team?.id}`);
        };
    }, [auth.user.id, team, receiver]);

    return isTypingNotification(auth, isTyping, receiver, typer, team?.id)

};

export default ChatChannelListener;
