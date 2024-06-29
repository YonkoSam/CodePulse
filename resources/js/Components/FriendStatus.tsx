import React from 'react';
import {Avatar, Badge, Stack, Typography, useTheme} from '@mui/material';
import {styled} from '@mui/system';

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

const FriendStatus = ({friend}) => {
    const theme = useTheme(); // Access the theme using useTheme hook
    return (
        <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <OnlineBadge
                overlap="circular"
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                variant="dot"
                classes={{dot: friend.online ? 'online' : 'offline'}}
                theme={theme}
            >
                <Avatar src={`/${friend.profile_image}`}/>
            </OnlineBadge>
            <Typography variant="body2" className="font-semibold">{friend.name}</Typography>
        </Stack>
    );
};

export default FriendStatus;
