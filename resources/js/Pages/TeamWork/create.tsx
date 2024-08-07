import React from 'react';
import {Typography} from '@mui/material';
import {useForm, usePage} from '@inertiajs/react';
import {PageProps} from "@/types";
import SpringModal from "@/Components/ui/SpringModal";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import TextInput from "@/Components/formComp/TextInput";
import InputError from "@/Components/formComp/InputError";

const CreateTeamForm = ({open, setOpen}) => {

    const {data, setData, post, errors} = useForm({
        name: '',
    });
    const {auth} = usePage<PageProps>().props;

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teams.store'), {
            onSuccess: () => {
                setOpen(false)
            }
        });
    };

    return (
        <SpringModal isOpen={open} setIsOpen={setOpen}>
            <div>
                <div className="p-6">
                    <Typography variant="h6" className="mb-4">
                        Create a New Team
                    </Typography>
                    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 ">
                        <div>
                            <TextInput
                                placeholder="Team Name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className='mt-2'/>

                        </div>

                        <PrimaryButton
                            type="submit"
                            color="primary">
                            Create
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </SpringModal>

    );
};

export default CreateTeamForm;
