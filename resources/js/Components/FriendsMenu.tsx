import React from 'react';
import {Button, Menu, MenuItem} from "@mui/material";
import {People, PersonRemove} from "@mui/icons-material";


const FriendsMenu = ({callback}: any) => {
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
                <MenuItem className='!text-xs !px-1'
                          onClick={callback}>
                    <PersonRemove/>
                    Remove Friend
                </MenuItem>
            </Menu>
        </div>
    );
};

export default FriendsMenu;
