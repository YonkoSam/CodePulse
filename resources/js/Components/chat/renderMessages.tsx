import {Avatar, Box, Fade, IconButton, Modal, Stack, Tooltip, Typography} from "@mui/material";
import ReactTimeAgo from "react-time-ago";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DoneIcon from "@mui/icons-material/Done";
import React from "react";
import {router} from "@inertiajs/react";
import {Message} from "@/types";
import {motion} from "framer-motion";
import Swal from "sweetalert2";
import {Toast} from "@/utils";
import {Clear} from "@mui/icons-material";
import UserSeenList from "@/UserSeenList";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    outline: 0,
};

enum MessageType {
    TEXT = 1,
    AUDIO,
    IMAGE,
    CODE,
    VIDEO
}

const MessageContent = ({id, type, message, small, setImagePreview, isAuthUser, profile_image}) => {
    switch (type) {
        case MessageType.TEXT:
            return <Typography
                className={isAuthUser ? 'text-white' : 'text-gray-900'}
                variant={small ? 'caption' : 'body2'}>{message}</Typography>;
        case MessageType.AUDIO:
            return <Stack direction="row" spacing={1} alignItems="center">
                <Avatar src={profile_image && '/' + profile_image}
                        className="w-10  h-11"/>
                <audio src={'/' + message} className={`${small && 'max-w-52'} `} controls/>

            </Stack>;
        case MessageType.IMAGE:
            return <img
                className={`object-cover object-top`}
                src={'/' + message}
                onClick={() => setImagePreview(id)}
                alt="image"
            />;
        default:
            return null;
    }
};


