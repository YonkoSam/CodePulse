import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Link, router, useForm} from '@inertiajs/react';
import {PageProps, Profile, Pulse, User} from '@/types';
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import {Avatar, IconButton, Stack, Tooltip} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Block, Circle, PersonAdd} from "@mui/icons-material";
import Swal from "sweetalert2";
import {EditIcon, MessageCircleIcon} from "lucide-react";
import FriendsMenu from "@/Pages/Friends/FriendsMenu";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CreateProfilePrompt from "@/Components/profile/CreateProfilePrompt";
import {buttonStyle, spanStyle, Toast, usePreview} from "@/utils";
import FriendsSection from "@/Components/profile/FriendsSection";
import {BackgroundGradient} from "@/Components/ui/BackgroundGradient";
import PulsesSection from "@/Components/profile/PulsesSection";
import {motion} from 'framer-motion';
import FirstTimeCard from "@/Components/genralComp/FirstTimeCard";
import AboutSection from "@/Components/profile/AboutSection";
import ReactTimeAgo from "react-time-ago";

export default function ProfilePage({
                                        profile,
                                        auth,
                                        friends,
                                        pulses,
                                        isFriend,
                                        isOnline,
                                        lastTimeOnline,
                                        hasProfile
                                    }: PageProps<{
    profile: Profile,
    friends: User[],
    pulses: Pulse[]
}> & {
    isFriend: boolean, isOnline: boolean, hasProfile: boolean, lastTimeOnline: string
}) {

    const [chatToggle, setChatToggle] = useState(null);
    const {preview, selectedFile, onSelectFile, reset} = usePreview();
    const {data, setData, errors, post, progress} = useForm({cover: null});

    useEffect(() => {
        setData('cover', selectedFile)
    }, [selectedFile]);

    const isAuthUser = profile?.user_id === auth.user.id;

    console.log(profile.user)
    const handleFriendRemove = () => {
        Swal.fire({
            title: `Are you sure you want to remove ${profile.user.name} as your friend ?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1e40af",
            cancelButtonColor: "#57534e",
            confirmButtonText: "Yes, im Sure!"
        }).then((result: any) => {
            if (result.isConfirmed) {

                router.delete(route('friend.delete', {'friend': profile.user_id}), {
                    onSuccess: () => {
                        Toast.fire({
                            icon: "success",
                            title: "Friend was deleted Successfully"
                        });
                    },
                    onError: (errors) => {
                        Toast.fire({
                            icon: "error",
                            title: `${errors.message}`
                        });
                    }
                });

            }
        });


    };


    const handleBlock = () => {
        const firstName = profile.user.name.split(' ')[0];
        Swal.fire({
            title: `Block  ${profile.user.name} ?`,
            html: `<div class="text-left">
        <p>Neither of you will be able to:</p>
        <ul class="list-disc list-inside ml-4 mt-2">
            <li>See each other's pulses or comments</li>
            <li>Message each other</li>
            <li>See each other's profiles</li>
        </ul>

        ${isFriend ?
                `<p class="mt-4"> Blocking <strong>${firstName}</strong> will also unfriend him.
                </p> ` : ""}

    </div>
`,

            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1e40af",
            cancelButtonColor: "#57534e",
            confirmButtonText: "Yes, block!"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(route('friend.block', {'friend': profile.user_id}), {
                    onSuccess: () => {
                        Toast.fire({
                            icon: "success",
                            title: "Friend was blocked Successfully"
                        });
                    },
                    onError: (errors) => {
                        Toast.fire({
                            icon: "error",
                            title: `${errors.message}`
                        });
                    }
                });
            }
        });


    };
    const handleFriendRequest = () => {
        router.post(route('friend.request.send'), {'sender_id': auth.user.id, 'receiver_id': profile.user_id}, {
            onSuccess: () => {
                Toast.fire({
                    icon: "success",
                    title: "Friend request Sent Successfully"
                });
            },
            onError: (errors) => {
                Toast.fire({
                    icon: "error",
                    title: `${errors.message}`
                });
            }
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('cover.upload'), {
            onSuccess: () => {
                reset();
            },
            onError: (errors) => {
                Toast.fire({
                    icon: "error",
                    title: `${errors.cover}`
                });
            }
        });

    };


    return (
        <AuthenticatedLayout user={auth.user} callback={chatToggle} title='Profile'
                             header={<h2 className="font-semibold text-xl text-white leading-tight">Profile</h2>}>
            {!hasProfile && <CreateProfilePrompt/>}

            <div
                className='max-w-screen-sm px-6 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl mx-auto'>
                <Stack>
                    {profile ? (
                        <>
                            <motion.div
                                initial={{y: -50, opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3}}
                            >

                                <BackgroundGradient>
                                    <div className='relative  mb-2 bg-black/80 rounded-3xl'>
                                        <div className='relative  border-indigo-500 border-b-2 '>
                                            <img
                                                className='object-cover object-top h-72 w-full  rounded-t-3xl'
                                                src={preview ? preview : profile.cover ? '/' + profile.cover : '/covers/default.avif'}
                                                alt="cover"/>
                                            <form onSubmit={handleSubmit}>
                                                <div className="cursor-pointer absolute top-0  right-0 m-5">

                                                    {
                                                        isAuthUser ? (
                                                            preview ? <Stack direction='row' gap={2}>
                                                                    <PrimaryButton type='submit'>Save</PrimaryButton>
                                                                    <PrimaryButton onClick={() => {
                                                                        reset()
                                                                    }}>Cancel</PrimaryButton>

                                                                </Stack> :
                                                                <label>
                                                                    <div className={`${buttonStyle} cursor-pointer`}>
                                                                        <span className={spanStyle}>Upload Cover</span>
                                                                    </div>
                                                                    <input type="file"
                                                                           accept='image/*'
                                                                           onChange={onSelectFile}
                                                                           className="hidden"/>
                                                                </label>) : (<></>)

                                                    }
                                                </div>

                                            </form>

                                        </div>
                                        <div className='absolute bottom-10 w-full '>


                                            <div className=' p-4 '>
                                                <Avatar sx={{'& .MuiAvatar-img': {objectPosition: 'top'}}}
                                                        className='!w-36 !h-36 !border-4 !border-indigo-500  hover:scale-110 hover:rotate-6 duration-300 ease-in-out'
                                                        src={`/${profile.user.profile_image}`}/>
                                            </div>
                                        </div>
                                        <div
                                            className=' w-full flex flex-col md:flex-row md:justify-between justify-center  rounded-b-xl  '>
                                            <div className='ml-40 text-white '>
                                                <Stack direction='row' gap={1} alignItems='center' paddingTop={2}>
                                                    <h1 className='text-2xl lg:text-4xl font-bold '>{profile.user.name}</h1>
                                                    {isFriend && (
                                                        <Tooltip title={
                                                            <span>
                                                                 <strong>Last time online </strong>
                                                          <ReactTimeAgo
                                                              date={Date.parse(lastTimeOnline)}/>
                                                            </span>

                                                        }>
                                                            <IconButton>
                                                                <Circle
                                                                    className={`text-${isOnline ? 'green' : 'red'}-600 !w-5 !h-5 ${isOnline ? 'animate-pulse' : ''}`}/>

                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Stack>
                                                <Stack direction='row' alignItems='center' gap={1}>
                                                    <p className='text-lg p-2'>{profile.status}</p>
                                                    {isAuthUser && (
                                                        <Link href={route('profiles.edit')}
                                                              className='hover:scale-105'><EditIcon/></Link>
                                                    )}
                                                </Stack>
                                            </div>
                                            {
                                                hasProfile ? <div className='flex gap-2 items-center ml-auto'>
                                                    {!isFriend && !isAuthUser ? (
                                                        <Stack direction={'row'} className="pr-5">
                                                            <IconButton
                                                                className='!text-white !h-fit hover:scale-105 !pr-5'
                                                                onClick={handleFriendRequest}>
                                                                <PersonAdd/>
                                                            </IconButton>
                                                            <IconButton
                                                                className='!text-white !text-xs !px-1 !flex gap-2 '
                                                                onClick={handleBlock}>
                                                                <Block/>
                                                                Block
                                                            </IconButton>
                                                        </Stack>
                                                    ) : (
                                                        !isAuthUser && (
                                                            <Stack direction='row' gap={2} alignItems='center'
                                                                   marginLeft='auto'
                                                                   className='pr-5'>
                                                                <FriendsMenu handleRemove={handleFriendRemove}
                                                                             handleBlock={handleBlock}/>
                                                                <IconButton size='small'
                                                                            onClick={() => setChatToggle(prev => prev === profile.user_id ? null : profile.user_id)}>
                                                                    <MessageCircleIcon color='white'
                                                                                       height='fit-content'
                                                                                       className='hover:scale-105'/></IconButton>
                                                            </Stack>
                                                        )
                                                    )}
                                                </div> : <></>
                                            }

                                        </div>
                                    </div>
                                </BackgroundGradient>

                            </motion.div>
                            <div
                                className="grid gap-8  mt-3 mb-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-[24%,24%,48%]  ">
                                <motion.div
                                    initial={{x: -50, opacity: 0}}
                                    animate={{x: 0, opacity: 1}}
                                    transition={{duration: 0.3, delay: 0.2}}
                                    className="col-span-1 2xl:col-span-1 "
                                >
                                    <BackgroundGradient className="z-50">
                                        <div className="p-4 bg-black/80 shadow-xl shadow-black/30 rounded-3xl">
                                            <AboutSection profile={profile} isAuthUser={isAuthUser}/>
                                        </div>
                                    </BackgroundGradient>
                                </motion.div>
                                <motion.div
                                    initial={{x: 50, opacity: 0}}
                                    animate={{x: 0, opacity: 1}}
                                    transition={{duration: 0.3, delay: 0.1}}
                                    className="col-span-1 2xl:col-span-1  "
                                >
                                    <BackgroundGradient>
                                        <div className='bg-black/80 shadow-xl shadow-black/30 rounded-3xl'>
                                            <FriendsSection friends={friends}/>

                                        </div>
                                    </BackgroundGradient>
                                </motion.div>
                                <motion.div
                                    initial={{y: 50, opacity: 0}}
                                    animate={{y: 0, opacity: 1}}
                                    transition={{duration: 0.3, delay: 0.3}}
                                    className="col-span-1 md:col-span-2 lg:col-span-2 2xl:col-span-1 "
                                >
                                    <BackgroundGradient>
                                        <div className="bg-black/80 shadow-xl shadow-black/30 rounded-3xl">
                                            <PulsesSection pulses={pulses}/>
                                        </div>
                                    </BackgroundGradient>
                                </motion.div>


                            </div>


                        </>
                    ) : (
                        <FirstTimeCard bodyText={"It looks like you don't have a profile yet. Let's create one now!"}>
                            <Link href={route('profiles.create')}><PrimaryButton>Create Profile</PrimaryButton></Link>
                        </FirstTimeCard>
                    )}
                </Stack>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
