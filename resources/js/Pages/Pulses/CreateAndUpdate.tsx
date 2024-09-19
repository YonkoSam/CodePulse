import React, {useEffect, useState} from 'react';
import {router, useForm, usePage} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {PageProps, Pulse, Team} from "@/types";
import {Grid, Stack, Typography} from '@mui/material';
import TextInput from "@/Components/formComp/TextInput";
import InputError from "@/Components/formComp/InputError";
import {Toast} from "@/utils";
import CodeEditor from "@/Components/codeComp/CodeEditor";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import TeamSelector from "@/Components/genralComp/TeamSelector";
import DangerButton from "@/Components/formComp/DangerButton";
import Swal from "sweetalert2";
import '../../../css/MarkDownEditor/index.css';
import MdEditor, {Plugins} from 'react-markdown-editor-lite';
import ReactMarkdown from "react-markdown";


const CreateAndUpdate = ({pulse, teams}: { pulse: Pulse, teams: Team[] }) => {
    const {auth} = usePage<PageProps>().props;

    const [codeData, setCodeData] = useState({sourceCode: '', language: ''})
    MdEditor.unuse(Plugins.FullScreen);
    MdEditor.unuse(Plugins.BlockCodeBlock);
    MdEditor.unuse(Plugins.BlockCodeInline);

    const initialData = pulse ? {
            title: pulse.title,
            text: pulse.text,
            code: pulse.code,
            team_id: pulse.team_id
        } :
        {
            title: '',
            text: '',
            code: {sourceCode: "", language: ""},
            team_id: auth.currentTeam?.id
        }


    const {data, setData, post, errors} = useForm(initialData);
    const {title, text, code, team_id} = data;

    useEffect(() => {
        setData('code', codeData);
    }, [codeData]);


    const handleDelete = () => {
        Swal.fire({
            title: `Are you sure you want to this pulse ?`,
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1e40af",
            cancelButtonColor: "#57534e",
            confirmButtonText: "Yes, im Sure!"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(route('pulses.destroy', {'pulse': pulse.id}), {
                    onSuccess: () => {
                        Toast.fire({
                            icon: "success",
                            title: "pulse was deleted Successfully"
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
        });

    };

    const handleSubmit = () => {
        if (pulse) {
            router.patch(route('pulses.update', pulse.id), data, {
                onSuccess: () => {
                    Toast.fire({
                        icon: "success",
                        title: "Pulse updated successfully"
                    });
                }
            });
        } else {
            router.post(route('pulses.store'), data, {
                onSuccess: () => {
                    Toast.fire({
                        icon: "success",
                        title: "Pulse Created successfully"
                    });
                }
            });
        }

    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            title={`${pulse ? 'Update Pulse' : 'Create Pulse'}`}
            header={<Typography variant="h5"
                                className="text-white font-semibold">{pulse ? 'Update Pulse' : 'Create Pulse'}</Typography>}
        >

            <div className="min-h-full  flex justify-center items-center py-4 px-8 bg-transparent">
                <div className="w-full p-4 rounded-lg bg-black/30 opacity-85 ">
                    <div className=" grid grid-cols-1  lg:grid-cols-2 gap-4 ">
                        <Grid item xs={12} md={6} alignContent='center'>
                            <Stack spacing={3}>
                                <TextInput
                                    variant="outlined"
                                    placeholder="Title*"
                                    value={title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <InputError message={errors.title}/>}

                                <MdEditor
                                    value={text}
                                    style={{height: '500px'}}
                                    renderHTML={text => <ReactMarkdown>{text}</ReactMarkdown>}
                                    onChange={({text}) => setData('text', text)}
                                />

                                {errors.text && <InputError message={errors.text}/>}

                                <div className="flex justify-between items-center mt-4">
                                    {
                                        <div>
                                            <TeamSelector placeholder='Who can see your pulse?' teams={teams}
                                                          className={'!text-white'}
                                                          currentTeamId={team_id}
                                                          onChange={(teamId: number | null) => setData('team_id', teamId)}/>
                                        </div>
                                    }

                                    <div className='flex  gap-2'>
                                        {
                                            pulse && <DangerButton onClick={() => handleDelete()}>
                                                Delete Pulse
                                            </DangerButton>
                                        }

                                        <PrimaryButton
                                            className='animate-pulse infinite'
                                            onClick={handleSubmit}
                                            disabled={title.length === 0 || text.length === 0}
                                        >
                                            {pulse ? 'Update' : 'Create'} Pulse
                                        </PrimaryButton>
                                    </div>


                                </div>
                            </Stack>
                        </Grid>
                        <CodeEditor setValue={setCodeData} height="75dvh"
                                    defaultLanguage={pulse?.code && {
                                        name: pulse.code.language,
                                        value: pulse.code.sourceCode
                                    }}/>

                    </div>
                </div>


            </div>
        </AuthenticatedLayout>
    );
};

export default CreateAndUpdate;
