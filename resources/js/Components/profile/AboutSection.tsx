import Slider from "react-slick";
import {Box, Chip, Divider, IconButton, List, ListItem, Stack} from "@mui/material";
import {CodeIcon, Link2Icon} from "lucide-react";
import {Delete, Edit, LocationCity, LocationOn} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {format} from "date-fns";
import React, {ReactNode, useCallback, useState} from "react";
import Swal from "sweetalert2";
import {router} from "@inertiajs/react";
import ProfileCard from "@/Components/profile/ProfileCard";
import {AnimatedText} from "@/Components/animatedComp/AnimatedText";
import {motion} from "framer-motion";
import SpringModal from "@/Components/ui/SpringModal";
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';


const AboutSection = ({profile, isAuthUser}) => {
    const [open, setOpen] = useState(false);
    const [card, setCard] = useState<ReactNode>();

    const settings = {
        dots: true,
        infinite: true,
        arrows: true,
        adaptiveHeight: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };
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

    const handleDelete = (id: number, type: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1e40af",
            cancelButtonColor: "#57534e",
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
        setCard(<ProfileCard type={experience} object={object}/>);
    }, [experience]);

    const openEducation = useCallback((object: object | null) => {
        setOpen(true);
        setCard(<ProfileCard type={education} object={object}/>);
    }, [education]);

    const iconMap = {
        youtube: YouTubeIcon,
        twitter: TwitterIcon,
        facebook: FacebookIcon,
        linkedin: LinkedInIcon,
        instagram: InstagramIcon,
        github: GitHubIcon,
    };


    return <>
        <h1 className='text-xl p-4 font-bold text-white  rounded-t-xl'>About me</h1>
        <Divider className=' !bg-white'/>

        <Slider {...settings}  >

            <List
                className=' rounded-xl text-white   h-[400px] overflow-y-auto'>

                {
                    profile.bio &&
                    <ListItem className='flex gap-2'>
                        <AnimatedText text={profile.bio} once={true}/>
                    </ListItem>
                }
                {
                    profile.website &&
                    <ListItem className='flex gap-2'>
                        <Link2Icon/>
                        <p>{profile.website}</p>
                    </ListItem>
                }
                {
                    profile.country &&
                    <ListItem className='flex gap-2'>
                        <LocationOn/>
                        <p>{profile.country}</p>
                    </ListItem>
                }
                {
                    profile.location &&
                    <ListItem className='flex gap-2'>
                        <LocationCity/>
                        <p>{profile.location}</p>
                    </ListItem>
                }

                <ListItem
                    className='flex flex-wrap gap-2'>
                    <CodeIcon/>
                    {profile.skills.split(',').map((skill, i: number) => (
                        <Chip
                            component={motion.div}
                            initial={{scale: 0, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{duration: 0.3, delay: i * 0.2}}
                            key={i}
                            className='!text-white font-bold hover:scale-105 transition-all duration-300 ease-in-out'
                            label={skill}/>
                    ))}
                </ListItem>
                <ListItem className='flex flex-wrap'>
                    {Object.entries(profile.socials).filter(([key, value]) => value)
                        .map(([key, value]: [string, string], i: number) => {
                            const IconComponent = iconMap[key.toLowerCase()];
                            if (!IconComponent) return null;
                            return <motion.div
                                initial={{x: -50, opacity: 0}}
                                animate={{x: 0, opacity: 1}}
                                transition={{duration: 0.3, delay: i * 0.2}}
                                key={key}
                            >
                                <a href={value} target='_blank' rel='noopener noreferrer'>
                                    <IconButton
                                        className="!text-white !p-2 hover:scale-125 transition-all duration-300">
                                        <IconComponent/>
                                    </IconButton>
                                </a>
                            </motion.div>

                        })
                    }
                </ListItem>
            </List>
            <Box
                className=' rounded-xl text-white     h-[400px] overflow-y-auto'>
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
                className=' rounded-xl text-white    h-[400px] overflow-y-auto'>
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
        <SpringModal setIsOpen={setOpen} isOpen={open}>
            {card}
        </SpringModal>
    </>

}

export default AboutSection;
