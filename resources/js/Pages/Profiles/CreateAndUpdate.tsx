import React, {FormEventHandler, useEffect, useState} from 'react';
import {Link, router, useForm, usePage} from "@inertiajs/react";
import {buttonStyle, inputStyle, spanStyle, usePreview} from "@/utils";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {PageProps, Profile} from "@/types";
import InputError from "@/Components/formComp/InputError";
import TextInput from "@/Components/formComp/TextInput";
import InputLabel from "@/Components/formComp/InputLabel";
import {Avatar, MenuItem, Select} from "@mui/material";
import SkillInput from "@/Components/formComp/SkillInput";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import {YouTube} from "@mui/icons-material";
import GitHubIcon from "@mui/icons-material/GitHub";


export default function createAndUpdate({profile, hasProfile}: { profile: Profile, hasProfile: boolean }) {


    const {auth} = usePage<PageProps>().props;
    const [skill, setSkill] = useState(profile ? profile.skills.split(',') : []);
    const {preview, selectedFile, onSelectFile} = usePreview();
    const [characterCount, setCharacterCount] = useState(profile?.bio.length)
    const [displaySocialInputs, toggleSocialInputs] = useState(false)

    const {url} = usePage();
    if (hasProfile && url === '/create-profile') {
        router.visit(route('profiles.edit'));
    }


    const handleCharacterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCharacterCount(event.target.value.length);
        setData(
            {
                ...data,
                [event.target.name]: event.target.value,
            }
        )
    };

    useEffect(() => {
        setData('profile_image', selectedFile)
    }, [selectedFile]);

    interface InitialValues {
        company: string;
        profile_image: File | null;
        website: string;
        location: string;
        country: string;
        status: string;
        bio: string;
        skills: string;
        twitter: string;
        facebook: string;
        linkedin: string;
        youtube: string;
        instagram: string;
        github: string;
    }


    const getInitialValues = (auth: any): InitialValues => {
        return profile
            ? {
                company: profile.company || "",
                profile_image: auth.user.profile_image || null,
                website: profile.website || "",
                location: profile.location || "",
                country: profile.country || "",
                status: profile.status || "",
                bio: profile.bio || "",
                skills: profile.skills || "",
                twitter: profile.socials.twitter || "",
                facebook: profile.socials.facebook || "",
                linkedin: profile.socials.linkedin || "",
                youtube: profile.socials.youtube || "",
                instagram: profile.socials.instagram || "",
                github: profile.socials.github || "",
            }
            : {
                company: "",
                profile_image: null,
                website: "",
                location: "",
                country: "",
                status: "",
                skills: "",
                bio: "",
                twitter: "",
                facebook: "",
                linkedin: "",
                youtube: "",
                instagram: "",
                github: "",
            };
    };

    const initialValues: InitialValues = getInitialValues(auth);


    const {data, setData, errors, post, progress} = useForm(initialValues);

    const {
        company,
        profile_image,
        website,
        location,
        country,
        status,
        bio,
        twitter,
        skills,
        facebook,
        linkedin,
        youtube,
        instagram,
        github
    } = data;

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profiles.store'));
    };


    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData(
            {
                ...data,
                [e.target.name]: e.target.value,
            }
        )
    }


    return (
        <AuthenticatedLayout user={auth.user} title={profile ? 'Update Your Profile' : 'Create Your Profile'}
                             header={<h2
                                 className="font-semibold text-xl text-white leading-tight">{!profile ? 'Create  Profile' : 'Update  Profile'}</h2>}>
            <div>
            </div>
            <div
                className=" min-h-screen flex  justify-center bg-center min-w-full py-12 px-4 sm:px-6 lg:px-8    relative items-center">
                <div className="max-w-2xl w-full space-y-8 p-10 rounded-lg shadow bg-black/30">
                    <div className="grid gap-8 grid-cols-1">
                        <div className="flex flex-col">
                            <div className="flex flex-col sm:flex-row items-center">
                                <h2 className="font-semibold text-lg mr-auto text-white">Profile Info</h2>
                            </div>
                            <div className="mt-5">
                                <form onSubmit={onSubmit}>
                                    <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                                        <div className='w-full flex flex-col mb-3'>
                                            <label className="font-semibold text-white py-2">Profile Image</label>
                                            <div className="flex items-center">
                                                <div
                                                    className="w-32 h-32 mr-4 flex-none rounded-xl object-cover overflow-hidden">
                                                    {auth.user.profile_image && !selectedFile ? (
                                                            <img src={auth.user.profile_image}
                                                                 alt='preview'/>) :
                                                        <Avatar className='!w-32 !h-32' src={preview}/>}
                                                </div>
                                                <label className="cursor-pointer">
                                                    <div className={buttonStyle}>
                                                         <span className={spanStyle}
                                                         >Browse</span>
                                                    </div>

                                                    <input type="file"
                                                           onChange={onSelectFile}
                                                           accept='image/*'
                                                           className="hidden"/>

                                                </label>

                                            </div>
                                            <InputError message={errors.profile_image} className="mt-2"/>

                                        </div>

                                        <div className="w-full flex flex-col mb-3 ">
                                            <div className="mb-3 space-y-2 w-full text-xs">
                                                <InputLabel>Skills</InputLabel>
                                                <SkillInput setSkills={setSkill} skills={skill}
                                                            onSkillsChange={(skills) => setData('skills', skills)}/>
                                                <InputError message={errors.skills} className="mt-2"/>

                                            </div>
                                            <InputLabel>Status<abbr
                                                title="required">*</abbr></InputLabel>
                                            <div>
                                                <Select
                                                    variant="standard"
                                                    className='!text-white !p-2'
                                                    autoWidth
                                                    required
                                                    name="status"
                                                    value={status || "default"}
                                                    onChange={e => setData('status', e.target.value)}
                                                >
                                                    <MenuItem disabled value="default"><em>Selected Professional
                                                        Status</em></MenuItem>
                                                    <MenuItem value="Developer">Developer</MenuItem>
                                                    <MenuItem value="Junior Developer">Junior Developer</MenuItem>
                                                    <MenuItem value="Senior Developer">Senior Developer</MenuItem>
                                                    <MenuItem value="Manager">Manager</MenuItem>
                                                    <MenuItem value="Senior Manager">Senior Manager</MenuItem>
                                                    <MenuItem value="Team Lead">Team Lead</MenuItem>
                                                    <MenuItem value="Intern">Intern</MenuItem>
                                                    <MenuItem value="Consultant">Consultant</MenuItem>
                                                    <MenuItem value="Student">Student</MenuItem>
                                                </Select>
                                                <InputError message={errors.status} className="mt-2"/>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:flex flex-row md:space-x-4 w-full text-xs">
                                        <div className="mb-3 space-y-2 w-full text-xs">
                                            <InputLabel>Company Name</InputLabel>
                                            <TextInput placeholder="Company Name"
                                                       type="text"
                                                       name="company"
                                                       value={company}
                                                       onChange={onChange}
                                            />
                                        </div>

                                    </div>
                                    <div className="mb-3 space-y-2 min-w-full text-xs">
                                        <InputLabel>Company Website</InputLabel>
                                        <div className='flex'>
                                        <span
                                            className="flex items-center leading-tight  text-white text-sm w-12 h-12 justify-center rounded-l-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none"
                                                     viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </span>
                                            <TextInput
                                                type="text"
                                                className="flex-1 rounded-br rounded-tr px-2 "
                                                value={website}
                                                name="website"
                                                onChange={onChange}
                                                placeholder="https://"/>

                                        </div>
                                    </div>
                                    <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                                        <div className="w-full flex flex-col mb-3">
                                            <InputLabel>Location</InputLabel>
                                            <TextInput placeholder="Address"
                                                       type="text"
                                                       value={location}
                                                       onChange={onChange}
                                                       name="location"/>
                                        </div>
                                        <div className="w-full flex flex-col mb-3">
                                            <InputLabel>Country</InputLabel>
                                            <TextInput placeholder="Country"
                                                       value={country}
                                                       onChange={onChange}
                                                       type="text"
                                                       name="country"/>
                                        </div>
                                    </div>
                                    <div className="flex-auto w-full mb-1 text-xs space-y-2">
                                        <InputLabel>Bio</InputLabel>
                                        <TextInput
                                            onChange={handleCharacterChange}
                                            name="bio"
                                            value={bio}
                                            isTextArea={true}
                                            className={`w-full min-h-[100px] max-h-[300px] ${inputStyle}`}
                                            placeholder="a shorter bio of yourself "
                                        ></TextInput>

                                        <p className="text-xs text-gray-400 text-left my-3">You
                                            inserted {characterCount} characters</p>
                                        <InputError message={errors.bio} className="mt-2"/>

                                    </div>

                                    <div>
                                        <PrimaryButton type='button'
                                                       onClick={() => toggleSocialInputs(prevState => !prevState)}>Social
                                            Networks
                                        </PrimaryButton>
                                        {displaySocialInputs &&
                                            (
                                                <div className='grid grid-cols-2 gap-2 mt-4'>
                                                    <div className={`flex items-center gap-1 ${inputStyle}`}>
                                                        <TwitterIcon className='!text-white'/>
                                                        <TextInput
                                                            type="text"
                                                            placeholder="Twitter URL"
                                                            name="twitter"
                                                            value={twitter}
                                                            onChange={onChange}
                                                        />
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${inputStyle}`}>
                                                        <FacebookIcon className='!text-white'/>
                                                        <TextInput
                                                            type="text"
                                                            placeholder="Facebook URL"
                                                            name="facebook"
                                                            value={facebook}
                                                            onChange={onChange}
                                                        />
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${inputStyle}`}>
                                                        <InstagramIcon className='!text-white'/>
                                                        <TextInput
                                                            type="text"
                                                            placeholder="Instagram URL"
                                                            name="instagram"
                                                            value={instagram}
                                                            onChange={onChange}
                                                        />
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${inputStyle}`}>
                                                        <LinkedInIcon className='!text-white'/>
                                                        <TextInput
                                                            type="text"
                                                            placeholder="LinkedIn URL"
                                                            name="linkedin"
                                                            value={linkedin}
                                                            onChange={onChange}
                                                        />
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${inputStyle}`}>
                                                        <YouTube className='!text-white'/>
                                                        <TextInput
                                                            type="text"
                                                            placeholder="YouTube URL"
                                                            name="youtube"
                                                            value={youtube}
                                                            onChange={onChange}
                                                        />
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${inputStyle}`}>
                                                        <GitHubIcon className='!text-white'/>
                                                        <TextInput
                                                            type="text"
                                                            placeholder="GitHub URL"
                                                            name="github"
                                                            value={github}
                                                            onChange={onChange}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>


                                    <div className="flex justify-end gap-4">
                                        <Link href={route('home')}><PrimaryButton>
                                            Cancel</PrimaryButton></Link>
                                        <PrimaryButton type='submit'>Save</PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}



