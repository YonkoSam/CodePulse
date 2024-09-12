import React, { useState } from "react";
import { Cancel, Check, Close, PersonAdd } from "@mui/icons-material";
import { Button } from "@mui/material";
import { iconStyle, Toast } from "@/utils";
import { router, usePage } from "@inertiajs/react";
import axios from "axios";
import { PageProps } from "@/types";

const FriendRequestStatus = {
    SENT: 1,
    RECEIVED: 2,
};

const FriendRequestButton = ({ friendRequest, userId }) => {
    const { auth } = usePage<PageProps>().props;
    const [requestId, setRequestId] = useState(
        friendRequest?.requestId || null
    );
    const [status, setStatus] = useState(friendRequest?.requestStatus || null);
    const [loading, setLoading] = useState(false);

    const onSendRequest = async () => {
        try {
            const response = await axios.post(route("friend.request.send"), {
                sender_id: auth.user.id,
                receiver_id: userId,
            });
            Toast.fire({
                icon: "success",
                title: "Friend request sent successfully",
            });

            setStatus(FriendRequestStatus.SENT);
            if (response.data && response.data.requestId) {
                setRequestId(response.data.requestId);
            }
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: `${
                    error.response?.data?.message || "Error sending request"
                }`,
            });
        }
    };

    const handleAction = async (action) => {
        setLoading(true);
        try {
            switch (action) {
                case "send":
                    await onSendRequest();
                    break;
                case "accept":
                case "reject":
                case "cancel":
                    await axios.post(route(`friend.request.${action}`), {
                        request_id: requestId,
                    });
                    Toast.fire({
                        icon: "success",
                        title: `Friend request ${action}ed!`,
                    });
                    setStatus(null);
                    router.reload({ only: ["isFriend"] });
                    break;
                default:
                    throw new Error("Invalid action");
            }
        } catch (error) {
            Toast.fire({
                icon: "error",
                title:
                    error.response?.data?.message ||
                    `Error ${action}ing friend request`,
            });
        } finally {
            setLoading(false);
        }
    };

    let buttonContent:
        | string
        | number
        | boolean
        | JSX.Element
        | Iterable<React.ReactNode>;
    switch (status) {
        case FriendRequestStatus.SENT:
            buttonContent = (
                <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<Cancel />}
                    onClick={() => handleAction("cancel")}
                    disabled={loading}
                    className="transition-all duration-300 hover:bg-red-500 hover:text-white"
                >
                    {loading ? "Canceling..." : "Cancel Request"}
                </Button>
            );
            break;
        case FriendRequestStatus.RECEIVED:
            buttonContent = (
                <div className="flex space-x-2">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Check />}
                        onClick={() => handleAction("accept")}
                        disabled={loading}
                        className="transition-all duration-300 hover:bg-green-600"
                    >
                        {loading ? "Accepting..." : "Accept"}
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Close />}
                        onClick={() => handleAction("reject")}
                        disabled={loading}
                        className="transition-all duration-300 hover:bg-red-500 hover:text-white"
                    >
                        {loading ? "Declining..." : "Decline"}
                    </Button>
                </div>
            );
            break;
        default:
            buttonContent = (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAdd />}
                    onClick={() => handleAction("send")}
                    disabled={loading}
                    className="transition-all duration-300 hover:bg-blue-600"
                >
                    {loading ? "Sending..." : "Send Request"}
                </Button>
            );
    }

    return <div>{buttonContent}</div>;
};
export default FriendRequestButton;
