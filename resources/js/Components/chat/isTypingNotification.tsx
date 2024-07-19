import {PageProps, User} from "@/types";
import {router, usePage} from "@inertiajs/react";
import React, {useEffect, useState} from "react";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import {echoConfig} from "@/utils";


export const isTypingNotification = (receiver: User, callback?: Function) => {
    const [isTyping, setIsTyping] = useState(false);
    const {auth} = usePage<PageProps>().props;

    useEffect(() => {
        const handleBeforeUnload = () => sendStoppedTyping(receiver.id);

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);


    useEffect(() => {

        window.Pusher = Pusher;
        window.Echo = new Echo(echoConfig);

        if (callback) {
            window.Echo.channel(`my-messages-${auth.user.id}`)
                .listen('.is-seen', (e) => {
                    callback(receiver.id);
                    
                });
        }
        window.Echo.channel(`my-messages-${auth.user.id}-${receiver.id}`)
            .listen('.is-typing', (e) => {
                setIsTyping(e.isTyping);
            });
        return () => {
            window.Echo.leaveChannel(`my-messages-${auth.user.id}-${receiver.id}`);
        };
    }, [auth.user.id]);


    return isTyping ? <div className="flex items-center px-3.5 py-2 space-x-1">
            <p className="text-xs text-gray-400">{receiver?.name} is typing</p>
            <div
                className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
            <div
                className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            <div
                className="h-2.5 w-2.5 bg-gray-400 rounded-full animate-bounce delay-300"></div>
        </div>
        : <> </>;


}

export const sendIsTyping = (receiverId: number) => {

    if (receiverId) {
        router.post(route('is-typing', {receiver: receiverId, isTyping: true}), {}, {
            preserveScroll: true,
            preserveState: true
        });
    }

};

export const sendStoppedTyping = (receiverId: number) => {
    if (receiverId) {
        router.post(route('is-typing', {receiver: receiverId, isTyping: false}), {}, {
            preserveScroll: true,
            preserveState: true
        });
    }
};

