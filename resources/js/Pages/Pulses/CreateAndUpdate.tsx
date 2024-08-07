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

const CreateAndUpdate = ({pulse, teams}: { pulse: Pulse, teams: Team[] }) => {
    const {auth} = usePage<PageProps>().props;

    const [codeData, setCodeData] = useState({sourceCode: '', language: ''})

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

    useEffect(() => {
        setData('code', codeData);
    }, [codeData]);

    const {title, text, code, team_id} = data;


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
                    <div className=" grid  md:grid-cols-[1fr,1fr] gap-4 ">
                        <Grid item xs={12} md={6} alignContent='center'>
                            <Stack spacing={3}>
                                <TextInput
                                    variant="outlined"
                                    placeholder="Title*"
                                    value={title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                {errors.title && <InputError message={errors.title}/>}

                                <TextInput
                                    placeholder="Body*"
                                    value={text}
                                    isTextArea={true}
                                    onChange={(e) => setData('text', e.target.value)}
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

                                    <PrimaryButton
                                        className='animate-pulse infinite'
                                        onClick={handleSubmit}
                                        disabled={title.length === 0 || text.length === 0}
                                    >
                                        {pulse ? 'Update' : 'Create'} Pulse
                                    </PrimaryButton>
                                </div>
                            </Stack>
                        </Grid>
                        <div className='max-w-screen-lg'>
                            <CodeEditor setValue={setCodeData} height="75dvh"
                                        defaultLanguage={pulse?.code && {
                                            name: pulse.code.language,
                                            value: pulse.code.sourceCode
                                        }}/>
                        </div>
                    </div>
                </div>


            </div>
        </AuthenticatedLayout>
    );
};

export default CreateAndUpdate;
