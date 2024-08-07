import {PageProps, User} from "@/types";
import {usePage} from "@inertiajs/react";
import React, {useEffect, useState} from "react";
import axios from "axios";


export const isTypingNotification = (receiver: User, teamID = null, callback?: Function) => {
    const [isTyping, setIsTyping] = useState(false);
    const [typer, setTyper] = useState(null);
    const {auth} = usePage<PageProps>().props;
    useEffect(() => {
        const handleBeforeUnload = () => sendStoppedTyping(receiver.id, teamID);

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);


    useEffect(() => {
        if (teamID) {
            window.Echo.channel(`my-group-chat-${teamID}`)
                .listen('.is-typing-group-chat', (e) => {
                    setIsTyping(e.isTyping);
                    setTyper({
                        id: e.id,
                        name: e.name,
                    });
                })
            ;
        }
        if (callback) {
            window.Echo.channel(`my-messages-${auth.user.id}`)
                .listen('.is-seen', (e) => {
                    callback(receiver.id);

                });
        }
        window.Echo.channel(`my-messages-${auth.user.id}-${receiver?.id}`)
            .listen('.is-typing', (e) => {
                setIsTyping(e.isTyping);
            });
        return () => {
            window.Echo.leaveChannel(`public:my-messages-${auth.user.id}-${receiver?.id}`);
            window.Echo.leaveChannel(`public:my-messages-${auth.user.id}`)
            window.Echo.leaveChannel(`public:my-group-chat-${teamID}`);
        };
    }, [auth.user.id, teamID]);


    return (isTyping && typer?.id != auth.user.id) && <div className="flex items-center px-3.5 py-2 space-x-1">
        <p className="text-xs text-gray-400">{receiver ? receiver.name : typer.name} is
            typing</p>
        <div
            className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
        <div
            className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
        <div
            className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce delay-300"></div>
    </div>;


}


export const sendIsTyping = (receiverId: number | null, teamId: number | null) => {

    if (receiverId) {
        axios.post(route('is-typing', {receiver: receiverId, isTyping: true}));
    }
    if (teamId) {
        axios.post(route('is-typing', {team: teamId, isTyping: true}));
    }


};

export const sendStoppedTyping = (receiverId: number | null, teamId: number | null) => {
    if (receiverId) {
        axios.post(route('is-typing', {receiver: receiverId, isTyping: false}));
    }
    if (teamId) {
        axios.post(route('is-typing', {team: teamId, isTyping: false}));
    }
};

