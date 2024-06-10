import { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes } from 'react';
import {Input} from "@mui/material";
import {inputStyle} from "@/utils";

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props }: any & { isFocused?: boolean },
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

    return (
        <Input
            type={type}
            className={inputStyle}
            ref={localRef}
            sx={{ backgroundColor: 'white',padding:1 }} // Change the background color here
            {...props}
        />
    );
});
