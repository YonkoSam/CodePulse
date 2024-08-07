import {FormEventHandler, useEffect} from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/formComp/InputError';
import InputLabel from '@/Components/formComp/InputLabel';
import PrimaryButton from '@/Components/formComp/PrimaryButton';
import TextInput from '@/Components/formComp/TextInput';
import {Head, Link, useForm} from '@inertiajs/react';
import {GitHub} from "@mui/icons-material";

export default function Register() {
    const {data, setData, post, processing, errors, reset} = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'));
    };

    return (
        <GuestLayout>
            <Head title="Register"/>
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign up
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name"/>

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        placeholder="Jhon Doe"
                        isFocused={true}
                        onChange={(e: any) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2"/>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email"/>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        placeholder="name@company.com"
                        autoComplete="username"
                        onChange={(e: any) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2"/>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password"/>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        placeholder="••••••••"
                        autoComplete="new-password"
                        onChange={(e: any) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2"/>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password"/>

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        placeholder="••••••••"
                        onChange={(e: any) => setData('password_confirmation', e.target.value)}
                        required
                    />

                    <InputError message={errors.password_confirmation} className="mt-2"/>
                </div>

                <div className="flex flex-col items-center justify-center space-y-3 ">
                    <PrimaryButton className="min-w-64" disabled={processing}>
                        Register
                    </PrimaryButton>

                    <a href="/socialite/github"> <PrimaryButton type='button' className="min-w-64">
                        <GitHub/> Register Using GitHub?
                    </PrimaryButton>
                    </a>
                </div>
            </form>
            <p className="text-sm font-light text-gray-400 ">
                You already have an account ?
                <Link className="font-medium text-gray-200 hover:underline ml-2" href={route('login')}>Login</Link></p>

        </GuestLayout>
    );
}
