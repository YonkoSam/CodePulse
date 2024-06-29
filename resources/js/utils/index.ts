import audioLocation from "../../assets/audio/notification.mp3"
import {useEffect, useRef} from "react";
import Swal from "sweetalert2";


export const buttonStyle = 'bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out';
export const audio = new Audio(audioLocation);

export const echoConfig = {
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
};
export const useScrollToBottom = (dependency) => {
    const chatBoxRef = useRef(null);
    const observer = useRef(null);
    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight - chatBoxRef.current.clientHeight;

            if (!observer.current) {
                observer.current = new MutationObserver(() => {
                    chatBoxRef.current.scrollBy(0, 10);
                });
                observer.current.observe(chatBoxRef.current, {childList: true});
            }
        }
    }, [dependency]);
    return chatBoxRef;
};

export const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export const inputStyle = "shadow appearance-none  rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out";



