import React, {useState} from 'react';
import {Comment, PageProps, Post} from '@/types';
import {
    Avatar,
    Box,
    Button,
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
    TextField,
    Typography,
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import {Head, router, usePage} from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Clear} from "@mui/icons-material";
import Swal from "sweetalert2";
import InputError from "@/Components/InputError";
import {Errors} from "@inertiajs/inertia";
import {EditIcon} from "lucide-react";

const Show = ({post}: PageProps<{ post: Post }>) => {

    const {auth} = usePage<PageProps>().props;
    const [newComment, setNewComment] = useState('');
    const [errors, setErrors] = useState<Errors>(
        {
            text: "",
        }
    );
    const isAuthUser = post.user_id === auth.user.id;


    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    const handleCommentSubmit = () => {
        const newCommentObject: { post_id: number; user_id: number; author: string; text: string } = {
            text: newComment,
            user_id: auth.user.id,
            post_id: post.id,
            author: auth.user.name,
        };

        router.post(route('comment.store'), newCommentObject, {
            preserveScroll: true,
            onError: (err) => setErrors(err)
        });

        setNewComment('');
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
                    onError: (errors: any) => {
                        console.error(errors);
                    },
                })
            }
        })


    }


    return (
        <AuthenticatedLayout user={auth.user}
                             header={<h2 className="font-semibold text-xl text-white leading-tight">Posts</h2>}>
            <Head title={post.title}/>
            <IconButton><EditIcon/></IconButton>
            <Container className="rounded-xl p-5 shadow-md w-9/12" style={{backgroundColor: '#f5f5f5', color: '#333'}}>
                <Card style={{backgroundColor: '#fff', color: '#333'}}>
                    <CardHeader
                        avatar={<Avatar alt={post.user.name} src={'/' + post.user.profile_image}/>}
                        title={<Typography variant="h6" style={{color: '#333'}}>{post.title}</Typography>}
                        action={
                            <IconButton
                                onClick={() => router.post(route('like.store'), {'post_id': post.id}, {preserveScroll: true})}
                                className={`${post.likes.some(e => e.user_id === auth.user.id) ? '!text-blue-500' : ''} !h-12 !w-12`}
                                size='medium' aria-label="like">
                                <ThumbUpIcon/>
                                <Typography variant="body2" style={{marginLeft: '5px'}}>{post.likes.length}</Typography>
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <Typography variant="body1" style={{color: '#333'}}>{post.text}</Typography>
                    </CardContent>
                </Card>
                <Divider variant="middle" style={{margin: '20px 0'}}/>
                <Typography variant="h6" gutterBottom>
                    Comments
                </Typography>
                {(post.comments.length > 0) ? (
                    <List>
                        {post.comments.map((comment: Comment, index: number) => (
                            <ListItem key={index} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt={comment.user.name} src={'/' + comment.user.profile_image}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={comment.text}
                                    secondary={`by ${comment.user.name}`}
                                />
                                {comment.user_id === auth.user.id ? <IconButton
                                    onClick={() => handleCommentDelete(comment.id)}><Clear/></IconButton> : <></>}
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" style={{color: '#999'}}>Be the First One to Write a
                        Comments</Typography>
                )}
                <Box mt={2}>
                    <Typography variant="h6" gutterBottom>
                        Write a Comment
                    </Typography>
                    <TextField
                        label="Comment"
                        multiline
                        rows={4}
                        variant="outlined"
                        fullWidth
                        name='text'
                        value={newComment}
                        onChange={handleCommentChange}
                    />
                    <InputError message={errors.text} className="mt-2"/>
                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCommentSubmit}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Container>
        </AuthenticatedLayout>
    );
};

export default Show;
