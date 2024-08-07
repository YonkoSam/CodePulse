import React, {ReactNode} from 'react';

const FirstTimeCard = ({bodyText, children, className}: {
    bodyText: string,
    children: ReactNode,
    className?: string
}) => {

    return (
        <div className={`w-full flex justify-center items-center `}>

            <div className={`${className} bg-black/30 opacity-75 shadow-lg rounded-2xl px-8 pt-6 pb-8 my-4`}>
                <div className="mb-4">
                    <h3 className="block text-gray-100 py-2 font-bold mb-2 text-center">
                        {bodyText}
                    </h3>
                    <div className="flex flex-wrap justify-center">
                        {children}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FirstTimeCard;
