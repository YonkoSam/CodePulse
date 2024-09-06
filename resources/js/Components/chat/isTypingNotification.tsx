import {User} from "@/types";
import React, {useEffect} from "react";
import axios from "axios";


export const isTypingNotification = (auth, isTyping, receiver: User, typer = null, teamID = null) => {


    useEffect(() => {
        const handleBeforeUnload = () => sendStoppedTyping(receiver.id, teamID);

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);


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

