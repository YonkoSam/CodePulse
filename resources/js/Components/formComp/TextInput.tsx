import {forwardRef} from 'react';
import {cn} from "@/lib/utils";

export default forwardRef(function TextInput(
    {type = 'text', isTextArea = false, className = '', ...props}: any,
    ref
) {

    if (!isTextArea) {
        return <input
            type={type}
            className={cn("w-full bg-gray-800 bg-opacity-50 border-none outline-none text-white font-bold py-5 px-4 rounded-xl text-base disabled:cursor-not-allowed", className)}
            ref={ref}
            {...props}
        />
    } else {
        return <textarea
            className="w-full bg-gray-800 bg-opacity-50 border-none outline-none text-white py-5 px-4 rounded-xl text-base disabled:cursor-not-allowed"
            ref={ref}
            {...props}
        />
    }


});
