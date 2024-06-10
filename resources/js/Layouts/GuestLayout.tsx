import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import Navbar from "@/Components/Navbar";


export default function Guest({ children }: PropsWithChildren) {
    return (
      <div>
          <Navbar/>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full  rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 bg-gray-900 opacity-75">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                {children}
                </div>
            </div>
        </div>
      </div>
    );
}
