import React, {Suspense, useEffect, useState} from 'react';
import {useAudioRecorder} from 'react-audio-voice-recorder';
import {IconButton} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import {Clear} from "@mui/icons-material";
import {LiveAudioVisualizer as LiveAudioVisualizerType} from "@/types";
import {useWindowSize} from "@/utils";

const LiveAudioVisualizer = React.lazy<React.ComponentType<LiveAudioVisualizerType>>(async () => {
    const {LiveAudioVisualizer} = await import("react-audio-visualize");
    return {default: LiveAudioVisualizer};
});
const SmallAudioRecorderUI = ({setAudio, reset, setIsRecording, small}) => {

    const {width} = useWindowSize();
    const {
        recordingBlob,
        startRecording,
        stopRecording,
        isRecording,
        mediaRecorder

    } = useAudioRecorder({});

    const [blob, setBlob] = useState(null);

    useEffect(() => {
        setIsRecording(isRecording);
    }, [isRecording])

    useEffect(() => {
        setBlob(recordingBlob);
    }, [stopRecording])


    useEffect(() => {
        if (reset)
            setBlob(null);
    }, [reset])


    useEffect(() => {
        setBlob(null);
    }, [startRecording])

    useEffect(() => {
        setAudio('audioBlob', blob);
    }, [blob])

    const handleMicClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const waveVariants = {
        start: {scaleY: 1},
        end: {scaleY: 1.5},
    };


    return (
        <div className={`flex  justify-around space-x-16 !z-50  rounded-xl`}>
            {mediaRecorder && (
                <Suspense fallback={<></>}>
                    <LiveAudioVisualizer
                        mediaRecorder={mediaRecorder}
                        barWidth={2}
                        gap={2}
                        width={small ? 200 : 400}
                        height={30}
                        fftSize={512}
                        maxDecibels={-10}
                        minDecibels={-80}
                        smoothingTimeConstant={0.4}
                    />
                </Suspense>
            )}
            {

                blob ?
                    <IconButton
                        className="p-1 !text-white !w-9 !h-9"
                        size="medium"
                        onClick={() => setBlob(null)}
                    >
                        <Clear/>
                    </IconButton>
                    :
                    <IconButton
                        className="p-1 !text-white !w-9 !h-9"
                        size="medium"
                        onClick={handleMicClick}
                    >
                        {isRecording ? <StopIcon fontSize="small"/> : <MicIcon fontSize="small"/>}
                    </IconButton>
            }


        </div>
    );
};

export default SmallAudioRecorderUI;
