import React from 'react';
import {Typography} from '@mui/material';
import {useForm} from '@inertiajs/react';
import SpringModal from "@/Components/ui/SpringModal";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import TextInput from "@/Components/formComp/TextInput";
import InputError from "@/Components/formComp/InputError";

const EditTeamForm = ({team, open, setOpen}) => {
    const {data, setData, put, errors} = useForm({
        name: team.name,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('teams.update', team.id), {
            onSuccess: () => setOpen(false)
        });
    };

    return (
        <SpringModal isOpen={open} setIsOpen={setOpen}>

            <div
                className="p-4 text-white">
                <div className="p-6">
                    <Typography variant="h6" className="mb-4">
                        Edit Team {team.name}
                    </Typography>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                        <div>
                            <TextInput
                                placeholder="Team Name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className='mt-2'/>
                        </div>
                        <PrimaryButton>
                            Save
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </SpringModal>
    );
};

export default EditTeamForm;
