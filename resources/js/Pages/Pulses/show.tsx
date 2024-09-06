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
    Stack,
    Tooltip,
    Typography
} from '@mui/material';

import {Link, router, usePage} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Edit, QuestionMark, Report, Terminal} from "@mui/icons-material";
import Swal from "sweetalert2";
import InputError from "@/Components/formComp/InputError";
import {Errors} from "@inertiajs/inertia";
import CodeBlock from "@/Components/codeComp/CodeBlock";
import CodeEditor from "@/Components/codeComp/CodeEditor";
import ReactTimeAgo from "react-time-ago";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import {AnimatePresence, motion} from "framer-motion";
import LikeButton from "@/Components/pulseComp/LikeButton";
import TextInput from "@/Components/formComp/TextInput";
import CommentSection from "@/Components/pulseComp/Comment";
import {iconStyle, Toast} from "@/utils";
import Pagination from "@/Components/genralComp/Pagination";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'github-markdown-css/github-markdown-dark.css'
import ReportForm from "@/Components/ReportForm";

const Show = ({pulse, comments, likes}: PageProps<{ pulse: Pulse, comments: any, likes: Like[] }>) => {
    const {auth} = usePage<PageProps>().props;
    const [newComment, setNewComment] = useState('');
    const [currentReplyTargetId, setCurrentReplyTargetId] = useState(-1);
    const [newReply, setNewReply] = useState('');
    const [showCommentCodeEditor, setShowCommentCodeEditor] = useState(false);
    const [showReplyCodeEditor, setShowReplyCodeEditor] = useState(false);
    const [commentCode, setCommentCode] = useState({sourceCode: '', language: '',});
    const [replyCode, setReplyCode] = useState({sourceCode: '', language: '',});
    const [openReportForm, setOpenReportForm] = useState(false)

    const replyRef = useRef(null);
    const commentRef = useRef(null);

    const canMarkAsBestAnswer = auth.user.id == pulse.user_id && !pulse.is_answered;

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

    const handleMarkAsBestAnswer = (pulseId: number, commentId: number) => {
        router.put(route('pulses.best-answer', {pulse: pulseId, comment: commentId}), {},
            {
                preserveState: false,
                onSuccess: () => {
                    Toast.fire({
                        title: 'comment marked as best answer successfully',
                        icon: 'success',
                    })
                },
                onError: (err) => setErrors(err)

            }
        )

    }
    const handleUpdate = async (commentId: number, text: string) => {

        setErrors({
            text: "",
        });
        router.patch(route('comment.update', commentId), {text}, {
            preserveScroll: true,
            only: ['comments'],
            onSuccess: () => {
                Toast.fire({
                    icon: 'success',
                    text: 'comment updated successfully'
                });
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
            <Stack marginY={2}>
                {showReplyCodeEditor &&
                    <AnimatePresence>
                        <motion.div
                            initial={{opacity: 0, scale: 0.5, y: 50}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.5, y: 50}}
                            transition={{type: 'spring', stiffness: 300, damping: 20}}
                            className='my-4 max-w-screen-lg'>
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
                        onChange={(e: {
                            target: { value: React.SetStateAction<string>; };
                        }) => setNewReply(e.target.value)}
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

    const renderReplies = (comment: Comment, showReplies = false) => {
        return <AnimatePresence>
            {showReplies && comment.replies.length > 0 && comment.replies.map((reply, i) => (
                    <motion.div
                        initial={{y: -50, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        exit={{y: -50, opacity: 0}}
                        transition={{duration: 0.3, delay: i * 0.1}}

                        key={reply.id} className='mt-5'>
                        <CommentSection comment={reply} setReplyId={setCurrentReplyTargetId}
                                        handleCommentDelete={handleCommentDelete} renderReplyForm={replyForm}
                                        renderReplies={renderReplies}
                                        handleUpdate={handleUpdate}
                                        canMarkAsBestAnswer={canMarkAsBestAnswer}
                                        markAsBestAnswer={handleMarkAsBestAnswer}
                        />
                    </motion.div>
                )
            )}

        </AnimatePresence>

    };

    return (
        <AuthenticatedLayout user={auth.user} title={pulse.title}
                             header={<h2 className="font-semibold text-xl text-white leading-tight">{pulse.title}</h2>}>
            <ReportForm reportableId={pulse.id} setOpen={setOpenReportForm} open={openReportForm}
                        reportableType='App\Models\Pulse'/>

            <Container
                className="rounded-2xl p-5 shadow-md w-9/12 bg-black/30  text-white max-h-screen overflow-auto">

                <Card className='!bg-black/30 !text-white !rounded-2xl'>
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
                                    pulse.user_id == auth.user.id ?
                                        <Link href={route('pulses.update', pulse.id)}
                                              className='text-white bg-gray-800 p-2 rounded-full hover:text-gray-800 hover:bg-gray-200 hover:rotate-12 duration-300 ease-in-out'><Edit/></Link>
                                        : <Tooltip title={'report this pulse'}>
                                            <IconButton onClick={() => setOpenReportForm(true)}>
                                                <Report className={iconStyle}/>
                                            </IconButton>
                                        </Tooltip>
                                }

                                <LikeButton likes={likes} pulseId={pulse.id} authId={auth.user.id}/>
                            </div>

                        }
                    />
                    <CardContent className='markdown-body !bg-black/30'>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}
                                       className='font-jetBrains'
                        >{pulse.text}</ReactMarkdown>
                    </CardContent>

                    {
                        pulse.code && <div className='p-3 overflow-auto'><CodeBlock code={pulse.code}/></div>
                    }


                </Card>
                <Divider className='bg-white !my-5'/>
                <Typography variant="h6" gutterBottom>
                    Comments {comments.total > 0 && `(${comments.total})`}
                </Typography>
                {(comments.data?.length > 0) ? (
                    <List className='!flex-wrap'>
                        {comments.data.map((comment: Comment, index: number) => (
                            <ListItem key={index}>
                                <CommentSection comment={comment}
                                                handleCommentDelete={handleCommentDelete}
                                                setReplyId={setCurrentReplyTargetId}
                                                renderReplies={renderReplies}
                                                renderReplyForm={replyForm}
                                                handleUpdate={handleUpdate}
                                                canMarkAsBestAnswer={canMarkAsBestAnswer}
                                                markAsBestAnswer={handleMarkAsBestAnswer}

                                />
                            </ListItem>
                        ))}

                        {comments.last_page != 1 && <Pagination currentPage={comments.current_page}
                                                                lastPage={comments.last_page}
                                                                paginatedDataName={'comments'}/>}
                    </List>


                ) : (
                    <Typography variant="body2">Be the First One to Write a
                        Comments</Typography>
                )}
                <Box mt={2}>
                    <div className='flex justify-between items-center py-2 '>
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
                    <div className="relative">

                        <TextInput
                            isTextArea={true}
                            ref={commentRef}
                            className="w-full bg-gray-800 bg-opacity-50 border-none outline-none text-white py-5 px-4 rounded-xl text-base disabled:cursor-not-allowed"
                            placeholder="Comment... (Markdown supported)"
                            value={newComment}
                            onChange={(e: {
                                target: { value: React.SetStateAction<string>; };
                            }) => setNewComment(e.target.value)}
                        />
                        <Tooltip
                            title={<span>Markdown is supported. You can use **bold**, *italic*, \`code\`, etc.
                                <br/> you can learn more <a
                                    title={'Markdown Getting Started'}
                                    href='https://www.markdownguide.org/getting-started/'
                                    target='_blank'>here</a> </span>}>
                            <div className="absolute right-3 top-3 text-gray-400 hover:text-white cursor-help">
                                <QuestionMark style={{fontSize: 20}}/>
                            </div>
                        </Tooltip>
                        <div className="text-xs text-gray-400 mt-1">
                            Tip: You can use Markdown syntax in your comment.
                        </div>
                    </div>


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
