import React, {PropsWithChildren, ReactNode, useState} from 'react';
import {User} from '@/types';
import {Box, Stack} from "@mui/material";
import Notifications from "@/Components/notifications/Notifications";
import {Head, usePage} from "@inertiajs/react";
import Footer from "@/Components/ui/Footer";
import StaggeredDropDown from "@/Components/ui/DropDownMenu";
import UnreadMessageCountUpdater from "@/Components/UnreadMessageCountUpdater";
import ChatContainer from '@/Components/chat/ChatContainer';
import UserLevelUpNotification from "@/UserLevelUpNotification";

export default function Authenticated({
                                          user,
                                          header,
                                          title,
                                          children,
                                          chatToggle,
                                          renderChat = true,
                                          renderNotifications = true
                                      }: PropsWithChildren<{
    user: User,
    header?: ReactNode
    title?: string,
    chatToggle?: number | null,
    renderChat?: boolean
    renderNotifications?: boolean
}>) {

    const {notifications, unreadNotificationsCount}: any = usePage().props;
    const [notificationCount, setNotificationCount] = useState(unreadNotificationsCount)

    return (
        <div className="grid  grid-rows-[auto,1fr] bg-opacity-45 bg-black ">
            <div className='flex min-h-[calc(100dvh_-_52px)]'>
                <UnreadMessageCountUpdater user={user}/>
                <UserLevelUpNotification user={user}/>
                <div className="flex-col flex-1">
                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        {header && (
                            <header>
                                <div
                                    className="max-w-7xl ml-10 lg:mx-auto py-6 px-4 sm:px-6 lg:px-8 min-w-full">{header}</div>
                            </header>
                        )}

                        {renderNotifications ? <>
                                <Head
                                    title={` ${notificationCount ? `(${notificationCount})` : ''} ${title}`}/>
                                <Box className='!ml-auto'>
                                    <Notifications notifications={notifications} unreadCount={notificationCount}
                                                   setUnreadCount={setNotificationCount}/>
                                </Box>
                            </>
                            : <>
                                <Head title={`${title}`}/>
                            </>}
                        <StaggeredDropDown title={user.name}/>
                    </Stack>

                    <main>
                        {children}
                    </main>
                    {renderChat && <ChatContainer id={chatToggle}/>}


                </div>
            </div>

            <Footer/>
        </div>


    )
        ;
}
