import React, {useEffect, useState} from 'react';
import {User} from "@/types";
import Sidebar from "@/Components/genralComp/Sidebar";
import {audio} from "@/utils";

const UnreadMessageCountUpdater = ({user}: { user: User }) => {


    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchUnreadMessagesCount();
    }, []);

    const fetchUnreadMessagesCount = async () => {
        try {
            const response = await fetch(route('message.unread-count'));
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const {unreadCount} = await response.json();
            setUnreadCount(unreadCount)
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    }

    useEffect(() => {
        window.Echo.channel(`my-messages-${user.id}`)
            .listen('.message-sent', async (e) => {
                setUnreadCount(prevState => prevState + 1);
                audio.play().catch(e => 'playback error');
            })

        return () => {
            window.Echo.leaveChannel(`public:my-messages-${user.id}`);
        };
    }, [user.id]);

    return (
        <Sidebar unreadCount={unreadCount}/>
    );
};

export default UnreadMessageCountUpdater;
