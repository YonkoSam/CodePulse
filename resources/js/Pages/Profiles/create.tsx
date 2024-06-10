import React, {FormEventHandler, useEffect, useState} from 'react';
import Avatar from "../../../assets/images/default-avatar.svg";
import {Head, Link, router, useForm, usePage} from "@inertiajs/react";
import {buttonStyle, inputStyle} from "@/utils";
import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {PageProps, Profile} from "@/types";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import Swal from 'sweetalert2';
import {MenuItem, Select} from "@mui/material";


export default function create({profile}: PageProps<{ profile: Profile }>) {

    const {auth} = usePage<PageProps>().props;
    const {url} = usePage();

    const [characterCount, setCharacterCount] = useState(0)
    const [selectedFile, setSelectedFile] = useState<File>()
    const [preview, setPreview] = useState<string>(auth.user.profile_image)
    const [displaySocialInputs, toggleSocialInputs] = useState(false)

    if (auth.hasProfile && url === '/create-profile') {
        router.visit(route('profiles.edit'));
    }

    useEffect((): void => {
        if (!selectedFile) {
            setPreview('')
            return
        }
        const objectUrl = URL.createObjectURL(selectedFile)
        setPreview(objectUrl);
    }, [selectedFile])


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
                setData('profile_image', files[0]);
            }

        }

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

    interface InitialValues {
        company: string;
        profile_image: File | null;
        website: string;
        location: string;
        country: string;
        status: string;
        skills: string;
        bio: string;
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
                skills: profile.skills || "",
                bio: profile.bio || "",
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
        skills,
        bio,
        twitter,
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
        <AuthenticatedLayout user={auth.user} header={<h2
            className="font-semibold text-xl text-white leading-tight">{!profile ? 'Create Your Profile' : 'Update Your Profile'}</h2>}>
            <div>
            </div>
            <Head title={!profile ? 'Create Your Profile' : 'Update Your Profile'}/>
            <div
                className=" min-h-screen flex  justify-center bg-center min-w-full py-12 px-4 sm:px-6 lg:px-8 bg-black-500   relative items-center">
                <div className="max-w-2xl w-full space-y-8 p-10 rounded-lg shadow bg-gray-900 opacity-75">
                    <div className="grid gap-8 grid-cols-1">
                        <div className="flex flex-col">
                            <div className="flex flex-col sm:flex-row items-center">
                                <h2 className="font-semibold text-lg mr-auto">Profile Info</h2>
                                <div className="w-full sm:w-auto sm:ml-auto mt-3 sm:mt-0"></div>
                            </div>
                            <div className="mt-5">
                                <form onSubmit={onSubmit}>
                                    <div className="md:flex md:flex-row md:space-x-4 w-full text-xs">
                                        <div className='w-full flex flex-col mb-3'>
                                            <label className="font-semibold text-white py-2">Profile Image</label>
                                            <div className="flex items-center">
                                                <div className="w-32 h-32 mr-4 flex-none rounded-xl  overflow-hidden">
                                                    {auth.user.profile_image && !selectedFile ? (
                                                            <img src={auth.user.profile_image} alt='preview'/>) :
                                                        selectedFile ? (<img src={preview} alt='preview'/>) :
                                                            <img src={Avatar} alt='Avatar'/>}

                                                    <img className="w-12 h-12 object-cover"
                                                         alt="Avatar Upload"/>
                                                </div>
                                                {progress && (
                                                    <progress value={progress.percentage} max="100">
                                                        {progress.percentage}%
                                                    </progress>
                                                )
                                                }
                                                <label className="cursor-pointer">
                                            <span
                                                className={buttonStyle}>Browse</span>
                                                    <input type="file"
                                                           onChange={onSelectFile}
                                                           accept='image/*'
                                                           className="hidden"/>

                                                </label>
                                                <InputError message={errors.profile_image} className="mt-2"/>

                                            </div>
                                        </div>

                                        <div className="w-full flex flex-col mb-3 ">
                                            <div className="mb-3 space-y-2 w-full text-xs">
                                                <InputLabel>Skills</InputLabel>
                                                <TextInput placeholder="Skills"
                                                           className={inputStyle}
                                                           type="text"
                                                           value={skills}
                                                           onChange={onChange}
                                                           name="skills"/>
                                            </div>
                                            <InputLabel>Status<abbr
                                                title="required">*</abbr></InputLabel>
                                            <Select
                                                variant="standard"
                                                className='!bg-white !p-2'
                                                autoWidth
                                                required
                                                name="status"
                                                value={status}
                                                onChange={e => setData('status', e.target.value)}
                                            >
                                                <MenuItem disabled value=""><em>Selected Professional
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
                                        </div>
                                        <InputError message={errors.status} className="mt-2"/>

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
                                            multiline
                                            rows={3}
                                            onChange={handleCharacterChange}
                                            name="bio"
                                            value={bio}
                                            className={`w-full min-h-[100px] max-h-[300px] ${inputStyle}`}
                                            placeholder="a shorter bio of yourself "
                                        ></TextInput>
                                        <p className="text-xs text-gray-400 text-left my-3">You
                                            inserted {characterCount} characters</p>
                                    </div>

                                    <div>
                                        <button type='button' className={buttonStyle}
                                                onClick={() => toggleSocialInputs(!displaySocialInputs)}>Social Networks
                                        </button>
                                        {displaySocialInputs &&
                                            (
                                                <div className='grid grid-cols-2 gap-2 mt-4'>
                                                    <div className={`flex items-center gap-1 ${inputStyle}`}>
                                                        <i className='fab fa-twitter fa-2x text-white'></i>
                                                        <input
                                                            type="text"
                                                            className={inputStyle}
                                                            placeholder="Twitter URL"
                                                            name="twitter"
                                                            value={twitter}
                                                            onChange={onChange}
                                                        />
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${inputStyle}`}>
                                                        <i className='fab fa-facebook fa-2x text-white'></i>
                                                        <input
                                                            type="text"
                                                            className={inputStyle}
                                                            placeholder="Facebook URL"
                                                            name="facebook"
                                                            value={facebook}
                                                            onChange={onChange}
                                                        />
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${inputStyle}`}>
                                                        <i className='fab fa-instagram fa-2x text-white'></i>
                                                        <input
                                                            type="text"
                                                            className={inputStyle}
                                                            placeholder="Instagram URL"
                                                            name="instagram"
                                                            value={instagram}
                                                            onChange={onChange}
                                                        />
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${inputStyle}`}>
                                                        <i className='fab fa-linkedin fa-2x text-white'></i>
                                                        <input
                                                            type="text"
                                                            className={inputStyle}
                                                            placeholder="LinkedIn URL"
                                                            name="linkedin"
                                                            value={linkedin}
                                                            onChange={onChange}
                                                        />
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${inputStyle}`}>
                                                        <i className='fab fa-youtube fa-2x text-white'></i>
                                                        <input
                                                            type="text"
                                                            className={inputStyle}
                                                            placeholder="YouTube URL"
                                                            name="youtube"
                                                            value={youtube}
                                                            onChange={onChange}
                                                        />
                                                    </div>
                                                    <div className={`flex items-center gap-1 ${inputStyle}`}>
                                                        <i className='fab fa-github fa-2x text-white'></i>
                                                        <input
                                                            type="text"
                                                            className={inputStyle}
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


                                    <p className="text-xs text-red-500 text-right my-3">Required fields are marked with
                                        an
                                        asterisk <abbr title="Required field">*</abbr></p>
                                    <div className="flex justify-end gap-4">
                                        <PrimaryButton><Link href='/'> Cancel</Link></PrimaryButton>
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



