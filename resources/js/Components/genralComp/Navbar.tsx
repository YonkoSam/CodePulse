import {Link, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import Logo from "@/Components/genralComp/Logo";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import {buttonStyle, spanStyle} from "@/utils";
import React from "react";


const Navbar = () => {
    const {auth} = usePage<PageProps>().props;
    return <div className="w-full container mx-auto mt-6">
        <div className="w-full flex items-center justify-between">
            <Logo height='70'/>
            <div className="flex justify-end">
                <ul className='flex justify-between space-x-3'>
                    {!auth.user ? (
                        <>
                            <Link href={route('login')}>
                                <PrimaryButton>Login</PrimaryButton></Link>
                            <Link href={route('register')}>
                                <PrimaryButton>Sign up</PrimaryButton></Link>
                        </>
                    ) : (
                        <Link method="post" href={route('logout')} as="button" className={buttonStyle}
                              onClick={() => sessionStorage.removeItem('receiverIds')}>
                            <span className={spanStyle}>Logout</span>
                        </Link>
                    )}
                </ul>

            </div>
        </div>
    </div>
}


export default Navbar;
