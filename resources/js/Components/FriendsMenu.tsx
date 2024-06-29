import React from 'react';
import {Button, Menu, MenuItem} from "@mui/material";
import {Block, People, PersonRemove} from "@mui/icons-material";


const FriendsMenu = ({handleRemove, handleBlock}: any) => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button

                startIcon={<People/>}
                className={'!space-1 !text-white'}
                aria-controls="friends-menu"
                aria-haspopup="true"
                onClick={handleClick}

            >
                Friends
            </Button>
            <Menu
                id="friends-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem className='!text-xs !px-1 !flex gap-2'
                          onClick={handleRemove}>
                    <PersonRemove/>
                    Remove Friend
                </MenuItem>
                <MenuItem className='!text-xs !px-1 !flex gap-2 '
                          onClick={handleBlock}>
                    <Block/>
                    Block Friend
                </MenuItem>

            </Menu>
        </div>
    );
};

export default FriendsMenu;
