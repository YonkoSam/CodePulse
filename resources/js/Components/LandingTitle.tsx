import { useEffect, useState} from "react";


const TITLES = ['Unite with fellow coders to share knowledge, solve problems, and create groundbreaking solutions.\n' +
'\n', 'Your gateway to limitless coding possibilities. Discover, connect, and excel with Tawasol for Programmers.\n' +
'\n', 'Join a thriving community where ideas become innovations. Collaborate, learn, and grow with Tawsol.\n' +
'\n'];
export default function  LandingTitle  () {
    const [titleIndex, setTitleIndex] = useState(0)
    const [fadeIn, setFadeIn] = useState(true)

    useEffect(() => {
        let interval : ReturnType<typeof setInterval>;
        let timout: ReturnType<typeof setTimeout> ;
        interval = setInterval(() => {
            setTitleIndex(titleIndex + 1);
            setFadeIn(true);
            timout = setTimeout(() => {
                setFadeIn(false);
            }, 2000)
            if (titleIndex >= TITLES.length - 1) {
                setTitleIndex(0);
            }
        }, 4000)
        timout = setTimeout(() => {
            setFadeIn(false);
        }, 2000)

        return function cleanup() {
            clearInterval(interval);
            clearTimeout(timout);
        }


    },[titleIndex]);
    return <div className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left bg-transparent"><p
        className={fadeIn ? 'animate-fadeIn ' : 'animate-fadeOut'}>{TITLES[titleIndex]}</p></div>
}
