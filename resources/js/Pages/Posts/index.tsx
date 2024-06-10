import React from 'react';
import {PageProps, Post} from "@/types";
import PostCard from "@/Components/PostCard";
import {Head, Link, usePage} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Box, Stack} from "@mui/material";
import Pagination from "@/Components/Pagination";
import PrimaryButton from "@/Components/PrimaryButton";

const Index = ({posts}: any) => {

    const {auth} = usePage<PageProps>().props;

    return (
        <AuthenticatedLayout user={auth.user}
                             header={
                                 <h2 className="font-semibold text-xl text-white leading-tight">Posts</h2>}>
            <Head title="Posts"/>


            <Stack justifyContent='start' gap={3} padding={3}>
                <Link href={route('posts.create')} className='flex justify-end'><PrimaryButton> Add New
                    Post</PrimaryButton></Link>
                <div className='grid grid-cols-3  gap-4'>
                    {posts.data.map((post: Post) => (
                        <div key={post.id}>
                            <PostCard post={post} auth={auth}/>
                        </div>
                    ))}
                </div>
                <Stack justifyContent='center' alignItems='center'>
                    <Box maxWidth={'fit-content'}>
                        <Pagination links={posts.links}/>
                    </Box>
                </Stack>

            </Stack>

        </AuthenticatedLayout>
    );
};

export default Index;
