import React from 'react';
import {PageProps, Pulse} from "@/types";
import {format} from 'date-fns';
import {Link, usePage} from "@inertiajs/react";
import {Avatar, Box, Card, CardContent, CardHeader, Chip, IconButton, Typography} from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import {spanStyle} from "@/utils";
import LikeButton from "@/Components/pulseComp/LikeButton";
import {motion} from "framer-motion";


const PulseCard = ({pulse}: { pulse: Pulse }) => {

    const {auth} = usePage<PageProps>().props;

    return (
        <Card
            component={motion.div}
            layout
            className="!shadow-2xl !rounded-2xl !bg-black/30 !border-white border-2" style={{color: '#333'}}>
            <CardHeader
                avatar={
                    <Avatar src={pulse.user.profile_image && '/' + pulse.user.profile_image}
                            alt={pulse.user.name}/>
                }
                title={<Typography variant="h6" style={{color: '#fff'}}>{pulse.user.name}</Typography>}
                subheader={
                    <span className='flex items-center gap-2 h-7'>
                        <Typography variant="body2"
                                    style={{color: '#fff'}}>{format(new Date(pulse.created_at), 'PPP')}</Typography>
                        {pulse.language &&
                            <Link href={route('pulses.tags', pulse.language)}>
                                <Chip
                                    label={<span className={spanStyle}>{pulse.language}</span>}
                                    className='!text-white !text-xs font-bold '/>
                            </Link>}
                    </span>
                }
            />
            <CardContent className='!flex !flex-col !justify-between min-h-60'>

                <Link href={route('pulses.show', pulse.id)} style={{textDecoration: 'none'}}>
                    <Typography variant="h5" style={{color: '#fff', fontWeight: 'bold'}}
                                className='line-clamp-1'>{pulse.title}</Typography>
                    <Typography variant="body1" style={{color: '#fff'}}
                                className='line-clamp-4'>{pulse.text}</Typography>
                </Link>

                <Box mt={2} display="flex" justifyContent="space-between">

                    <LikeButton likes={pulse.likes} pulseId={pulse.id} authId={auth.user.id}/>

                    <Link href={route('pulses.show', pulse.id)} style={{textDecoration: 'none', color: '#fff'}}>
                        <IconButton
                            className='!text-white hover:scale-110 duration-300 ease-in-out '>
                            <CommentIcon/>
                            <Typography variant="body2"
                                        style={{marginLeft: '5px'}}>{pulse.comments_count}</Typography>
                        </IconButton>
                    </Link>


                </Box>
            </CardContent>
        </Card>
    );
};

export default PulseCard;
