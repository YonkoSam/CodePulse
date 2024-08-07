import {Head, Link, usePage} from '@inertiajs/react';
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import LandingTitle from "@/Components/genralComp/LandingTitle";
import Navbar from "@/Components/genralComp/Navbar";
import {PageProps} from "@/types";
import {AnimatedText} from "@/Components/animatedComp/AnimatedText";
import React from "react";
import {motion} from "framer-motion";
import devAnimation from "../../assets/images/devAnimation.json";
import Lottie from "lottie-react";

export default function Welcome() {


    const {auth} = usePage<PageProps>().props;
    const WelcomeMessage = "<h3>Welcome to CodePulse!</h3>"

    return (
        <div>
            <Head title="Welcome"/>
            <Navbar/>
            <motion.div
                initial={{y: -50, scale: 0}}
                animate={{y: 0, scale: 1}}
                transition={{duration: 0.5, type: 'spring'}}
                exit={{y: -50, scale: 0}}
                className="container h-full relative">
                <div className="pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                    <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
                        <h1 className="my-4 text-3xl md:text-4xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
                            <AnimatedText text={'<h1>Connect.Share,and Code with Pulse!</h1>'}
                                          className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-300 to-purple-700"/>

                        </h1>
                        <LandingTitle/>

                        <div className="bg-gray-900 opacity-75 w-full shadow-lg rounded-2xl px-8 pt-6 pb-8 mb-4">

                            {!auth.user ? (
                                <>
                                    <div className="mb-4 ">
                                        <h3 className="block text-blue-300 py-2 font-bold mb-2 text-center">
                                            {WelcomeMessage}
                                        </h3>
                                        <AnimatedText
                                            text={"<div>Unlock all benefits by logging in or signing up for free.</div>"}
                                            el='h3' className='block text-blue-300 py-2 mb-2 text-center'/>

                                    </div>
                                    <div className="flex items-center justify-center pt-4 space-x-2">
                                        <Link href={route('login')}> <PrimaryButton>Login</PrimaryButton></Link>
                                        <Link href={route('register')}><PrimaryButton>Sign up</PrimaryButton></Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="mb-4">
                                        <h3 className="block text-blue-300 py-2 font-bold mb-2 text-center">
                                            Welcome back {auth.user.name}!
                                        </h3>
                                        <h3 className="block text-blue-300 py-2 mb-2 text-center">
                                            Explore our features and enjoy your stay.
                                        </h3>
                                    </div>
                                    <div className="flex items-center justify-center pt-4 space-x-2">
                                        <Link href={route('home')}> <PrimaryButton>Enter </PrimaryButton></Link>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>

                    <div className="w-full xl:w-3/5 p-8 overflow-hidden">
                        <Lottie animationData={devAnimation}/>
                    </div>

                </div>
            </motion.div>
        </div>
    )
        ;
}
