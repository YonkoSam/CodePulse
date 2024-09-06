import {FormEventHandler, useRef, useState} from 'react';
import DangerButton from '@/Components/formComp/DangerButton';
import InputError from '@/Components/formComp/InputError';
import InputLabel from '@/Components/formComp/InputLabel';
import SecondaryButton from '@/Components/formComp/SecondaryButton';
import TextInput from '@/Components/formComp/TextInput';
import {useForm} from '@inertiajs/react';
import SpringModal from "@/Components/ui/SpringModal";

export default function DeleteUserForm({className = ''}: { className?: string }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-white">Delete Account</h2>

                <p className="mt-1 font-light text-sm text-white">
                    Once your account is deleted, all of its resources and data will be permanently deleted. Before
                    deleting your account, please download any data or information that you wish to retain.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>Delete Account</DangerButton>

            <SpringModal isOpen={confirmingUserDeletion} setIsOpen={closeModal}>
                <form onSubmit={deleteUser} className="p-2">
                    <h2 className="text-lg font-medium text-white">
                        Are you sure you want to delete your account?
                    </h2>

                    <p className="mt-1 text-sm text-white">
                        Once your account is deleted, all of its resources and data will be permanently deleted. Please
                        enter your password to confirm you would like to permanently delete your account.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Password" className="sr-only"/>

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="mt-1 block w-3/4"
                            placeholder="Password"
                        />

                        <InputError message={errors.password} className="mt-2"/>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Cancel</SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Delete Account
                        </DangerButton>
                    </div>
                </form>
            </SpringModal>
        </section>
    );
}
