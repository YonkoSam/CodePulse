import {ButtonHTMLAttributes} from 'react';
import {BACKGROUND_GRADIENT} from "@/utils";

export default function PrimaryButton({
                                          className = '',
                                          disabled,
                                          children,
                                          ...props
                                      }: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                ` p-0.5 rounded-3xl ${BACKGROUND_GRADIENT}   ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            <span
                className='block text-black px-4 py-2 font-semibold rounded-3xl bg-white hover:bg-transparent hover:text-white transition'>{children}</span>
        </button>
    );
}