export const renderMessages = (auth, messages: Message[], imagePreview: null | number, setImagePreview: Function, onDelete, small = false, teamUsersCount = 0, showUsersSeen = null, setShowUsersSeen = null) => {
    return messages.map((msg, index: number) => {
        const isSameSenderAsPrevious = index > 0 && messages[index - 1].sender_id === msg.sender_id;
        const isSeen = msg.seen_at !== null
        const isAuthUser = msg.sender_id === auth.user.id;
        const isGroupChat = msg.team_id;
        const userSeenCount = msg.users_seen_count ?? 0;
        const usersSeenFiltered = msg.users_seen?.map((user) => ({
            ...user,
            name: user.id === auth.user.id ? 'You' : user.name
        }));
        const oneHourAgo = Date.now() - 60 * 60 * 1000;
        const messageTime = new Date(msg.created_at).getTime();

        function handleDelete(id: number) {
            Swal.fire({
                title: "Are you sure?",
                text: `You are about to delete this message!`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#ff0000",
                cancelButtonColor: "#57534e",
                confirmButtonText: "Yes, delete it!"
            }).then((result: any) => {
                if (result.isConfirmed) {
                    router.delete(route('message.destroy', id), {
                        onSuccess: () => {
                            Swal.fire({
                                title: "Deleted!",
                                text: `message has been deleted successfully .`,
                                icon: "success"
                            });
                            onDelete(id);
                        },

                        onError: (errors: any) => {
                            Toast.fire({
                                title: "Error!",
                                text: errors.message,
                                icon: "error"
                            });
                        },
                    });
                }
            });

        }

        return (

            <motion.div
                initial={{opacity: 0, y: -50}}
                whileInView={{opacity: 1, y: 0}}
                viewport={{once: true}}
                transition={{duration: 0.3}}

                key={msg.id}
                className={`flex ${isAuthUser ? 'justify-end' : 'justify-start'} gap-2.5 mb-1 ${small ? 'text-xs' : 'text-sm'}`}>
                {!isSameSenderAsPrevious && !isAuthUser && isGroupChat && (
                    <Avatar src={msg.sender.profile_image && '/' + msg.sender.profile_image}
                            className="w-10  h-11"/>
                )}
                <div className={`grid ${isAuthUser ? 'items-end' : 'items-start'}`}>
                    {!isSameSenderAsPrevious && (
                        <Typography variant={`${small ? 'caption' : 'body2'}`}
                                    className={`font-semibold text-white pb-1 ${isAuthUser ? 'text-right' : ''} `}>
                        </Typography>
                    )}
                    <div
                        className={`relative w-max grid  ${(isSameSenderAsPrevious && isGroupChat && !isAuthUser) && 'ml-12'}`}>


                        <Box
                            className={`px-3.5 py-2 ${small ? 'max-w-60' : 'max-w-72 lg:max-w-96'} ${messageTime > oneHourAgo && 'flex gap-1 justify-between items-center'}   ${(msg.type == MessageType.TEXT || msg.type == MessageType.AUDIO) && (isAuthUser ? 'bg-blue-500 ' : 'bg-gray-300')}   rounded-3xl `}>
                            <MessageContent
                                id={msg.id}
                                type={msg.type}
                                message={msg.message}
                                small={small}
                                isAuthUser={isAuthUser}
                                setImagePreview={setImagePreview}
                                profile_image={msg.sender.profile_image}
                            />
                            {(messageTime > oneHourAgo && isAuthUser) && (
                                <IconButton className='!text-white w-6 h-6 hover:scale-110 duration-300'
                                            onClick={() => handleDelete(msg.id)}>
                                    <Clear/>
                                </IconButton>
                            )}

                        </Box>

                        <div className={`flex items-center ${isAuthUser ? 'justify-end' : 'justify-start'}`}>
                            <Typography variant="caption" className="text-gray-500 py-1">
                                <span>
                                    <ReactTimeAgo date={Date.parse(msg.created_at)}/>
                                </span>
                                {isAuthUser && isSeen && (
                                    <span className={`block text-xs text-blue-500 font-light`}>
                                        <span className={`${small ? 'text-xs' : 'text-sm'} text-blue-400`}>seen </span>
                                        <ReactTimeAgo date={Date.parse(msg.seen_at)} className='text-blue-400'/>
                                    </span>
                                )}

                                {

                                    usersSeenFiltered?.length > 0 && (
                                        <Tooltip
                                            title={
                                                <>
                                                    {
                                                        usersSeenFiltered.map((userSeen, i) =>
                                                                <div key={i} className="text-xs text-white font-light">
                                                    <span
                                                        className={`${small ? 'text-xs' : 'text-sm'} text-white`}>seen by {userSeen.name} </span>
                                                                    <ReactTimeAgo date={Date.parse(userSeen.pivot.seen_at)}
                                                                                  className='text-white'/>
                                                                </div>
                                                        )}
                                                    {(userSeenCount > usersSeenFiltered.length) &&
                                                        <p className={`${small ? 'text-xs' : 'text-sm'} text-blue underline cursor-pointer `}
                                                           onClick={() => setShowUsersSeen(msg.id)}>press here to see
                                                            more </p>}
                                                </>
                                            }
                                            placement="top"
                                        >
                        <span className={`block text-xs text-blue-500 font-light`}>


                            <span
                                className={`${small ? 'text-xs' : 'text-sm'} text-blue-400`}>
                                    {
                                        teamUsersCount - 1 == userSeenCount ? 'seen by all members' : `seen by ${userSeenCount} users`
                                    }
                                </span>
                        </span>
                                        </Tooltip>
                                    )
                                }
                            </Typography>
                            {isAuthUser && (
                                <span className="ml-2 flex items-center">
                                    {isSeen || usersSeenFiltered?.length ?
                                        <DoneAllIcon fontSize="small" className='text-blue-400'/> :
                                        <DoneIcon fontSize="small" color="disabled"/>}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <Modal open={imagePreview == msg.id} onClose={() => setImagePreview(null)} closeAfterTransition>
                    <Fade in={!!imagePreview} timeout={500}>
                        <Box sx={style}>
                            <img
                                src={'/' + msg.message}
                                alt="image"
                                style={{maxHeight: '90%', maxWidth: '90%'}}
                            />
                        </Box>
                    </Fade>
                </Modal>
                {
                    showUsersSeen == msg.id &&
                    <UserSeenList open={showUsersSeen == msg.id} setOpen={setShowUsersSeen} msgId={showUsersSeen}/>

                }
            </motion.div>
        );
    })
};
