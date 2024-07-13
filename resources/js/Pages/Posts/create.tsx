import React, {useMemo} from 'react';
import {useForm, usePage} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {PageProps} from "@/types";
import {Button, Stack} from '@mui/material';
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import Swal from "sweetalert2";

const Create = () => {

    const {auth} = usePage<PageProps>().props;

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


    const {data, setData, post, errors} = useForm({
        title: '',
        text: ''
    })

    const {title, text} = data;
    const handleSubmit = () => {

        post(route('posts.store', data), {
            onSuccess: () => {
                Toast.fire({
                    icon: "success",
                    title: "Post Created successfully"
                });
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user} title='Create Post'
                             header={<h2 className="font-semibold text-xl text-white leading-tight">Create A New
                                 Post</h2>}>
            <div
                className=" min-h-full flex justify-center bg-center min-w-full py-12 px-2 sm:px-3 lg:px-4 bg-black-500  relative items-center">
                <div className="max-w-xl w-full space-y-4 p-2 rounded-xl shadow bg-gray-900 opacity-75">

                    <Stack gap={2} padding={3}>
                        <TextInput
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            placeholder="Title"
                            value={title}
                            onChange={(e: any) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title}/>
                        <TextInput
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={6}
                            margin="normal"
                            placeholder="Text"
                            value={text}
                            onChange={(e: any) => setData('text', e.target.value)}
                        />
                        <InputError message={errors.text}/>


                        <div className="buttons flex justify-end">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Post
                            </Button>
                        </div>
                    </Stack>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Create;
