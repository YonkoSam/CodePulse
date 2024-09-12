import { Button, CircularProgress, IconButton, Stack } from "@mui/material";
import MarkChatReadIcon from "@mui/icons-material/MarkChatRead";
import { Link, router } from "@inertiajs/react";
import React from "react";
import { Toast } from "@/utils";
import { Notification, User } from "@/types";
import axios from "axios";
import { format } from "date-fns";
import showNotificationWithSound from "@/utils/notificationApi";

const renderNotificationActions = (
    notification: Notification,
    setNotifications = null,
    loading,
    setLoading
) => {
    const markAsRead = (id: string) => {
        setLoading({ id, type: "markAsRead" });
        axios
            .patch(route("notifications.markAsRead"), { id })
            .then(() => {
                if (setNotifications) {
                    setNotifications((prev) =>
                        prev.map((notf) => {
                            if (notf.id === id) {
                                return {
                                    ...notf,
                                    read_at: format(
                                        new Date(),
                                        "yyyy-MM-dd HH:mm:ss"
                                    ),
                                };
                            }
                            return notf;
                        })
                    );
                } else {
                    fetchNotifications();
                }
            })
            .catch((error) => {
                console.error("Error marking notification as read:", error);
            })
            .finally(() => {
                setLoading({ id: null, type: null });
            });
    };

    const markAsReadLocal = (id: string, status: string) => {
        if (setNotifications) {
            setNotifications((prev) =>
                prev.map((notf) => {
                    if (notf.id === id) {
                        return {
                            ...notf,
                            data: {
                                ...notf.data,
                                message: `Friend request ${status}`,
                            },
                            read_at: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        };
                    }
                    return notf;
                })
            );
        }
    };

    const rejectRequest = (id: string, requestId: number) => {
        setLoading({ id, type: "rejectRequest" });
        axios
            .post(route("friend.request.reject"), { request_id: requestId })
            .then(() => {
                Toast.fire({
                    icon: "success",
                    title: "Friend request rejected successfully",
                });
                markAsReadLocal(id, "rejected");
            })
            .catch(() => {
                Toast.fire({
                    icon: "error",
                    title: "Error rejecting friend request",
                });
            })
            .finally(() => {
                setLoading({ id: null, type: null });
            });
    };

    const acceptRequest = (id: string, requestId: number) => {
        setLoading({ id, type: "acceptRequest" });
        axios
            .post(route("friend.request.accept"), { request_id: requestId })
            .then(() => {
                Toast.fire({
                    icon: "success",
                    title: "Friend request accepted!",
                });
                markAsReadLocal(id, "accepted");
                router.reload({ only: ["isFriend"] });
            })
            .catch((error) => {
                Toast.fire({
                    icon: "error",
                    title:
                        error.response?.data?.message ||
                        "Error accepting friend request",
                });
            })
            .finally(() => {
                setLoading({ id: null, type: null });
            });
    };

    const acceptInvite = (id: string, acceptToken: string) => {
        setLoading({ id, type: "acceptInvite" });
        axios
            .get(route("teams.accept_invite", acceptToken))
            .then(() => {
                Toast.fire({
                    icon: "success",
                    title: "Invite accepted!",
                });
                markAsRead(id);
            })
            .catch((error) => {
                Toast.fire({
                    icon: "error",
                    title:
                        error.response?.data?.message ||
                        "Error accepting invite",
                });
            })
            .finally(() => {
                setLoading({ id: null, type: null });
            });
    };

    const rejectInvite = (id: string, denyToken: string) => {
        setLoading({ id, type: "rejectInvite" });
        axios
            .get(route("teams.deny_invite", denyToken))
            .then(() => {
                Toast.fire({
                    icon: "success",
                    title: "Invite denied!",
                });
                markAsRead(id);
            })
            .catch((error) => {
                Toast.fire({
                    icon: "error",
                    title:
                        error.response?.data?.message || "Error denying invite",
                });
            })
            .finally(() => {
                setLoading({ id: null, type: null });
            });
    };

    const isLoading = loading.id === notification.id;
    switch (notification.type) {
        case "App\\Notifications\\FriendRequestNotification":
            return (
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() =>
                            acceptRequest(
                                notification.id,
                                notification.data.request_id
                            )
                        }
                        disabled={isLoading && loading.type === "acceptRequest"}
                    >
                        {isLoading && loading.type === "acceptRequest" ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Accept"
                        )}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() =>
                            rejectRequest(
                                notification.id,
                                notification.data.request_id
                            )
                        }
                        disabled={isLoading && loading.type === "rejectRequest"}
                    >
                        {isLoading && loading.type === "rejectRequest" ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Reject"
                        )}
                    </Button>
                </Stack>
            );
        case "App\\Notifications\\TeamInviteNotification":
            return (
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() =>
                            acceptInvite(
                                notification.id,
                                notification.data.accept_token
                            )
                        }
                        disabled={isLoading && loading.type === "acceptInvite"}
                    >
                        {isLoading && loading.type === "acceptInvite" ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Accept"
                        )}
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() =>
                            rejectInvite(
                                notification.id,
                                notification.data.deny_token
                            )
                        }
                        disabled={isLoading && loading.type === "rejectInvite"}
                    >
                        {isLoading && loading.type === "rejectInvite" ? (
                            <CircularProgress size={24} />
                        ) : (
                            "Reject"
                        )}
                    </Button>
                </Stack>
            );
        case "App\\Notifications\\CommentNotification":
        case "App\\Notifications\\ReplyNotification":
        case "App\\Notifications\\MarkedAsBestAnswerNotification":
        case "App\\Notifications\\LikeNotification":
            return (
                <Stack direction="row" alignItems="center">
                    <IconButton
                        onClick={() => markAsRead(notification.id)}
                        disabled={isLoading && loading.type === "markAsRead"}
                    >
                        {isLoading && loading.type === "markAsRead" ? (
                            <CircularProgress size={24} />
                        ) : (
                            <MarkChatReadIcon color="primary" />
                        )}
                    </IconButton>
                    <Link
                        href={`${notification.data.url}?markAsRead=${notification.id}`}
                    >
                        <Button
                            variant="contained"
                            onClick={() => markAsRead(notification.id)}
                            size="small"
                            disabled={
                                isLoading && loading.type === "markAsRead"
                            }
                        >
                            {isLoading && loading.type === "markAsRead" ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Visit"
                            )}
                        </Button>
                    </Link>
                </Stack>
            );
        case "App\\Notifications\\FriendRequestStatus":
            return (
                <IconButton
                    onClick={() => markAsRead(notification.id)}
                    disabled={isLoading && loading.type === "markAsRead"}
                >
                    {isLoading && loading.type === "markAsRead" ? (
                        <CircularProgress size={24} />
                    ) : (
                        <MarkChatReadIcon color="primary" />
                    )}
                </IconButton>
            );
        default:
            return null;
    }
};
const fetchNotifications = () => {
    router.reload({ only: ["notifications", "unreadNotificationsCount"] });
};
const handleDelete = async (id: number, shouldRefresh = true) => {
    axios
        .delete(
            route("notifications.destroy", {
                id: id,
            })
        )
        .then((r) => {
            Toast.fire({
                icon: "success",
                text: r.data.message,
            });
            shouldRefresh && fetchNotifications();
        })
        .catch((e) => {
            Toast.fire({
                icon: "error",
                text: e.message,
            });
        });
};

const listenForEvent = (user: User, onNotificationReceived = null) => {
    window.Echo.channel(`my-notification-${user.id}`).listen(
        ".notification-sent",
        (e) => {
            showNotificationWithSound("New Notification", {
                body: `${e.notification.data.message}`,
            });
            if (onNotificationReceived) onNotificationReceived(e.notification);
            else fetchNotifications();
        }
    );
};

const StopListening = (user: User) => {
    window.Echo.leaveChannel(`public:my-notification-${user.id}`);
};

export {
    renderNotificationActions,
    handleDelete,
    StopListening,
    listenForEvent,
};
