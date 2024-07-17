import {Link, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";


const Navbar = () => {
    const {auth} = usePage<PageProps>().props;
    const liStyle = ' bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out'
    return <div className="w-full container mx-auto mt-6">
        <div className="w-full flex items-center justify-between">
            <Link href='/'
                  className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl">
                Tawa<span
                className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">sol</span>
            </Link>
            <div className="flex justify-end">
                <ul className='flex justify-between space-x-3'>
                    {!auth.user ? (
                        <>
                            <li>
                                <Link className={liStyle} href={route('login')}>Login</Link>
                            </li>
                            <li>
                                <Link className={liStyle} href={route('register')}>Sign up</Link>
                            </li>
                        </>
                    ) : (
                        <Link method="post" href={route('logout')} as="button" className={liStyle}
                              onClick={() => localStorage.removeItem('receiverIds')}>Logout </Link>
                    )}
                </ul>

            </div>
        </div>
    </div>
}


export default Navbar;
