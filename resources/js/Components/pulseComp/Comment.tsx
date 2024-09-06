import React, {useEffect, useRef, useState} from 'react';
import ReactTimeAgo from "react-time-ago";
import {ChevronDown, MenuIcon, PencilIcon, Star, TrashIcon} from "lucide-react";
import {Avatar, Chip, IconButton, Menu, MenuItem} from "@mui/material";
import CodeBlock from "@/Components/codeComp/CodeBlock";
import {Link, usePage} from "@inertiajs/react";
import {PageProps} from "@/types";
import TextInput from "@/Components/formComp/TextInput";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import ReportForm from "@/Components/ReportForm";
import {Report} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SecondaryButton from "@/Components/formComp/SecondaryButton";
import {getLevel} from "@/utils";
import LikeButton from "@/Components/pulseComp/LikeButton";

const CommentSection = ({
                            comment,
                            handleCommentDelete,
                            setReplyId,
                            renderReplies,
                            renderReplyForm,
                            handleUpdate,
                            markAsBestAnswer,
                            canMarkAsBestAnswer
                        }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [showReplies, setShowReplies] = useState(false);
    const [editComment, setEditComment] = useState(false);
    const [openReportForm, setOpenReportForm] = useState(false);

    const [updatedComment, setUpdatedComment] = useState(comment.text)
    const open = Boolean(anchorEl);
    const {auth} = usePage<PageProps>().props;
    const textBoxRef = useRef(null);

    const isAuthUser = auth.user.id == comment.user_id;
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleReport = () => {
        setAnchorEl(null);
        setOpenReportForm(true);
    }
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        setAnchorEl(null);
        if (textBoxRef.current && editComment) {
            textBoxRef.current.focus();
        }
    }, [editComment, textBoxRef.current]);

    const {
        user: {profile_image, name, profile},
        text,
        created_at,
        updated_at,
        is_best_answer
    } = comment;

    const {
        id: profile_id = null,
        xp = null
    } = profile || {};

    return (

        <article className="p-4 mb-1  text-base bg-black/30 w-full rounded-3xl">
            <ReportForm open={openReportForm} setOpen={setOpenReportForm} reportableType='App\Models\Comment'
                        reportableId={comment.id}/>

            <footer className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <div className="inline-flex items-center mr-2 text-sm text-white font-semibold">
                        {
                            profile_id ? <Link className={'text-white'} href={route('profiles.show', profile_id)}>
                                    <Avatar
                                        className="mr-2 w-6 h-6 rounded-full"
                                        src={'/' + profile_image}
                                        alt={name}
                                    />
                                </Link> :
                                <Avatar
                                    className="mr-2 w-6 h-6 rounded-full"
                                    src={'/' + profile_image}
                                    alt={name}
                                />
                        }
                        <div className="flex flex-col">
                            <span>{name}</span>

                            {
                                xp && <span className='text-xs font-light font-jetBrains'>
                        Level {getLevel(xp)}
                    </span>
                            }
                        </div>


                    </div>
                    <span className={`text-sm text-gray-400 ${xp && 'mb-auto'}`}>
                        <ReactTimeAgo date={Date.parse(created_at)}/>
                        {
                            created_at != updated_at && ' (edited)'
                        }
                    </span>

                </div>

                <div className='flex items-center gap-1'>
                    <LikeButton likes={comment.likes} commentId={comment.id} authId={auth.user.id}
                                pulseId={comment.pulse_id}/>
                    {
                        !!is_best_answer && <Chip label='Best Answer' color='success'/>
                    }
                    <IconButton
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        className='!text-white'
                    >
                        <MenuIcon/>
                    </IconButton>

                </div>


                <Menu
                    id='basic-menu'
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                    className='!z-50'
                >
                    {canMarkAsBestAnswer &&
                        <MenuItem onClick={() => markAsBestAnswer(comment.pulse_id, comment.id)}><Star
                            className=' mr-2'/>Mark as Best
                            Answer</MenuItem>}
                    {isAuthUser ? [
                            <MenuItem key={1} onClick={() => setEditComment(prevState => !prevState)}><PencilIcon size={20}
                                                                                                                  className='mr-2'/>Edit</MenuItem>,
                            <MenuItem key={2} onClick={() => handleCommentDelete(comment.id)}><TrashIcon size={20}
                                                                                                         className='mr-2'/> Delete</MenuItem>
                        ]
                        :

                        <MenuItem onClick={handleReport}><Report className=' mr-2'/>Report</MenuItem>


                    }


                </Menu>
            </footer>
            {editComment ?
                <div className='flex !text-xs items-center gap-2'>
                    <TextInput ref={textBoxRef} value={updatedComment}
                               onChange={(e) => setUpdatedComment(e.target.value)}/>

                    <SecondaryButton
                        onClick={() => {
                            setEditComment(false)
                            setShowReplies(true)
                        }}>Cancel</SecondaryButton>
                    <PrimaryButton
                        onClick={() => handleUpdate(comment.id, updatedComment).then(() => {
                            setEditComment(false)
                            setShowReplies(true)
                        })}>Submit</PrimaryButton>
                </div>
                :
                <div className="markdown-body  !bg-transparent !text-sm text-gray-200 ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}
                                   components={{
                                       code(props) {
                                           const {children, className, node, ...rest} = props
                                           const match = /language-(\w+)/.exec(className || '')
                                           return match ? (
                                               <CodeBlock code={{
                                                   language: match[1],
                                                   sourceCode: String(children).replace(/\n$/, '')
                                               }}
                                               />
                                           ) : (
                                               <code {...rest} className={className}>
                                                   {children}
                                               </code>
                                           )
                                       }
                                   }}

                                   className='font-jetBrains'
                    >{text}</ReactMarkdown>
                    {
                        comment.code && <div className='p-3 overflow-auto'><CodeBlock code={comment.code}/></div>
                    }
                </div>
            }

            <div className="flex items-center mt-4 space-x-4">
                {!editComment && <button
                    type="button"
                    className="flex items-center text-sm hover:underline text-gray-400 font-medium"
                    onClick={() => setReplyId(prev => prev == comment.id ? null : comment.id)}
                >
                    <svg
                        className="mr-1.5 w-3.5 h-3.5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 18"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 5h5M5 8h2m6-3h2m-5 3h6m2-7H2a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h3v5l5-5h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                        />
                    </svg>
                    Reply
                </button>}
                {comment.replies.length > 0 &&
                    <button onClick={() => setShowReplies(prevState => !prevState)}
                            type="button"
                            className="flex items-center text-sm hover:underline text-gray-400 font-medium"
                    >
                        <ChevronDown/>
                        View {comment.replies.length} {comment.replies.length == 1 ? 'reply' : 'replies'}
                    </button>}
            </div>

            {renderReplies(comment, showReplies)}

            {renderReplyForm(comment)}

        </article>
    );
};


export default CommentSection;
