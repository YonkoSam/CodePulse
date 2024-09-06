import React from 'react';
import {Avatar, Badge, Stack, Typography, useTheme} from '@mui/material';
import {styled} from '@mui/system';
import ReactTimeAgo from "react-time-ago";

const OnlineBadge = styled(Badge)(({theme}) => ({
    '& .MuiBadge-dot': {
        height: 12,
        minWidth: 12,
        borderRadius: '50%',
        border: `2px solid ${theme.palette.background.paper || 'white'}`, // Ensure a fallback color
    },
    '& .online': {
        backgroundColor: '#44b700',
    },
    '& .offline': {
        backgroundColor: '#f44336',
    }
}));

const FriendStatus = ({friend, enableBadge = true}) => {
    const theme = useTheme();
    return (
        friend && (
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                {enableBadge ? (
                    <OnlineBadge
                        overlap="circular"
                        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                        variant="dot"
                        classes={{dot: friend.online ? 'online' : 'offline'}}
                        theme={theme}
                    >
                        <Avatar src={friend.profile_image ? `/${friend.profile_image}` : ''}/>
                    </OnlineBadge>
                ) : (
                    <Avatar src={friend.profile_image ? `/${friend.profile_image}` : ''}/>
                )}

                <Stack spacing={0.5}>
                    <Typography variant="body2" className="font-semibold text-white">
                        {friend.name}
                    </Typography>

                    {!friend.online && friend.last_activity && (
                        <Typography variant="caption" color="white">
                            Last seen <ReactTimeAgo date={new Date(friend.last_activity)}/>
                        </Typography>
                    )}
                </Stack>
            </Stack>
        ))
};

export default FriendStatus;
