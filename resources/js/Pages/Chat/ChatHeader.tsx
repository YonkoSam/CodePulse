import React, {useCallback, useState} from 'react';
import {Divider, IconButton, Menu, MenuItem} from "@mui/material";
import {MoreVert, People} from "@mui/icons-material";
import FriendStatus from "@/Pages/Friends/FriendStatus";
import ReportForm from "@/Components/ReportForm";
import {router} from "@inertiajs/react";
import Swal from "sweetalert2";
import {Toast} from "@/utils";

const BLOCK_CONFIRMATION_TEXT = (firstName) => `
    <div class="text-left">
        <p>Neither of you will be able to:</p>
        <ul class="list-disc list-inside ml-4 mt-2">
            <li>See each other's pulses or comments</li>
            <li>Message each other</li>
            <li>See each other's profiles</li>
        </ul>
        <p class="mt-4">Blocking <strong>${firstName}</strong> will also unfriend them.</p>
    </div>
`;

const ChatHeader = ({receiver, team, isBlockInitiator}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [isReportOpen, setReportOpen] = useState(false);

    const isMenuOpen = Boolean(anchorEl);

    const handleMenuOpen = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleBlock = useCallback(() => {
        const firstName = receiver?.name?.split(' ')[0];
        Swal.fire({
            title: `Block ${receiver.name}?`,
            html: BLOCK_CONFIRMATION_TEXT(firstName),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#1e40af",
            cancelButtonColor: "#57534e",
            confirmButtonText: "Yes, block!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('friend.block', {friend: receiver.id}), {
                    onSuccess: () => {
                        Toast.fire({
                            icon: "success",
                            title: "Friend was blocked successfully",
                        });
                    },
                    onError: (errors) => {
                        Toast.fire({
                            icon: "error",
                            title: errors.message,
                        });
                    },
                });
            }
        });
    }, [receiver]);

    return (
        <>
            {receiver && (
                <ReportForm
                    reportableType="App\Models\Profile"
                    reportableId={receiver.profile?.id}
                    setOpen={setReportOpen}
                    open={isReportOpen}
                />
            )}
            {team && (
                <ReportForm
                    reportableType="App\Models\Team"
                    reportableId={team.id}
                    setOpen={setReportOpen}
                    open={isReportOpen}
                />
            )}

            <div className=" text-white rounded-2xl p-2">
                <div className="flex items-start px-2 justify-between">
                    {receiver ? (
                        <FriendStatus friend={receiver} enableBadge={!isBlockInitiator}/>
                    ) : (
                        team && (
                            <div className="flex items-center gap-2 px-4 py-2 text-lg font-medium">
                                <People/>
                                <p className="text-white">{team.name}</p>
                            </div>
                        )
                    )}

                    {

                        !isBlockInitiator &&
                        <>
                            <IconButton
                                aria-label="more"
                                aria-controls={isMenuOpen ? 'menu' : undefined}
                                aria-expanded={isMenuOpen ? 'true' : undefined}
                                aria-haspopup="true"
                                className="!text-white"
                                onClick={handleMenuOpen}
                            >
                                <MoreVert/>
                            </IconButton>
                            <Menu
                                id="menu"
                                anchorEl={anchorEl}
                                open={isMenuOpen}
                                onClose={handleMenuClose}
                            >
                                {receiver && (
                                    [
                                        <MenuItem
                                            key={1}
                                            onClick={() => router.visit(route('profiles.show', receiver.profile?.id))}
                                            className="!text-sm"
                                        >
                                            Show
                                        </MenuItem>,
                                        <MenuItem
                                            key={2}
                                            onClick={() => {
                                                handleMenuClose();
                                                handleBlock();
                                            }}
                                            className="!text-sm"
                                        >
                                            Block
                                        </MenuItem>

                                    ]

                                )}


                                <MenuItem
                                    onClick={() => {
                                        setReportOpen(true);
                                        handleMenuClose();
                                    }}
                                    className="!text-sm"
                                >
                                    Report
                                </MenuItem>
                            </Menu>
                        </>
                    }


                </div>

                <Divider className="bg-white/40 "/>
            </div>
        </>
    );
};

export default ChatHeader;
