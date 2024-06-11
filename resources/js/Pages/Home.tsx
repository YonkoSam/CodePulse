import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router} from '@inertiajs/react';
import {PageProps, Profile} from '@/types';
import PrimaryButton from "@/Components/PrimaryButton";
import ProfileCard from "@/Components/ProfileCard";
import {Container, IconButton, Modal, Stack} from "@mui/material";
import {formatDate} from "date-fns";
import React, {ReactNode, useCallback, useMemo, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import {Circle, Delete, Edit, PersonAdd} from "@mui/icons-material";
import Swal from "sweetalert2";
import {EditIcon, MessageCircleIcon} from "lucide-react";
import Avatar from "../../assets/images/default-avatar.svg"
import FriendsMenu from "@/Components/FriendsMenu";
import Chat from "@/Components/Chat";

export default function Home({profile, auth, isFriend, isOnline, messages}: PageProps<{ profile: Profile }> & {
    isFriend: boolean, isOnline: boolean
}) {

    const experience = {
        title: "Experience",
        firstField: "job_title",
        secondField: "company",
        thirdField: "location",
    }
    const education = {
        title: "Education",
        firstField: "school",
        secondField: "degree",
        thirdField: "fieldofstudy",
    }


    const [open, setOpen] = useState(false);
    const [card, setCard] = useState<ReactNode>();


    const [chatToggle, setChatToggle] = useState(false);

    const isAuthUser = profile?.user_id === auth.user.id;
    const Toast = useMemo(() => Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    }), []);
    const handleDelete = (id: number, type: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(route(`${type}.destroy`, id), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Deleted!",
                            text: `Your ${type} Record has been deleted.`,
                            icon: "success"
                        });
                    },
                    onError: (errors: any) => {
                        console.error(errors);
                    },
                })
            }
        })
    }
    const openExperience = useCallback((object: object | null) => {
        setOpen(true);
        setCard(<ProfileCard type={experience} callback={handleClose} object={object}/>);
    }, [experience]);

    const openEducation = useCallback((object: object | null) => {
        setOpen(true);
        setCard(<ProfileCard type={education} callback={handleClose} object={object}/>);
    }, [education]);

    const handleClose = useCallback(() => setOpen(false), []);

    const handleFriendRemove = () => {
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

    }
    return (
        <AuthenticatedLayout user={auth.user}
                             header={<h2 className="font-semibold text-xl text-white leading-tight">Your Profile</h2>}>
            <Head title="Home"/>
            <Container>
                {profile ? (<>
                    <Stack direction='column' gap={8} alignItems='center'>

                        <div
                            className=" p-8 rounded text-white bg-black/30 min-w-full  shadow-lg flex flex-col sm:flex-row ">

                            <div className="flex items-center mb-6 w-2/3">
                                <img src={profile.user.profile_image ? '/' + profile.user.profile_image : Avatar}
                                     alt="Profile"
                                     className="w-64 h-64 rounded-full mr-4 object-cover object-top"/>
                                <div>
                                    <Stack direction='row' alignItems='center' gap={2}>
                                        <h1 className="text-2xl font-bold">{profile.company}</h1>
                                        {
                                            isFriend ? isOnline ? <Circle className='text-green-600 !w-5 s!h-5'/> :
                                                <Circle className='text-red-600 !w-5 !h-5'/> : <></>
                                        }
                                    </Stack>
                                    <p>Website: <a href={profile.website || '#'} target='_blank'
                                                   className="text-blue-500">{profile.website}</a>
                                    </p>
                                    <p>Country: {profile.country}</p>
                                    <p>Location: {profile.location}</p>
                                    <p>Status: {profile.status}</p>
                                </div>
                            </div>
                            <div className='p-3 w-1/3'>
                                <h2 className="text-xl font-bold mb-2">Skills</h2>
                                <p>{profile.skills}</p>
                                <h2 className="text-xl font-bold mt-4 mb-2">Bio</h2>
                                <p>{profile.bio}</p>

                                <h2 className="text-xl font-bold mb-2">Socials</h2>
                                <div className="flex items-center justify-start mb-6 gap-2">

                                    {Object.entries(profile.socials).filter(([key, value]) => value !== '' && value !== null).map(([key, value]) => (
                                        <div key={key}>
                                            <a href={value} target='_blank'> <i className={`fab fa-${key} fa-2x`}/></a>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            {


                                isAuthUser ? <Link href={route('profiles.edit')}><EditIcon/></Link> :
                                    !isFriend && auth.hasProfile ?
                                        <IconButton className='!text-white !h-fit'
                                                    onClick={handleFriendRequest}><PersonAdd/></IconButton> :
                                        isFriend ? <Stack direction='row' gap={2}>
                                            <FriendsMenu callback={handleFriendRemove}/>
                                            <MessageCircleIcon onClick={() => setChatToggle(!chatToggle)}/>
                                        </Stack> : <> </>

                            }


                        </div>


                        <div
                            className="bg-black/30  p-8 rounded text-white shadow-lg max-w-full w-full grid grid-cols-2 gap-8">

                            <Stack maxWidth='full' gap={2}>
                                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                    <h2 className="text-xl font-bold mt-4 mb-2">Education</h2>

                                    {
                                        isAuthUser ? <IconButton onClick={() => openEducation(null)} size="large"
                                                                 className='!text-white !min-h-fit'>
                                            <AddIcon/></IconButton> : <></>
                                    }


                                </Stack>
                                {profile.educations.map(el =>

                                    <Stack key={el.id} direction='row' justifyContent='space-between'
                                           className='!bg-black/30 !p-4'
                                           borderRadius={2}>
                                        <Stack>
                                            <p className='text-2xl text-white '>Studied
                                                of {el.fieldofstudy} At {el.school}  </p>
                                            <p className='text-md text-white'>From {formatDate(el.from, 'PPP')} {el.to ? 'To ' + formatDate(el.to, 'PPP') : 'To now'}</p>
                                        </Stack>


                                        {
                                            isAuthUser ? <Stack direction='row'>

                                                <IconButton onClick={() => handleDelete(el.id, 'education')}
                                                            size="medium"
                                                            className='!text-white'>
                                                    <Delete/></IconButton>
                                                <IconButton onClick={() => openEducation(el)} size="medium"
                                                            className='!text-white'>
                                                    <Edit/></IconButton>
                                            </Stack> : <></>
                                        }


                                    </Stack>
                                )}
                            </Stack>

                            <Stack maxWidth='full' gap={2}>
                                <Stack direction='row' alignItems='center' justifyContent='space-between'>
                                    <h2 className="text-xl font-bold mt-4 mb-2">Experience</h2>
                                    {
                                        isAuthUser ? <IconButton onClick={() => openExperience(null)} size="large"
                                                                 className='!text-white !min-h-fit'>
                                            <AddIcon/></IconButton> : <></>
                                    }
                                </Stack>


                                {profile.experiences.map(el =>
                                    <Stack key={el.id} direction='row' justifyContent='space-between'
                                           className='!bg-black/30 !p-4'
                                           borderRadius={2}>
                                        <Stack>
                                            <p className='text-2xl text-white'>Worked
                                                as {el.job_title} At {el.location}  </p>
                                            <p className='text-md text-white'>From {formatDate(el.from, 'PPP')} {el.to ? 'To ' + formatDate(el.to, 'PPP') : 'To now'}</p>
                                        </Stack>

                                        {
                                            isAuthUser ? <Stack direction='row'>
                                                <IconButton onClick={() => handleDelete(el.id, 'experience')}
                                                            size="medium"
                                                            className='!text-white'>
                                                    <Delete/></IconButton>
                                                <IconButton onClick={() => openExperience(el)} size="medium"
                                                            className='!text-white'>
                                                    <Edit/></IconButton>
                                            </Stack> : <></>
                                        }

                                    </Stack>
                                )}

                                {
                                    messages ? <Chat open={chatToggle} messages={messages}
                                                     receiverId={profile.user_id}/> : <></>

                                }

                            </Stack>

                        </div>


                        <Modal
                            open={open}
                            onClose={handleClose}
                            className='!z-40 flex justify-center items-center'
                        >
                            <>{card}</>

                        </Modal>


                    </Stack>

                </>) : (<>
                    <div className="flex justify-center items-center">
                        <div className="bg-gray-900 opacity-75  shadow-lg rounded-lg px-8 pt-6 pb-8 my-4">
                            <div className="mb-4">
                                <h3 className="block text-blue-300 py-2 font-bold mb-2 text-center">
                                    It looks like you don't have a profile yet. Let's create one now!
                                </h3>
                                <div className="flex flex-wrap justify-center">
                                    <PrimaryButton><Link href={route('profiles-create')}>Create Profile</Link>
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </>)}

            </Container>
        </AuthenticatedLayout>


    );
}
