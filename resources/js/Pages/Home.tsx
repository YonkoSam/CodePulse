import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, Link, router, useForm} from '@inertiajs/react';
import {PageProps, Post, Profile, User} from '@/types';
import PrimaryButton from "@/Components/PrimaryButton";
import ProfileCard from "@/Components/ProfileCard";
import {Avatar, Box, Button, Chip, Container, Divider, IconButton, List, ListItem, Modal, Stack} from "@mui/material";
import {format} from "date-fns";
import React, {ReactNode, useCallback, useEffect, useState} from "react";
import AddIcon from '@mui/icons-material/Add';
import {Circle, Delete, Edit, LocationCity, LocationOn, PersonAdd} from "@mui/icons-material";
import Swal from "sweetalert2";
import _ from "lodash";
import {CodeIcon, EditIcon, Link2Icon, MessageCircleIcon} from "lucide-react";
import FriendsMenu from "@/Components/FriendsMenu";
import PostCard from "@/Components/PostCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CreateProfilePrompt from "@/Components/CreateProfilePrompt";
import {buttonStyle, Toast} from "@/utils";

export default function Home({profile, auth, friends, posts, isFriend, isBlocked, isOnline}: PageProps<{
    profile: Profile,
    friends: [User],
    posts: [Post]
}> & {
    isFriend: boolean, isBlocked: boolean, isOnline: boolean
}) {
    const experience = {
        title: "Experience",
        firstField: "job_title",
        secondField: "company",
        thirdField: "location",
    };

    const education = {
        title: "Education",
        firstField: "school",
        secondField: "degree",
        thirdField: "fieldofstudy",
    };

    const [open, setOpen] = useState(false);
    const [card, setCard] = useState<ReactNode>();
    const [chatToggle, setChatToggle] = useState(null);
    const isAuthUser = profile?.user_id === auth.user.id;
    const [selectedFile, setSelectedFile] = useState<File>()
    const [preview, setPreview] = useState<string>(profile?.cover)

    const postSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,

    };
    const settings = {
        dots: true,
        infinite: true,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,

    };


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
                });
            }
        });
    };
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
    };


    const handleFriendBlock = () => {
        router.delete(route('friend.block', {'friend': profile.user_id}), {
            onSuccess: () => {
                Toast.fire({
                    icon: "success",
                    title: "Friend was blocked Successfully"
                });
                router.visit(route('friends.index'));
            },
            onError: (errors) => {
                Toast.fire({
                    icon: "error",
                    title: `${errors.message}`
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
                setSelectedFile(undefined);
            },
            onError: (errors) => {
                Toast.fire({
                    icon: "error",
                    title: `${errors.cover}`
                });
            }
        });

    };
    useEffect((): void => {
        if (!selectedFile) {
            setPreview('')
            return
        }
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl);
    }, [selectedFile])

    const {data, setData, errors, post, progress} = useForm({cover: null});
    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length === 1) {
            const fileType = files[0].type;
            if (!fileType.startsWith('image/')) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Selected file was not an image!",
                });
                setSelectedFile(undefined)
                return
            } else {
                setSelectedFile(files[0])
                setData('cover', files[0]);
            }

        }

    }
    if (isBlocked) {
        return <div className='h-screen bg-black text-center font-bold text-white p-56'>
            <Head title="403"/>
            <h1 className='text-4xl'>403 Access Denied</h1>
            <p className='m-2'>Sorry, you do not have permission to view this profile.</p>
            <Link href={route('home')}><Button variant={"contained"} color='error'>return back</Button></Link>

        </div>;
    }
    return (
        <AuthenticatedLayout user={auth.user} callback={chatToggle} title='Profile'
                             header={<h2 className="font-semibold text-xl text-white leading-tight">Profile</h2>}>
            {auth.hasProfile ? <></> : <CreateProfilePrompt/>}

            <Container maxWidth='xl'>
                <Stack>
                    {profile ? (
                        <>
                            <div className='relative !max-h-96 mb-10 rounded-xl shadow-xl shadow-black/20'>
                                <div className='relative  '>
                                    <img className='object-cover object-top h-72 w-full bg-white/50 '
                                         src={preview ? preview : profile.cover ? '/' + profile.cover : '/covers/default.avif'}
                                         alt="cover"/>
                                    <form onSubmit={handleSubmit}>
                                        <div className="cursor-pointer absolute top-0  right-0 m-5">

                                            {
                                                isAuthUser ? (
                                                    selectedFile ? <Stack direction='row' gap={2}>
                                                            <PrimaryButton type='submit'>Save</PrimaryButton>
                                                            <PrimaryButton onClick={() => {
                                                                setPreview('');
                                                                setSelectedFile(undefined);
                                                            }}>Cancel</PrimaryButton>

                                                        </Stack> :
                                                        <label>
                                            <span
                                                className={`${buttonStyle} cursor-pointer`}>Upload Cover</span>
                                                            <input type="file"
                                                                   accept='image/*'
                                                                   onChange={onSelectFile}
                                                                   className="hidden"/>
                                                        </label>) : (<></>)

                                            }
                                        </div>

                                    </form>

                                </div>
                                <div className='absolute bottom-10 w-full'>
                                    <div className=' p-4 '>
                                        <Avatar sx={{'& .MuiAvatar-img': {objectPosition: 'top'}}}
                                                className='!w-36 !h-36 !border-4 !border-white   shadow-2xl shadow-black hover:scale-110 hover:rotate-6 duration-300 ease-in-out'
                                                src={`/${profile.user.profile_image}`}/>
                                    </div>
                                </div>
                                <div
                                    className='bg-black/30 w-full  flex flex-col md:flex-row md:justify-between justify-center  rounded-xl py-2 '>
                                    <div className='ml-40 text-white '>
                                        <Stack direction='row' alignItems='center' gap={1}>
                                            <h1 className='text-2xl lg:text-4xl font-bold'>{_.startCase(_.toLower(profile.user.name))}</h1>
                                            {isFriend && (
                                                <Circle
                                                    className={`text-${isOnline ? 'green' : 'red'}-600 !w-5 !h-5 ${isOnline ? 'animate-pulse' : ''}`}/>
                                            )}
                                        </Stack>
                                        <Stack direction='row' alignItems='center' gap={1}>
                                            <p className='text-sm lg:text-lg p-2'>{profile.status}</p>
                                            {isAuthUser && (
                                                <Link href={route('profiles.edit')}
                                                      className='hover:scale-105'><EditIcon/></Link>
                                            )}
                                        </Stack>
                                    </div>
                                    {
                                        auth.hasProfile ? <div className='flex gap-2 items-center ml-auto'>
                                            {!isFriend && !isAuthUser ? (
                                                <IconButton className='!text-white !h-fit hover:scale-105'
                                                            onClick={handleFriendRequest}>
                                                    <PersonAdd/>
                                                </IconButton>
                                            ) : (
                                                !isAuthUser && (
                                                    <Stack direction='row' gap={2} alignItems='center'
                                                           marginLeft='auto'>
                                                        <FriendsMenu handleRemove={handleFriendRemove}
                                                                     handleBlock={handleFriendBlock}/>
                                                        <IconButton size='small'
                                                                    onClick={() => setChatToggle(chatToggle === profile.user_id ? null : profile.user_id)}>
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

                            <div className='flex flex-col justify-between gap-6 lg:flex-row mt-6'>
                                <div className='w-full lg:w-1/4 shadow-xl shadow-black'>
                                    <Slider {...settings}>
                                        <List className='bg-black/30 rounded-xl text-white !min-h-96'>
                                            <h1 className='text-xl p-4 font-bold'>About</h1>
                                            <ListItem className='flex gap-2'>
                                                <p>{profile.bio}</p>
                                            </ListItem>
                                            <ListItem className='flex gap-2'>
                                                <Link2Icon/>
                                                <p>{profile.website}</p>
                                            </ListItem>
                                            <ListItem className='flex gap-2'>
                                                <LocationOn/>
                                                <p>{profile.country}</p>
                                            </ListItem>
                                            <ListItem className='flex gap-2'>
                                                <LocationCity/>
                                                <p>{profile.location}</p>
                                            </ListItem>
                                            <ListItem
                                                className='flex flex-wrap gap-2'>
                                                <CodeIcon/>
                                                {profile.skills.split(',').map((skill, i) => (
                                                    <Chip key={i}
                                                          className='!text-white font-bold hover:scale-105 transition-all duration-300 ease-in-out'
                                                          label={skill}/>
                                                ))}
                                            </ListItem>
                                            <ListItem className='flex flex-wrap gap-2'>
                                                {Object.entries(profile.socials).filter(([key, value]) => value).map(([key, value]) => (
                                                    <div key={key}>
                                                        <a href={value} target='_blank' rel='noopener noreferrer'>
                                                            <i className={`fab fa-${key} fa-2x hover:scale-105 transition-all duration-300`}/>
                                                        </a>
                                                    </div>
                                                ))}
                                            </ListItem>
                                        </List>
                                        <Box
                                            className='bg-black/30 rounded-xl text-white !min-h-96'>
                                            <Stack direction='row' alignItems='center' justifyContent='space-between'
                                                   gap={1}>
                                                <h1 className='text-xl p-4 font-bold'>Education</h1>
                                                {isAuthUser && (
                                                    <IconButton onClick={() => openEducation(null)} size="large"
                                                                className='!text-white !min-h-fit'>
                                                        <AddIcon/>
                                                    </IconButton>
                                                )}
                                            </Stack>
                                            {profile.educations.length > 0 ?
                                                profile.educations.map(el => (
                                                    <div key={el.id}>
                                                        <p className='p-4 text-xl'>Studied <span
                                                            className='font-bold'>{el.fieldofstudy} </span> at {el.school}
                                                        </p>
                                                        <p className='px-4 text-sm'>From {format(new Date(el.from), 'PPP')} {el.to ? 'to ' + format(new Date(el.to), 'PPP') : 'to now'}</p>
                                                        {isAuthUser && (
                                                            <Stack direction='row' justifyContent='end'>
                                                                <IconButton
                                                                    onClick={() => handleDelete(el.id, 'education')}
                                                                    size="medium"
                                                                    className='!text-white hover:scale-105'>
                                                                    <Delete/>
                                                                </IconButton>
                                                                <IconButton onClick={() => openEducation(el)}
                                                                            size="medium"
                                                                            className='!text-white hover:scale-105'>
                                                                    <Edit/>
                                                                </IconButton>
                                                            </Stack>
                                                        )}
                                                        <Divider className='!m-3 !bg-white'/>

                                                    </div>
                                                )) : <>    <p className='p-4  text-sm text-center '>No education details
                                                    provided yet.</p>
                                                </>}
                                        </Box>
                                        <Box
                                            className='bg-black/30 rounded-xl text-white !min-h-96 '>
                                            <Stack direction='row' alignItems='center' justifyContent='space-between'
                                                   gap={1}>
                                                <h1 className='text-xl p-4 font-bold'>Experience</h1>
                                                {isAuthUser && (
                                                    <IconButton onClick={() => openExperience(null)} size="large"
                                                                className='!text-white !min-h-fit hover:scale-105'>
                                                        <AddIcon/>
                                                    </IconButton>
                                                )}
                                            </Stack>
                                            {profile.experiences.length > 0 ? profile.experiences.map(el => (
                                                <div key={el.id}>
                                                    <p className='p-4 text-xl'>
                                                        Worked as <span
                                                        className='font-bold'>{el.job_title}</span> at <span
                                                        className='font-bold'> {el.company} </span> in {el.location}
                                                    </p>
                                                    <p className='px-4 text-sm'>From {format(new Date(el.from), 'PPP')} {el.to ? 'to ' + format(new Date(el.to), 'PPP') : 'to now'}</p>
                                                    {isAuthUser && (
                                                        <Stack direction='row' justifyContent='end'>
                                                            <IconButton
                                                                onClick={() => handleDelete(el.id, 'experience')}
                                                                size="medium" className='!text-white hover:scale-105'>
                                                                <Delete/>
                                                            </IconButton>
                                                            <IconButton onClick={() => openExperience(el)} size="medium"
                                                                        className='!text-white hover:scale-105'>
                                                                <Edit/>
                                                            </IconButton>
                                                        </Stack>
                                                    )}
                                                    <Divider className='!m-3 !bg-white'/>

                                                </div>
                                            )) : <p className='p-4  text-sm text-center '>No experiences details
                                                provided yet.</p>

                                            }
                                        </Box>
                                    </Slider>
                                </div>

                                <div
                                    className='flex-1 max-w-screen-md mx-2 bg-black/30 rounded-xl p-3 shadow-xl shadow-black'>
                                    <h1 className='text-xl p-4 font-bold text-white'>Posts</h1>
                                    <Divider className='!mb-2 !bg-white'/>
                                    {
                                        posts.length > 0 ? posts.length == 1 ?
                                                <PostCard post={posts[0]} auth={auth}/>
                                                :
                                                <Slider {...postSettings}>
                                                    {
                                                        posts.map((post: Post) => (
                                                            <div className='mb-4' key={post.id}>
                                                                <PostCard post={post} auth={auth}/>
                                                            </div>
                                                        ))}
                                                </Slider>
                                            :
                                            <div
                                                className="bg-black/30  shadow-lg rounded-xl px-8 pt-6 pb-8 my-4 min-w-[600px]">
                                                <div className="mb-4">
                                                    <h3 className="block text-white py-2 font-bold mb-2 text-center">
                                                        user has no posts yet !
                                                    </h3>
                                                </div>
                                            </div>
                                    }
                                </div>
                                {
                                    <List
                                        className='bg-black/30 rounded-xl text-white !h-fit !pb-5 flex-1 shadow-xl shadow-black/30'>
                                        <h1 className='text-xl p-4 font-bold text-white'>Friends</h1>

                                        {friends.length > 0 ?
                                            <>
                                                {friends.map((friend, i) => (
                                                    <ListItem key={i}
                                                              className='flex gap-2 hover:scale-105  duration-300'>
                                                        <Avatar src={`/${friend.profile_image}`}/>
                                                        <Link href={route('profiles.show', friend.profile.id)}>
                                                            <p>{friend.name}</p>
                                                            <p className='text-xs'>{friend.profile.status}</p>
                                                        </Link>
                                                    </ListItem>
                                                ))}
                                            </> :
                                            <div>
                                                <h3 className="block text-white py-2 text-xs font-bold mb-2 text-center">
                                                    user has no friends yet !
                                                </h3>
                                            </div>
                                        }
                                    </List>
                                }

                            </div>
                            <Modal open={open} onClose={handleClose} className='!z-40 flex justify-center items-center'>
                                <>{card}</>
                            </Modal>
                        </>
                    ) : (
                        <div className="flex justify-center items-center">
                            <div className="bg-gray-900 opacity-75 shadow-lg rounded-lg px-8 pt-6 pb-8 my-4">
                                <div className="mb-4">
                                    <h3 className="block text-blue-300 py-2 font-bold mb-2 text-center">
                                        It looks like you don't have a profile yet. Let's create one now!
                                    </h3>
                                    <div className="flex flex-wrap justify-center">
                                        <PrimaryButton><Link href={route('profiles.create')}>Create
                                            Profile</Link></PrimaryButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Stack>
            </Container>
        </AuthenticatedLayout>
    )
        ;
}
