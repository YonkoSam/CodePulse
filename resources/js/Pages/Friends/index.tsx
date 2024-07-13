import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Link, router} from "@inertiajs/react";
import {Box, Button} from "@mui/material";
import Avatar from "../../../assets/images/default-avatar.svg";
import React from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import {User} from "@/types";
import {Toast} from "@/utils";
import Swal from "sweetalert2";

const Index = ({friends, blockedFriends, auth}: any) => {
    const hasFriends = friends && friends.length > 0;
    const hasBlockedFriends = blockedFriends && blockedFriends.length > 0;

    function handleUnblock(userId: number) {

        Swal.fire({
            title: "Are you sure?",
            text: "You will unblock this user!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, im sure!"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.patch(route('friend.unblock', {'friend': userId}), {}, {
                    onSuccess: () => {
                        Toast.fire({
                            icon: "success",
                            title: "Friend was unblocked Successfully"
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
        })


    }

    return (
        <AuthenticatedLayout user={auth.user} title='My Friends'
                             header={<h2 className="font-semibold text-xl text-white leading-tight">My Friends</h2>}>
            <div className="flex flex-col justify-center items-center">
                {!hasFriends ? (
                    <div className="bg-gray-900 opacity-75 shadow-lg rounded-lg px-8 pt-6 pb-8 my-4">
                        <div className="mb-4">
                            <h3 className="block text-blue-300 py-2 font-bold mb-2 text-center">
                                It looks like you don't have any friends yet. Let's add some developers!
                            </h3>
                            <div className="flex flex-wrap justify-center">
                                <Link href={route('profiles.index')} className="text-white">
                                    <PrimaryButton>
                                        Add Developers
                                    </PrimaryButton>
                                </Link>
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
                                            className="max-w-xs cursor-pointer bg-black/30 p-2 mb-4 shadow-lg rounded-2xl duration-150 hover:scale-105 hover:shadow-md">
                                            <img className="w-64 h-64 rounded-lg object-cover object-top bg-gray-600"
                                                 src={user.profile_image ? '/' + user.profile_image : Avatar}
                                                 alt={user.name}/>
                                            <p className="my-4 pl-4 font-bold text-white">{user.name}</p>
                                            <p className="mb-4 ml-4 text-xl font-semibold text-white">{user.profile.status}</p>
                                        </div>
                                    </div>
                                </Link>
                            </Box>
                        ))}
                    </div>
                )}

                {hasBlockedFriends ? (
                    <div className="mt-8">
                        <h2 className="font-semibold text-xl text-white leading-tight px-6">Blocked Friends</h2>
                        <div className='grid gap-2 p-2 md:grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5'>
                            {blockedFriends.map((blockedUser: any) => (
                                <Box key={blockedUser.id}>
                                    <div className="mx-auto px-5">
                                        <div
                                            className="max-w-xs cursor-pointer bg-black/30 p-2 mb-4 shadow-lg rounded-2xl duration-150 hover:scale-105 hover:shadow-md">
                                            <img
                                                className="w-64 h-64 rounded-lg object-cover object-top bg-gray-600"
                                                src={blockedUser.profile_image ? '/' + blockedUser.profile_image : Avatar}
                                                alt={blockedUser.name}/>
                                            <p className="my-4 pl-4 font-bold text-white">{blockedUser.name}</p>
                                            <p className="mb-4 ml-4 text-xl font-semibold text-white">{blockedUser.status}</p>
                                            <div className='flex justify-end'>
                                                <Button color='error' size='small' variant='contained'
                                                        onClick={() => handleUnblock(blockedUser.id)}>Unblock</Button>

                                            </div>
                                        </div>
                                    </div>
                                </Box>
                            ))}
                        </div>
                    </div>

                ) : (
                    <></>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
