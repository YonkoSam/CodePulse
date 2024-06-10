import {PageProps, User} from "@/types";
import {Box} from "@mui/material";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import {Head, Link, usePage} from "@inertiajs/react";
import Avatar from "../../../assets/images/default-avatar.svg"

const Index = ({users}: any) => {
    const {auth} = usePage<PageProps>().props;

    return (
        <AuthenticatedLayout user={auth.user}
                             header={<h2 className="font-semibold text-xl text-white leading-tight">Developers</h2>}>
            <Head title="Developers"/>

            <div className='grid  gap-2 p-2 md:grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5'>
                {users.filter((user: User) => user.profile).map((user: User) => (
                    <Box key={user.id}>
                        <Link href={`/profiles/${user.profile.id}`}>
                            <div className="mx-auto px-5">
                                <div
                                    className="max-w-xs cursor-pointer bg-white p-2 mb-4 shadow-lg rounded-2xl duration-150 hover:scale-105 hover:shadow-md">
                                    <img className="w-64  h-64 rounded-lg object-cover object-top bg-black/50"
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
        </AuthenticatedLayout>
    );
}


export default Index;
