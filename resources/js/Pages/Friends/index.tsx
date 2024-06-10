import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Head, Link} from "@inertiajs/react";
import {Box} from "@mui/material";
import Avatar from "../../../assets/images/default-avatar.svg";
import React from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import {User} from "@/types";

const Index = ({friends, auth}: any) => {
    const hasFriends = friends && friends.length > 0;

    return (
        <AuthenticatedLayout user={auth.user}
                             header={<h2 className="font-semibold text-xl text-white leading-tight">My Friends</h2>}>
            <Head title="My Friends"/>
            <div className="flex justify-center items-center">
                {!hasFriends ? (
                    <div className="bg-gray-900 opacity-75 shadow-lg rounded-lg px-8 pt-6 pb-8 my-4">
                        <div className="mb-4">
                            <h3 className="block text-blue-300 py-2 font-bold mb-2 text-center">
                                It looks like you don't have any friends yet. Let's add some developers!
                            </h3>
                            <div className="flex flex-wrap justify-center">
                                <PrimaryButton>
                                    <Link href={route('profiles.index')} className="text-white">
                                        Add Developers
                                    </Link>
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='grid gap-2 p-2 md:grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5'>

                        {friends.map((user: User) => (

                            <Box key={user.id}>
                                <Link href={`/profiles/${user.profile.id}`}>
                                    <div className="mx-auto px-5">
                                        <div
                                            className="max-w-xs cursor-pointer bg-white p-2 mb-4 shadow-lg rounded-2xl duration-150 hover:scale-105 hover:shadow-md">
                                            <img className="w-64 h-64 rounded-lg object-cover object-top bg-black/50"
                                                 src={user.profile_image ? '/' + user.profile_image : Avatar}
                                                 alt={user.name}/>
                                            <p className="my-4 pl-4 font-bold text-gray-500">{user.name}</p>
                                            <p className="mb-4 ml-4 text-xl font-semibold text-gray-800">{user.profile.status}</p>
                                        </div>
                                    </div>
                                </Link>
                            </Box>
                        ))}
                    </div>

                )}
            </div>

        </AuthenticatedLayout>
    );
};

export default Index;
