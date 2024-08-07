import React, {PropsWithChildren, ReactNode, useEffect} from 'react';
import {User} from '@/types';
import Sidebar from "@/Components/genralComp/Sidebar";
import {Box, Stack} from "@mui/material";
import ChatContainer from "@/Components/chat/ChatContainer";
import Notifications from "@/Components/notifications/Notifications";
import {Head, router, usePage} from "@inertiajs/react";
import Footer from "@/Components/ui/Footer";
import {audio} from "@/utils";
import StaggeredDropDown from "@/Components/ui/DropDownMenu";

export default function Authenticated({
                                          user,
                                          header,
                                          title,
                                          children,
                                          callback,
                                          renderChat = true,
                                          renderNotifications = true
                                      }: PropsWithChildren<{
    user: User,
    header?: ReactNode
    title?: string,
    callback?: any
    renderChat?: boolean
    renderNotifications?: boolean
}>) {


    const {notifications, unreadNotificationsCount}: any = usePage().props;
    useEffect(() => {
        window.Echo.channel(`my-messages-${user.id}`)
            .listen('.message-sent', () => {
                router.reload({only: ['messages', 'friends', 'teams']});
                audio.play().catch();
            })

        return () => {
            window.Echo.leaveChannel(`public:my-messages-${user.id}`);
        };
    }, [user.id]);


    return (
        <div className="grid  grid-rows-[auto,1fr] bg-opacity-45 bg-black ">
            <div className='flex min-h-[calc(100dvh_-_52px)]'>
                <Sidebar/>
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
                                    title={` ${unreadNotificationsCount ? `(${unreadNotificationsCount})` : ''} ${title}`}/>
                                <Box className='!ml-auto'>
                                    <Notifications notifications={notifications} count={unreadNotificationsCount}/>
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
                    {renderChat ? <ChatContainer id={callback}/> : <></>}


                </div>
            </div>

            <Footer/>
        </div>


    )
        ;
}
