import {Head, Link, usePage} from '@inertiajs/react';
import PrimaryButton from "@/Components/PrimaryButton";
import macbook from "../../assets/images/macbook.svg"
import LandingTitle from "@/Components/LandingTitle";
import Navbar from "@/Components/Navbar";
import {PageProps} from "@/types";

export default function Welcome() {

    const {auth} = usePage<PageProps>().props;

    return (
        <>
            <Head title="Welcome"/>
            <Navbar/>
            <div className=" h-full">
                <div className="container pt-24 md:pt-36 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                    <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
                        <h1 className="my-4 text-3xl md:text-4xl text-white opacity-75 font-bold leading-tight text-center md:text-left">
                            Connect.
                            <span
                                className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
               Code.Create.
            </span>
                            Welcome to Tawasol for Programmers!

                        </h1>
                        <LandingTitle/>

                        <div className="bg-gray-900 opacity-75 w-full shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">

                            {!auth.user ? (
                                <>
                                    <div className="mb-4">
                                        <h3 className="block text-blue-300 py-2 font-bold mb-2 text-center">
                                            Welcome to Tawasol!
                                        </h3>
                                        <h3 className="block text-blue-300 py-2 mb-2 text-center">
                                            Unlock all benefits by logging in or signing up for free.
                                        </h3>
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
                                        <Link href={route('home')}> <PrimaryButton>Go to home</PrimaryButton></Link>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                    <div className="w-full xl:w-3/5 p-8 overflow-hidden">
                        <img
                            className="mx-auto w-full md:w-4/5 transform -rotate-6 transition hover:scale-105 duration-700 ease-in-out hover:rotate-6"
                            src={macbook} alt='macbook'/>
                    </div>

                </div>
            </div>
        </>
    );
}
