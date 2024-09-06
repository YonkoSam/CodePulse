import {FormEventHandler, useEffect} from 'react';
import Checkbox from '@/Components/formComp/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/formComp/InputError';
import InputLabel from '@/Components/formComp/InputLabel';
import PrimaryButton from '@/Components/formComp/PrimaryButton';
import TextInput from '@/Components/formComp/TextInput';
import {Head, Link, useForm} from '@inertiajs/react';
import {GitHub} from "@mui/icons-material";

export default function Login({status, canResetPassword}: { status?: string, canResetPassword: boolean }) {
    const {data, setData, post, processing, errors, reset} = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <GuestLayout>
            <Head title="Log in"/>

            {status && <div className="mb-4 font-medium text-sm text-green-600">{status}</div>}
            <h1 className="text-xl font-bold leading-tight tracking-tight text-white md:text-2xl ">
                Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6  " onSubmit={submit}>
                <div>

                    <InputLabel htmlFor="email" value="Email"/>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        autoComplete="username"
                        placeholder="name@company.com"
                        onChange={(e: any) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2"/>
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password"/>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={data.password}
                        autoComplete="current-password"
                        onChange={(e: any) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2"/>
                </div>

                <div className="block mt-4">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-white">Remember me</span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-white hover:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Log in
                    </PrimaryButton>

                </div>
            </form>

            <div className="mx-3 flex flex-1 justify-center">
                <div className="grid grid-cols-2">
                    <a href="/socialite/github"><GitHub
                        className='!text-4xl !text-white hover:scale-110 transition-all duration-300 ease-in-out'/></a>
                </div>
            </div>
            <p className="text-sm font-light text-gray-400 ">
                Don’t have an account yet? <Link href='/register'
                                                 className="font-medium text-gray-200 hover:underline animate-pulse ">Sign
                up</Link>
            </p>
        </GuestLayout>
    );
}
