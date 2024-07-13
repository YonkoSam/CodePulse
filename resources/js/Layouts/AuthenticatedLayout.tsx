import React, {PropsWithChildren, ReactNode} from 'react';
import {User} from '@/types';
import Sidebar from "@/Components/Sidebar";
import {Box, Stack} from "@mui/material";
import ChatContainer from "@/Components/ChatContainer";
import Notifications from "@/Components/notifications/Notifications";
import DropDownMenu from "@/Components/DropDownMenu";
import {Head, usePage} from "@inertiajs/react";

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

    const {notifications}: any = usePage().props;
    const notificationsCount = notifications.filter((e: any) => !e.read_at).length;
    return (
        <>

            <div className="flex bg-opacity-45 bg-black min-w-full min-h-screen overflow-hidden">
                <Sidebar/>
                <div className="flex-col w-full">
                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        {header && (
                            <header className=" ">
                                <div
                                    className="max-w-7xl  mx-auto py-6 px-4 sm:px-6 lg:px-8 min-w-full">{header}</div>
                            </header>
                        )}

                        {renderNotifications ? <Box className='!ml-auto'>
                            <Notifications notifications={notifications} count={notificationsCount}/>
                        </Box> : <></>}
                        <DropDownMenu user={user}/>
                    </Stack>
                    <Head title={` ${notificationsCount ? `(${notificationsCount})` : ''} ${title}`}/>
                    <main>
                        {children}
                    </main>
                    {renderChat ? <ChatContainer id={callback}/> : <></>}


                </div>
            </div>
        </>

    )
        ;
}
