import React from 'react';
import {PageProps, Post} from "@/types";
import Avatar from "../../assets/images/default-avatar.svg";
import {format} from 'date-fns';
import {Link, router, usePage} from "@inertiajs/react";
import {Avatar as MuiAvatar, Box, Card, CardContent, CardHeader, IconButton, Typography} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';

const PostCard = ({post}: PageProps<{ post: Post }>) => {

    const {auth} = usePage<PageProps>().props;

    return (
        <Card className="!shadow-2xl !rounded-2xl !bg-black/30" style={{color: '#333'}}>

            <CardHeader
                avatar={
                    <MuiAvatar src={post.user.profile_image ? '/' + post.user.profile_image : Avatar}
                               alt={post.user.name}/>
                }
                title={<Typography variant="h6" style={{color: '#fff'}}>{post.user.name}</Typography>}
                subheader={<Typography variant="body2"
                                       style={{color: '#fff'}}>{format(new Date(post.created_at), 'PPP')}</Typography>}
            />
            <CardContent className='!flex !flex-col !justify-between !min-h-60 !max-h-60'>

                <Link href={route('posts.show', post.id)} style={{textDecoration: 'none'}}>
                    <Typography variant="h5" style={{color: '#fff', fontWeight: 'bold'}}
                                className='line-clamp-1'>{post.title}</Typography>
                    <Typography variant="body1" style={{color: '#fff'}}
                                className='line-clamp-5'>{post.text}</Typography>
                </Link>

                <Box mt={2} display="flex" justifyContent="space-between">
                    <IconButton
                        onClick={() => router.post(route('like.store'), {'post_id': post.id}, {preserveScroll: true})}
                        style={{color: post.likes.some(e => e.user_id === auth.user.id) ? '#1976d2' : '#fff'}}
                    >
                        <ThumbUpIcon/>
                        <Typography variant="body2" style={{marginLeft: '5px'}}>{post.likes.length}</Typography>
                    </IconButton>
                    <Link href={route('posts.show', post.id)} style={{textDecoration: 'none', color: '#fff'}}>
                        <IconButton className='!text-white'>
                            <CommentIcon/>
                            <Typography variant="body2" style={{marginLeft: '5px'}}>{post.comments.length}</Typography>
                        </IconButton>
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
};

export default PostCard;
