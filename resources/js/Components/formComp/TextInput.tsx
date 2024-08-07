import {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import {cn} from "@/lib/utils";

export default forwardRef(function TextInput(
    {type = 'text', isTextArea = false, className = '', isFocused = false, ...props}: any & { isFocused?: boolean },
    ref
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, []);

    if (!isTextArea) {
        return <input
            type={type}
            className={cn("w-full bg-gray-800 bg-opacity-50 border-none outline-none text-white font-bold py-5 px-4 rounded-xl text-base disabled:cursor-not-allowed", className)}
            ref={localRef}
            {...props}
        />
    } else {
        return <textarea
            className="w-full bg-gray-800 bg-opacity-50 border-none outline-none text-white py-5 px-4 rounded-xl text-base disabled:cursor-not-allowed"
            ref={localRef}
            {...props}
        />
    }


});
