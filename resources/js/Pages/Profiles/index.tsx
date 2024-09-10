import {PageProps, Profile} from "@/types";
import {Box, Stack} from "@mui/material";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import {usePage} from "@inertiajs/react";
import Pagination from "@/Components/genralComp/Pagination";
import UserCard from "@/Components/profile/UserCard";
import SearchBar from "@/Components/genralComp/SearchBar";
import {dataType} from "@/utils";
import {motion} from "framer-motion";

const Index = ({profiles}: any) => {
    const {auth} = usePage<PageProps>().props;

    return (
        <AuthenticatedLayout user={auth.user}
                             header={<h2 className="font-semibold text-xl text-white leading-tight">Developers</h2>}
                             title='Developers'>
            <div className="mx-auto px-4">
                <div className='max-w-md mx-auto mb-6'>
                    <SearchBar type={dataType.Users} placeholder='Find a developer by name ...'/>
                </div>
                <div
                    className='grid gap-4 p-4 grid-cols-2  md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
                    {profiles.data?.map((profile: Profile, i: number) => (
                        <motion.div key={profile.id}
                                    initial={{x: -50, y: -50, opacity: 0}}
                                    animate={{x: 0, y: 0, opacity: 1}}
                                    transition={{duration: 0.3, delay: i * 0.05}}>
                            <UserCard profile={profile}/>
                        </motion.div>
                    ))}
                </div>
                <Stack justifyContent='center' alignItems='center' mt={4}>
                    <Box maxWidth='fit-content'>
                        <Pagination currentPage={profiles.current_page}
                                    lastPage={profiles.last_page} paginatedDataName={'profiles'}/>
                    </Box>
                </Stack>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
