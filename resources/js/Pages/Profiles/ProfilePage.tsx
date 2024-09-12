import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Link, router, useForm, usePage} from '@inertiajs/react';
import {PageProps, Profile, Pulse, User} from '@/types';
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import {Avatar, IconButton, Stack, Tooltip} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Block, Circle, Report} from "@mui/icons-material";
import Swal from "sweetalert2";
import {EditIcon, MessageCircleIcon} from "lucide-react";
import FriendsMenu from "@/Pages/Friends/FriendsMenu";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CreateProfilePrompt from "@/Components/profile/CreateProfilePrompt";
import {buttonStyle, iconStyle, spanStyle, Toast} from "@/utils";
import FriendsSection from "@/Components/profile/FriendsSection";
import {BackgroundGradient} from "@/Components/ui/BackgroundGradient";
import PulsesSection from "@/Components/profile/PulsesSection";
import {motion} from 'framer-motion';
import FirstTimeCard from "@/Components/genralComp/FirstTimeCard";
import AboutSection from "@/Components/profile/AboutSection";
import ReactTimeAgo from "react-time-ago";
import ReportForm from "@/Components/ReportForm";
import ProfileProgressLevel from "@/ProfileProgressLevel";
import CoverImage from "@/Components/profile/Cover";
import {usePreview} from "@/utils/customHooks";
import FriendRequestStatus from "@/Components/FriendRequestStatus";

export default function ProfilePage({
                                        profile,
                                        friends,
                                        pulses,
                                        friendRequest,
                                        isFriend,
                                        isOnline,
                                        hasProfile,
                                        xpActions
                                    }: PageProps<{
    profile: Profile,
    friends: User[],
    pulses: Pulse[],
    friendRequest: { requestId: number, requestStatus: number },
    xpActions: []
}> & {
    isFriend: boolean, isOnline: boolean, hasProfile: boolean
}) {

    const {auth} = usePage<PageProps>().props;

    const [chatToggle, setChatToggle] = useState<number | null>(null);
    const {preview, selectedFile, onSelectFile, reset} = usePreview();
    const [openReportForm, setOpenReportForm] = useState(false);
    const {setData, post} = useForm({cover: null});


    useEffect(() => {
        setData('cover', selectedFile)
    }, [selectedFile]);

    const isAuthUser = profile?.user_id === auth.user.id;

    const handleFriendRemove = () => {
        Swal.fire({
            title: `Are you sure you want to remove ${profile.user.name} as your CodeMates ?`,
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
        <AuthenticatedLayout user={auth.user} chatToggle={chatToggle} title='Profile'
                             header={<h2 className="font-semibold text-xl text-white leading-tight">Profile</h2>}>
            {!hasProfile && <CreateProfilePrompt/>}

            <ReportForm reportableId={profile?.id} setOpen={setOpenReportForm} open={openReportForm}
                        reportableType='App\Models\Profile'/>
            <div className='mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 w-full'>
                <div
                    className='w-full mx-auto'>
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

                                                <CoverImage cover={profile.cover} preview={preview}/>
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
                                                                        <div
                                                                            className={`${buttonStyle} cursor-pointer`}>
                                                                            <span
                                                                                className={spanStyle}>Upload Cover</span>
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
                                                                    {profile.user.last_activity ? <ReactTimeAgo
                                                                        date={Date.parse(profile.user.last_activity)}/> : 'Not available'}
                                                            </span>

                                                            }>
                                                                <IconButton
                                                                    aria-label={`User is ${isOnline ? 'online' : 'offline'}`}>
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

                                                <div className='flex gap-2 items-center px-5 ml-auto'>
                                                    {!isAuthUser && (
                                                        <>

                                                            {!isFriend ? (
                                                                <>
                                                                    <FriendRequestStatus friendRequest={friendRequest}
                                                                                         userId={profile.user_id}/>
                                                                    <Tooltip title="Block this user">
                                                                        <IconButton
                                                                            className={iconStyle}
                                                                            onClick={handleBlock}
                                                                            aria-label="Block user"
                                                                        >
                                                                            <Block className={iconStyle}/>
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FriendsMenu handleRemove={handleFriendRemove}
                                                                                 handleBlock={handleBlock}/>
                                                                    <IconButton
                                                                        onClick={() => setChatToggle(prev => prev === profile.user_id ? null : profile.user_id)}
                                                                        className={iconStyle}
                                                                        aria-label="Send message"
                                                                    >
                                                                        <MessageCircleIcon className={iconStyle}/>
                                                                    </IconButton>
                                                                </>


                                                            )}


                                                            <Tooltip title="Report this profile">
                                                                <IconButton onClick={() => setOpenReportForm(true)}
                                                                            aria-label="Report profile">
                                                                    <Report className={iconStyle}/>
                                                                </IconButton>
                                                            </Tooltip>
                                                        </>

                                                    )}

                                                </div>

                                            </div>
                                        </div>
                                    </BackgroundGradient>
                                    <div className='mt-6'>

                                        <BackgroundGradient>

                                            <ProfileProgressLevel xp={profile.xp} xpActions={xpActions}/>

                                        </BackgroundGradient>

                                    </div>

                                </motion.div>
                                <div
                                    className="grid gap-8 mt-3 mb-12 grid-cols-1 lg:grid-cols-2  xl:grid-cols-2 2xl:grid-cols-4"
                                >
                                    <motion.div
                                        initial={{x: -50, opacity: 0}}
                                        animate={{x: 0, opacity: 1}}
                                        transition={{duration: 0.3, delay: 0.2}}
                                        className="col-span-1 lg:col-span-1 xl:col-span-1"
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
                                        className="col-span-1 lg:col-span-1 xl:col-span-1"
                                    >
                                        <BackgroundGradient>
                                            <div className="bg-black/80 shadow-xl shadow-black/30 rounded-3xl">
                                                <FriendsSection friends={friends}/>
                                            </div>
                                        </BackgroundGradient>
                                    </motion.div>

                                    <motion.div
                                        initial={{y: 50, opacity: 0}}
                                        animate={{y: 0, opacity: 1}}
                                        transition={{duration: 0.3, delay: 0.3}}
                                        className="col-span-1 sm:col-span-2 lg:col-span-2 xl:col-span-2"
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
                            <FirstTimeCard
                                bodyText={"It looks like you don't have a profile yet. Let's create one now!"}>
                                <Link href={route('profiles.create')}><PrimaryButton>Create
                                    Profile</PrimaryButton></Link>
                            </FirstTimeCard>
                        )}
                    </Stack>
                </div>
            </div>
        </AuthenticatedLayout>
    )
        ;
}
