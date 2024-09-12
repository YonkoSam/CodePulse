import React, {useEffect, useState} from 'react';
import {CircularProgress, IconButton, Tooltip} from "@mui/material";
import {router, useForm} from "@inertiajs/react";
import {sendIsTyping, sendStoppedTyping} from "@/Components/chat/isTypingNotification";
import InputError from "@/Components/formComp/InputError";
import AudioRecorderComp from "@/Components/chat/AudioRecorderComp";
import {ImageIcon} from "lucide-react";
import {Clear, EmojiEmotions} from "@mui/icons-material";
import EmojiPicker, {EmojiStyle, Theme} from "emoji-picker-react";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import TextInput from "@/Components/formComp/TextInput";
import {usePreview} from "@/utils/customHooks";
import {AnimatedText} from "@/Components/animatedComp/AnimatedText";
import axios from "axios";


const MessageSubmitForm = ({
                               updateMessages,
                               prev_page_url = false,
                               receiverId = null,
                               team_id = null,
                               disabled = false,
                               size = 'large',
                           }) => {
    const initialData = {
        message: '',
        audioBlob: null,
        image: null,
        receiver_id: receiverId,
        team_id: team_id
    };
    const {data, setData, reset} = useForm(initialData)
    const [loading, setLoading] = useState(false)
    const {message, audioBlob, image} = data;
    const [open, setopen] = useState(false);
    const [errors, setErrors] = useState([])
    const {preview, selectedFile, onSelectFile, reset: resetImage} = usePreview();
    const [isRecording, setIsRecording] = useState(false)

    useEffect(() => {
        setData('image', selectedFile)
    }, [selectedFile]);

    const handleFocus = () => {
        if (receiverId) sendIsTyping(receiverId, team_id);
        if (team_id) sendIsTyping(receiverId, team_id);

    }
    const handleBlur = () => {
        if (receiverId) sendStoppedTyping(receiverId, team_id);
        if (team_id) sendStoppedTyping(receiverId, team_id)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        setErrors([]);
        const formData = new FormData();
        message && formData.append('message', message);
        audioBlob && formData.append('audioBlob', audioBlob);
        image && formData.append('image', image);
        data.receiver_id && formData.append('receiver_id', data.receiver_id);
        data.team_id && formData.append('team_id', data.team_id);
        axios.post(route('chat.store'), formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(r => {
                    if (prev_page_url) {
                        return router.visit(route('chat.index'));
                    }
                    updateMessages(r.data);
                    reset();
                    resetImage();
                }
            ).catch((e) => setErrors(e.response?.data?.errors)
        ).finally(() => setLoading(false));


    };
    const handleEmoji = (e) => {
        setData((prev) => {
                return {
                    ...prev,
                    message: message + e.emoji
                }
            }
        )
        setopen(false);
    };
    return (
        <>
            {preview &&
                <AnimatedText text={'hover or long press the clear button to see a preview'}
                              className=' py-1 text-center text-white'/>}

            <form
                id="chat-form"
                onSubmit={handleSubmit}
                className='flex w-full items-center space-x-3 relative  justify-center'
            >

                {!message.length && !disabled && (
                    <div className={` flex items-center ${size == 'large' && 'px-4 gap-2'} `}>

                        {(!audioBlob && !isRecording) && <Tooltip
                            title={
                                preview ? (
                                    <img src={preview} alt="Preview" width="100"/>
                                ) : (
                                    'Attach image'
                                )
                            }
                            placement={'top'}
                            arrow
                        >
                            {
                                preview ? <IconButton
                                    className='!text-white'
                                    size="medium"
                                    onClick={() => {
                                        setData('image', null)
                                        resetImage()
                                    }
                                    }
                                >
                                    <Clear/>
                                </IconButton> : <label
                                    className={`rounded-full ${disabled || !!audioBlob ? 'text-gray-200' : 'text-white cursor-pointer'} `}
                                >
                                    <ImageIcon/>
                                    <input
                                        type="file"
                                        disabled={disabled || !!audioBlob}
                                        accept="image/*"
                                        onChange={onSelectFile}
                                        className="hidden"
                                    />
                                </label>

                            }

                        </Tooltip>}
                        {
                            !image &&
                            <Tooltip title="attach voice message" placement={'top'}
                            >
                                <div>
                                    <AudioRecorderComp setAudio={setData} reset={!audioBlob}
                                                       setIsRecording={setIsRecording} small={size == 'small'}/>

                                </div>

                            </Tooltip>
                        }


                    </div>

                )

                }


                {
                    (!isRecording && !audioBlob) &&
                    <>
                        <TextInput
                            placeholder={
                                (!!audioBlob || disabled)
                                    ? "You cannot send a message"
                                    : "Type a message..."
                            }
                            value={message}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className={`${size == 'small' && 'h-2 max-w-60 bg-gray-600'} `}
                            onChange={(e) => setData('message', e.target.value)}
                            disabled={!!image || !!audioBlob || disabled}
                        />
                        <div className="relative">
                            <Tooltip title="Open emoji picker" placement={'top'}
                            >
                                <IconButton onClick={() => setopen((prev) => !prev)} className='!text-white'>
                                    <EmojiEmotions/>
                                </IconButton>
                            </Tooltip>
                            <div className={`absolute bottom-[50px] right-0 ${open ? 'block' : 'hidden'}`}
                            >
                                <EmojiPicker open={open} onEmojiClick={handleEmoji} theme={Theme.DARK}
                                             emojiStyle={EmojiStyle.APPLE}
                                             reactionsDefaultOpen={size == 'small'}
                                             allowExpandReactions={size == 'large'}
                                />

                            </div>
                        </div>
                    </>

                }


                {
                    (message.length || image || audioBlob) &&
                    <PrimaryButton className='!ml-auto' disabled={loading}>
                        {loading ? <span className='flex items-center gap-2 '>Sending < CircularProgress
                            size={15}/></span> : 'Send'}</PrimaryButton>
                }


            </form>
            {(() => {
                try {
                    return Object.entries(errors).map(([key, error]) => (
                        <InputError key={key} message={error} className="mt-2"/>
                    ));
                } catch (e) {
                    console.error('An error occurred while displaying errors:', e);
                    return <InputError message={'Sorry ! there was an error please try again'} className="mt-2"/>;
                }
            })()}

        </>
    );

};

export default MessageSubmitForm;
