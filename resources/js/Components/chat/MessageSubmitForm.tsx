import React, {useEffect, useState} from 'react';
import {IconButton, Tooltip} from "@mui/material";
import {router, useForm, usePage} from "@inertiajs/react";
import {sendIsTyping, sendStoppedTyping} from "@/Components/chat/isTypingNotification";
import {PageProps} from "@/types";
import InputError from "@/Components/formComp/InputError";
import AudioRecorderComp from "@/Components/chat/AudioRecorderComp";
import {ImageIcon} from "lucide-react";
import {Clear, EmojiEmotions} from "@mui/icons-material";
import EmojiPicker, {EmojiStyle, Theme} from "emoji-picker-react";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import TextInput from "@/Components/formComp/TextInput";
import {usePreview} from "@/utils";
import {AnimatedText} from "@/Components/animatedComp/AnimatedText";


const MessageSubmitForm = ({
                               prev_page_url = false,
                               receiverId = null,
                               team_id = null,
                               disabled = false,
                               size = 'large',
                               callBack
                           }) => {
    const initialData = {
        message: '',
        audioBlob: null,
        image: null,
        receiver_id: receiverId,
        team_id: team_id
    };
    const {data, setData, reset, post, processing, errors} = useForm(initialData)
    const {message, audioBlob, image} = data;
    const {auth} = usePage<PageProps>().props;
    const [open, setOpen] = useState(false);

    const {preview, selectedFile, onSelectFile, reset: resetImage} = usePreview();

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


    useEffect(() => {

        window.Echo.channel(`my-messages-${auth.user.id}`)
            .listen('.is-seen', (e) => {
                callBack();
            });
        return () => {
            window.Echo.leaveChannel(`public:my-messages-${auth.user.id}`);
        };
    }, [auth.user.id]);


    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('chat.store'), {
            onFinish: () => {
                reset();
                if (prev_page_url) {
                    router.visit(route('chat.index'), {only: ['messages']});
                } else {
                    callBack();
                }
            }
        });

    };
    const handleEmoji = (e) => {
        setData((prev) => {
                return {
                    ...prev,
                    message: message + e.emoji
                }
            }
        )
        setOpen(false);
    };
    return (
        <>
            {preview &&
                <AnimatedText text={'hover or long press the clear button to see a preview'}
                              className=' py-1 text-center text-white'/>}

            <form
                id="chat-form"
                onSubmit={handleSubmit}
                className='flex w-full items-center space-x-3 relative'
            >


                {!message.length && !disabled && (
                    <div className={` flex items-center ${size == 'large' && 'px-4 gap-2'} `}>


                        {!audioBlob && <Tooltip
                            title={
                                preview ? (
                                    <img src={preview} alt="Preview" width="100"/>
                                ) : (
                                    'Attach image'
                                )
                            }
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
                            <AudioRecorderComp setAudio={setData} reset={!audioBlob}/>
                        }


                    </div>

                )

                }


                <TextInput
                    placeholder={
                        (!!audioBlob || disabled)
                            ? "You cannot send a message"
                            : "Type a message..."
                    }
                    value={message}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`${size == 'small' && 'h-2 max-w-60 !bg-white !text-gray-800'} `}
                    onChange={(e) => setData('message', e.target.value)}
                    disabled={!!image || !!audioBlob || disabled}
                />
                <div className="relative">
                    <Tooltip title="Open emoji picker">
                        <IconButton onClick={() => setOpen((prev) => !prev)} className='!text-white'>
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
                {
                    (message.length || image) && <PrimaryButton>Send</PrimaryButton>
                }


            </form>
            {Object.entries(errors).map(([key, error]) => (
                <InputError key={key} message={error} className="mt-2"/>
            ))}
        </>
    );

};

export default MessageSubmitForm;
