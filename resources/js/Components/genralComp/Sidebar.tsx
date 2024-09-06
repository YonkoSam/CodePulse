import {Link, usePage} from "@inertiajs/react";
import {Badge} from "@mui/material";
import React, {useState} from "react";
import {Groups2, Leaderboard, MessageSharp, Person, Terminal} from "@mui/icons-material";
import Logo from "@/Components/genralComp/Logo";
import {Activity} from "lucide-react";
import {motion} from "framer-motion";
import {BACKGROUND_GRADIENT, useWindowSize} from "@/utils";
import AnimatedHamburgerButton from "@/Components/animatedComp/AnimatedHamburgerButton";

const Sidebar = ({unreadCount}: { unreadCount: number }) => {
    const {url} = usePage();
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const {width} = useWindowSize();
    const linkVariants = {
        initial: {scale: 1},
        hover: {scale: 1.05, transition: {duration: 0.3}},
        active: {scale: 1.1, backgroundColor: '#ffffff', color: '#4a5568', transition: {duration: 0.3}},
    };

    return <>
        {(width >= 1024 || showingNavigationDropdown) &&
            <motion.div
                initial={{opacity: showingNavigationDropdown ? 0 : 1, x: showingNavigationDropdown ? -50 : 0}}
                animate={{opacity: 1, x: 0}}
                transition={{type: 'spring'}}
                className={`flex min-h-full ${width <= 786 && 'absolute z-[1060]'} `}>
                <div className="flex flex-col w-64">
                    <div className="flex flex-col flex-1 overflow-y-auto">
                        <nav
                            className={`flex flex-col flex-1 overflow-y-auto ${BACKGROUND_GRADIENT} px-4 py-6 gap-6`}
                        >
                            <div className='flex justify-center mb-8'>
                                <Logo height='70' isGradient={false}/>
                            </div>
                            <div className="flex flex-col flex-1 gap-4">
                                <motion.div
                                    variants={linkVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    className={`flex items-center gap-3 px-4 py-2 rounded-xl ${url === '/my-profile' ? 'bg-white text-gray-600' : 'text-gray-100 hover:bg-gray-400 hover:bg-opacity-25'}`}
                                >
                                    <Person/>
                                    <Link href={route('home')}>My Profile</Link>
                                </motion.div>
                                <motion.div
                                    variants={linkVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    className={`flex items-center gap-3 px-4 py-2 rounded-xl ${url === '/profiles' ? 'bg-white text-gray-600' : 'text-gray-100 hover:bg-gray-400 hover:bg-opacity-25'}`}
                                >
                                    <Groups2/>
                                    <Link href={route('profiles.index')}>Developers</Link>
                                </motion.div>
                                <motion.div
                                    variants={linkVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    className={`flex items-center gap-3 px-4 py-2 rounded-xl ${url.startsWith('/pulses') ? 'bg-white text-gray-600' : 'text-gray-100 hover:bg-gray-400 hover:bg-opacity-25'}`}
                                >
                                    <Activity className='animate-pulse'/>
                                    <Link href={route('pulses.index')}>Pulses Feed</Link>
                                </motion.div>
                                <motion.div
                                    variants={linkVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    className={`flex items-center gap-1 px-4 py-2 rounded-xl ${url === '/code-mates' ? 'bg-white text-gray-600' : 'text-gray-100 hover:bg-gray-400 hover:bg-opacity-25'}`}
                                >
                                    <svg width="24" height="24" viewBox="0 0 32 32" className="mr-2">
                                        <path fill="currentColor"
                                              d="M21.053 20.8c-1.132-.453-1.584-1.698-1.584-1.698s-.51.282-.51-.51s.51.51 1.02-2.548c0 0 1.413-.397 1.13-3.68h-.34s.85-3.51 0-4.7c-.85-1.188-1.188-1.98-3.057-2.547s-1.188-.454-2.547-.396c-1.36.058-2.492.793-2.492 1.19c0 0-.85.056-1.188.396c-.34.34-.906 1.924-.906 2.32s.283 3.06.566 3.625l-.337.114c-.284 3.283 1.13 3.68 1.13 3.68c.51 3.058 1.02 1.756 1.02 2.548s-.51.51-.51.51s-.452 1.245-1.584 1.698c-1.132.452-7.416 2.886-7.927 3.396c-.512.51-.454 2.888-.454 2.888H29.43s.06-2.377-.452-2.888c-.51-.51-6.795-2.944-7.927-3.396zm-12.47-.172c-.1-.18-.148-.31-.148-.31s-.432.24-.432-.432s.432.432.864-2.16c0 0 1.2-.335.96-3.118h-.29s.144-.59.238-1.334a10.01 10.01 0 0 1 .037-.996l.038-.426c-.02-.492-.107-.94-.312-1.226c-.72-1.007-1.008-1.68-2.59-2.16c-1.584-.48-1.01-.384-2.16-.335c-1.152.05-2.112.672-2.112 1.01c0 0-.72.047-1.008.335c-.27.27-.705 1.462-.757 1.885v.28c.048.654.26 2.45.47 2.873l-.286.096c-.24 2.782.96 3.118.96 3.118c.43 2.59.863 1.488.863 2.16s-.432.43-.432.43s-.383 1.058-1.343 1.44l-.232.092v5.234h.575c-.03-1.278.077-2.927.746-3.594c.357-.355 1.524-.94 6.353-2.862zm22.33-9.056c-.04-.378-.127-.715-.292-.946c-.718-1.008-1.007-1.68-2.59-2.16c-1.583-.48-1.007-.384-2.16-.335c-1.15.05-2.11.672-2.11 1.01c0 0-.72.047-1.008.335c-.27.272-.71 1.472-.758 1.89h.033l.08.914c.02.23.022.435.027.644c.09.666.21 1.35.33 1.59l-.286.095c-.24 2.782.96 3.118.96 3.118c.432 2.59.863 1.488.863 2.16s-.43.43-.43.43s-.054.143-.164.34c4.816 1.898 5.92 2.384 6.303 2.617c.267.147.397.313.46.44v-5.474c-.95-.38-1.338-1.443-1.338-1.443s-.432.24-.432-.43s.43.43.863-2.16c0 0 1.2-.335.96-3.118l-.29.1z"/>
                                    </svg>
                                    <Link href={route('friends.index')}>CodeMates</Link>
                                </motion.div>
                                <motion.div
                                    variants={linkVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    className={`flex items-center   rounded-xl ${url.startsWith('/chat') ? 'bg-white text-gray-600' : 'text-gray-100 hover:bg-gray-400 hover:bg-opacity-25'}`}
                                >
                                    <Badge
                                        className='items-center px-4 gap-2 py-2 '
                                        color="error"
                                        badgeContent={unreadCount}
                                        overlap="circular"
                                    >
                                        <MessageSharp/>
                                    </Badge>
                                    <Link href={route('chat.index')}>Messages</Link>
                                </motion.div>

                                <motion.div
                                    variants={linkVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    className={`flex items-center gap-3 px-4 py-2 rounded-xl ${url === '/testing-ground' ? 'bg-white text-gray-600' : 'text-gray-100 hover:bg-gray-400 hover:bg-opacity-25'}`}
                                >
                                    <Terminal/>
                                    <Link href={route('testing-ground')}>Testing Ground</Link>
                                </motion.div>

                                <motion.div
                                    variants={linkVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    className={`flex items-center gap-3 px-4 py-2 rounded-xl ${url === '/leader-board' ? 'bg-white text-gray-600' : 'text-gray-100 hover:bg-gray-400 hover:bg-opacity-25'}`}
                                >
                                    <Leaderboard/>
                                    <Link href={route('leader-board')}>Leaderboard</Link>
                                </motion.div>
                            </div>
                        </nav>
                    </div>
                </div>
            </motion.div>}
        {width < 1024 && (
            <div className={`absolute ${showingNavigationDropdown ? 'right-5' : 'left-1'} top-[20px] z-[100] `}>
                <AnimatedHamburgerButton size='medium'
                                         onClick={() => setShowingNavigationDropdown(prevState => !prevState)}/>
            </div>)}
    </>

};

export default Sidebar;
