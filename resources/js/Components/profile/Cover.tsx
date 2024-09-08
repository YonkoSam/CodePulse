import React, {useEffect, useState} from 'react';
import {WavyBackground} from "@/Components/ui/wavy-background";
import {BACKGROUND_GRADIENT} from "@/utils";

function preloadImage(src: string) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
    });
}

export default function CoverImage({preview, cover}) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const imageUrl = preview || (cover ? '/' + cover : null);

        if (imageUrl) {
            preloadImage(imageUrl)
                .then(() => setIsLoaded(true))
                .catch((error) => console.error('Error preloading image:', error));
        } else {
            setIsLoaded(true);
        }
    }, [preview, cover]);

    if (!isLoaded) {
        return <div className={`h-72 w-full rounded-t-3xl ${BACKGROUND_GRADIENT}`}/>;
    }

    return (
        <>
            {preview ? (
                <img
                    className='object-cover object-top h-72 w-full rounded-t-3xl'
                    src={preview}
                    alt="cover"
                />
            ) : cover ? (
                <img
                    className='object-cover object-top h-72 w-full rounded-t-3xl'
                    src={'/' + cover}
                    alt="cover"
                />
            ) : (
                <WavyBackground
                    backgroundFill={'#0c0a09'}
                    className='h-72 object-cover w-full rounded-t-3xl'
                />
            )}
        </>
    );
}
