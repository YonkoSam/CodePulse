import {useEffect, useState} from "react";


const TITLES = [
    '<p>Unite with fellow coders to share knowledge, solve problems, and create groundbreaking solutions with CodePulse.</p>',
    '<p>Your gateway to limitless coding possibilities. Discover, connect, and excel with CodePulse for Programmers.</p>',
    '<p>Join a thriving community where ideas become innovations. Collaborate, learn, and grow with CodePulse.</p>'
];

export default function LandingTitle() {
    const [titleIndex, setTitleIndex] = useState(0)
    const [fadeIn, setFadeIn] = useState(true)

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        let timout: ReturnType<typeof setTimeout>;
        interval = setInterval(() => {
            setTitleIndex(titleIndex + 1);
            setFadeIn(true);
            timout = setTimeout(() => {
                setFadeIn(false);
            }, 4000)
            if (titleIndex >= TITLES.length - 1) {
                setTitleIndex(0);
            }
        }, 8000)
        timout = setTimeout(() => {
            setFadeIn(false);
        }, 4000)

        return function cleanup() {
            clearInterval(interval);
            clearTimeout(timout);
        }


    }, [titleIndex]);
    return <div className="leading-normal text-gray-400 md:text-2xl mb-8 text-center md:text-left bg-transparent"><p
        className={fadeIn ? 'animate-fadeIn ' : 'animate-fadeOut'}>{TITLES[titleIndex]}</p></div>
}
