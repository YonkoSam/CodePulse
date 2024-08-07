import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import {PageProps, User} from '@/types';

export default function Edit({user, mustVerifyEmail, status}: PageProps<{
    user: User,
    mustVerifyEmail: boolean,
    status?: string
}>) {
    return (
        <AuthenticatedLayout
            user={user} title='Settings'
            header={<h2 className="font-semibold text-xl text-white leading-tight">Settings</h2>}
        >

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6 ">
                    <div className="p-4 sm:p-8  rounded-2xl bg-black/30 shadow  ">
                        <UpdateProfileInformationForm
                            user={user}
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 rounded-2xl sm:p-8 bg-black/30 shadow ">
                        <UpdatePasswordForm className="max-w-xl"/>
                    </div>

                    <div className="p-4 sm:p-8 rounded-2xl bg-black/30 shadow ">
                        <DeleteUserForm className="max-w-xl"/>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
