import { SVGAttributes } from 'react';
import {Link} from "@inertiajs/react";

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <div      className="flex items-center text-indigo-400 no-underline hover:no-underline font-bold text-2xl lg:text-4xl">
            Tawa<span
            className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">sol</span>
       </div>
    );
}
