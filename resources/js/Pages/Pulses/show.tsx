import React, {useEffect, useRef, useState} from 'react';
import {Comment, Like, PageProps, Pulse} from '@/types';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    CardHeader,
    Container,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    Tooltip,
    Typography
} from '@mui/material';
import {Link, router, usePage} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Clear, Edit, Terminal} from "@mui/icons-material";
import Swal from "sweetalert2";
import InputError from "@/Components/formComp/InputError";
import {Errors} from "@inertiajs/inertia";
import CodeBlock from "@/Components/codeComp/CodeBlock";
import CodeEditor from "@/Components/codeComp/CodeEditor";
import ReplyIcon from "@mui/icons-material/Reply";
import ReactTimeAgo from "react-time-ago";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import {AnimatePresence, motion} from "framer-motion";
import LikeButton from "@/Components/pulseComp/LikeButton";
import TextInput from "@/Components/formComp/TextInput";

const Show = ({pulse, comments, likes}: PageProps<{ pulse: Pulse, comments: Comment[], likes: Like[] }>) => {

    const {auth} = usePage<PageProps>().props;
    const [newComment, setNewComment] = useState('');
    const [currentReplyTargetId, setCurrentReplyTargetId] = useState(-1);
    const [newReply, setNewReply] = useState('');
    const [showCommentCodeEditor, setShowCommentCodeEditor] = useState(false);
    const [showReplyCodeEditor, setShowReplyCodeEditor] = useState(false);
    const [commentCode, setCommentCode] = useState({sourceCode: '', language: '',});
    const [replyCode, setReplyCode] = useState({sourceCode: '', language: '',});

    const replyRef = useRef(null);
    const commentRef = useRef(null);

    useEffect(() => {
        if (currentReplyTargetId != -1 && replyRef.current) {
            replyRef.current.focus();

        }
    }, [currentReplyTargetId]);

    const [errors, setErrors] = useState<Errors>(
        {
            text: "",
        }
    );

    const isAuthUser = pulse.user_id === auth.user.id;

    useEffect(() => {

        if (showReplyCodeEditor && replyRef.current) {
            replyRef.current.focus();
            setShowCommentCodeEditor(false);
        }
    }, [showReplyCodeEditor])

    useEffect(() => {

        if (showCommentCodeEditor && commentRef.current) {
            commentRef.current.focus();
            setShowReplyCodeEditor(false);
        }
    }, [showCommentCodeEditor])

    const handleCommentSubmit = () => {
        setErrors({
            text: "",
        });
        const newCommentObject: { pulse_id: number; user_id: number; text: string; code: any } = {
            text: newComment,
            user_id: auth.user.id,
            pulse_id: pulse.id,
            code: commentCode
        };

        router.post(route('comment.store'), newCommentObject, {
            preserveScroll: true,
            only: ['comments'],
            onSuccess: () => {
                setNewComment('');
                setCommentCode({sourceCode: '', language: '',});
                setShowCommentCodeEditor(false);
            },
            onError: (err) => setErrors(err)

        });


    };


    const handleReplySubmit = (commentId: number) => {

        setErrors({
            text: "",
        });
        const newReplyObject: { pulse_id: number; user_id: number; text: string; comment_id: number; code: any } = {
            text: newReply,
            user_id: auth.user.id,
            pulse_id: pulse.id,
            comment_id: commentId,
            code: replyCode
        };

        router.post(route('reply'), newReplyObject, {
            preserveScroll: true,
            only: ['comments'],
            onSuccess: () => {
                setNewReply('');
                setCurrentReplyTargetId(-1);
                setReplyCode({sourceCode: '', language: '',});
                setShowReplyCodeEditor(false);
            },
            onError: (err) => setErrors(err)
        });

    };


    const handleCommentDelete = (id: number) => {

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result: any) => {
            if (result.isConfirmed) {
                router.delete(route('comment.destroy', id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your Comment has been deleted.",
                            icon: "success"
                        });
                    },
                    onError: (error: any) => {
                        Swal.fire({
                            title: "there has been an error!",
                            text: error.message,
                            icon: "error"
                        });
                    },
                })
            }
        })


    }

    const replyForm = (comment: Comment) => {

        return currentReplyTargetId === comment.id &&
            <Stack>
                {showReplyCodeEditor &&
                    <AnimatePresence>
                        <motion.div
                            initial={{opacity: 0, scale: 0.5, y: 50}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.5, y: 50}}
                            transition={{type: 'spring', stiffness: 300, damping: 20}}

                            className='mb-4 max-w-screen-lg'>
                            <CodeEditor setValue={setReplyCode} height="20vh"
                                        defaultLanguage={comment.code && {
                                            name: comment.code.language,
                                            value: comment.code.sourceCode
                                        }}/>
                        </motion.div>
                    </AnimatePresence>

                }
                <Stack direction='row' alignItems='center'>
                    <TextInput
                        ref={replyRef}
                        className="w-full bg-gray-800 bg-opacity-50 border-none outline-none text-white py-5 px-4 rounded-xl text-base disabled:cursor-not-allowed"
                        placeholder='reply ...'
                        onChange={e => setNewReply(e.target.value)}
                    />
                    <PrimaryButton className='text-xs mx-1' disabled={newReply.length <= 0}
                                   onClick={() => handleReplySubmit(comment.id)}>
                        Submit
                    </PrimaryButton>

                    <Tooltip
                        title={`${showReplyCodeEditor ? "hide Code Editor" : "show Code Editor"}`}>
                        <IconButton className='!h-fit !text-white'
                                    onClick={() => setShowReplyCodeEditor(prevState => !prevState)}>
                            <Terminal/>
                        </IconButton>
                    </Tooltip>
                </Stack>

                <InputError message={errors.text} className="mt-2"/>
            </Stack>

    }

    const renderReplies = (comment: Comment) => {
        return (
            <List className='!flex-wrap'>
                {comment.replies && comment.replies.map((reply) => (
                    <div key={reply.id} className={`lg:ml-[10px]`}>
                        <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                                <Avatar alt={reply.user.name} src={'/' + reply.user.profile_image}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<span className='break-words'>{comment.user_id != reply.user_id && <span
                                    className='text-xs text-blue-400 px-1'>@{comment.user.name} </span>}{reply.text}</span>}
                                secondary={
                                    <span className="inline-flex items-center">
                                    <span className='font-bold text-white'>by {reply.user.name}</span>
                                    <span className='ml-1 text-xs text-gray-300'>
                                        <ReactTimeAgo date={Date.parse(reply.created_at)}/>
                                    </span>
                                        {reply.user_id === pulse.user_id && (
                                            <span className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                                            Author
                                        </span>
                                        )}
                                </span>
                                }
                            />

                            <IconButton className='!h-fit !text-white'
                                        onClick={() => {
                                            setCurrentReplyTargetId(reply.id == currentReplyTargetId ? -1 : reply.id);
                                        }}><ReplyIcon/></IconButton>
                            {reply.user_id === auth.user.id && (
                                <IconButton className='!h-fit !text-white'
                                            onClick={() => handleCommentDelete(reply.id)}>
                                    <Clear/>
                                </IconButton>
                            )}
                        </ListItem>
                        <Divider className='!bg-white'/>

                        {reply.code && (
                            <div className='p-3 overflow-auto'>
                                <CodeBlock code={reply.code}/>
                            </div>
                        )}
                        {renderReplies(reply)}
                        {replyForm(reply)}
                    </div>
                ))}
            </List>
        );
    };

    return (
        <AuthenticatedLayout user={auth.user} title={pulse.title}
                             header={<h2 className="font-semibold text-xl text-white leading-tight">{pulse.title}</h2>}>

            <Container
                className="rounded-2xl p-5 shadow-md w-9/12 bg-black/30 backdrop-blur-[8px]  text-white max-h-screen overflow-auto">

                <Card className='!bg-black/30 !text-white !rounded-2xl border-white border-2 '>
                    <CardHeader
                        avatar={<Avatar alt={pulse.user.name}
                                        src={pulse.user.profile_image && '/' + pulse.user.profile_image}/>}
                        title={
                            <span>
                     <Typography variant="h6">{pulse.title}</Typography>

                               <span
                                   className='text-xs'> <ReactTimeAgo
                                   date={Date.parse(pulse.created_at)}/></span>
                            </span>

                        }
                        action={
                            <div className='flex items-center gap-2'>
                                {
                                    pulse.user_id == auth.user.id &&
                                    <Link href={route('pulses.update', pulse.id)}
                                          className='text-white bg-gray-800 p-2 rounded-full hover:text-gray-800 hover:bg-gray-200 hover:rotate-12 duration-300 ease-in-out'><Edit/></Link>
                                }
                                <div className={`bg-gray-800 rounded-full`}>
                                    <LikeButton likes={likes} pulseId={pulse.id} authId={auth.user.id}/>
                                </div>
                            </div>

                        }
                    />
                    <CardContent>
                        <Typography variant="body1">{pulse.text}</Typography>
                    </CardContent>

                    {
                        pulse.code && <div className='p-3 overflow-auto'><CodeBlock code={pulse.code}/></div>
                    }


                </Card>
                <Divider variant="middle" style={{margin: '20px 0'}}/>
                <Typography variant="h6" gutterBottom>
                    Comments
                </Typography>
                {(comments.length > 0) ? (
                    <List className='!flex-wrap'>
                        {comments.map((comment: Comment, index: number) => (
                            <ListItem key={index} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt={comment.user.name} src={'/' + comment.user.profile_image}/>
                                </ListItemAvatar>
                                <Stack>
                                    <Stack direction='row' alignItems='center'>
                                        <div className='grid'>
                                            <div className='flex items-start'>
                                                <ListItemText className='max-w-2xl'
                                                              primary={<span
                                                                  className=' break-words'> {comment.text}</span>

                                                              }
                                                              secondary={
                                                                  <span>
                                                                      <span
                                                                          className='font-bold text-white'>by {comment.user.name}</span>
                                                                      <span
                                                                          className='ml-1 text-xs text-white'> <ReactTimeAgo
                                                                          date={Date.parse(comment.created_at)}/></span>
                                                                  </span>}
                                                />
                                            </div>


                                            {comment.code &&
                                                <div className='p-3 overflow-auto'><CodeBlock
                                                    code={comment.code}/>
                                                </div>}
                                        </div>
                                    </Stack>
                                    <Divider className='!bg-white'/>


                                    {renderReplies(comment)}
                                    {replyForm(comment)}

                                </Stack>
                                <IconButton className='!h-fit !text-white'
                                            onClick={() => {
                                                setCurrentReplyTargetId(comment.id == currentReplyTargetId ? -1 : comment.id);

                                            }}><ReplyIcon/></IconButton>
                                {comment.user_id === auth.user.id ? <IconButton className='!h-fit !text-white'
                                                                                onClick={() => handleCommentDelete(comment.id)}><Clear/></IconButton> : <></>
                                }


                            </ListItem>
                        ))}
                    </List>

                ) : (
                    <Typography variant="body2">Be the First One to Write a
                        Comments</Typography>
                )}
                <Box mt={2}>
                    <div className='flex justify-between items-center py-2'>
                        <Typography variant="h6" gutterBottom>
                            Write a Comment
                        </Typography>

                        <Tooltip title={`${showCommentCodeEditor ? "hide Code Editor" : "show Code Editor"}`}>
                            <IconButton className='!h-fit !text-white'
                                        onClick={() => setShowCommentCodeEditor(prevState => !prevState)}>
                                <Terminal/>
                            </IconButton>
                        </Tooltip>


                    </div>

                    {showCommentCodeEditor &&
                        <AnimatePresence>
                            <motion.div
                                initial={{opacity: 0, scale: 0.5, y: 50}}
                                animate={{opacity: 1, scale: 1, y: 0}}
                                exit={{opacity: 0, scale: 0.5, y: 50}}
                                transition={{type: 'spring', stiffness: 300, damping: 20}}

                                className='mb-4'>
                                <CodeEditor setValue={setCommentCode} height="20vh" defaultLanguage={pulse.code && {
                                    name: pulse.code.language,
                                    value: pulse.code.sourceCode
                                }}/>
                            </motion.div>
                        </AnimatePresence>
                    }
                    <TextInput
                        isTextArea={true}
                        ref={commentRef}
                        className="w-full bg-gray-800 bg-opacity-50 border-none outline-none text-white py-5 px-4 rounded-xl text-base disabled:cursor-not-allowed"
                        placeholder='comment ...'
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                    />


                    <InputError message={errors.text} className="mt-2"/>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <PrimaryButton
                            disabled={newComment.length == 0}
                            onClick={handleCommentSubmit}
                        >
                            Submit
                        </PrimaryButton>
                    </Box>
                </Box>
            </Container>
        </AuthenticatedLayout>
    );
};

export default Show;
