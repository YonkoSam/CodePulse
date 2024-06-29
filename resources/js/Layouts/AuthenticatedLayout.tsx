import React, {PropsWithChildren, ReactNode, useState} from 'react';
import {User} from '@/types';
import Sidebar from "@/Components/Sidebar";
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Dropdown from '@/Components/Dropdown';
import {Box, Stack} from "@mui/material";
import ChatContainer from "@/Components/ChatContainer";
import Notifications from "@/Components/notifications/Notifications";

export default function Authenticated({
                                          user,
                                          header,
                                          children,
                                          callback,
                                          renderChat = true,
                                          renderNotifications = true
                                      }: PropsWithChildren<{
    user: User,
    header?: ReactNode
    callback?: any
    renderChat?: boolean
    renderNotifications?: boolean
}>) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <>

            <div className="flex bg-opacity-45 bg-black min-w-full min-h-screen overflow-hidden">
                <Sidebar/>
                <div className="flex-col w-full">
                    <Stack direction='row' justifyContent='space-between' alignItems='center'>
                        {header && (
                            <header className=" ">
                                <div className="max-w-7xl  mx-auto py-6 px-4 sm:px-6 lg:px-8 min-w-full">{header}</div>
                            </header>
                        )}

                        {renderNotifications ? <Box className='!ml-auto'>
                            <Notifications/>
                        </Box> : <></>}
                        <Box>
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex justify-between h-16">
                                    <div className="hidden sm:flex sm:items-center sm:ml-6">
                                        <div className="ml-3 relative">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex rounded-xl items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium  text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name}

                                                <svg
                                                    className="ml-2 -mr-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                                        Log Out
                                                    </Dropdown.Link>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>
                                    </div>

                                    <div className="-mr-2 flex items-center sm:hidden">
                                        <button
                                            onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                            className="inline-flex items-center justify-center p-2 rounded text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                                        >
                                            <svg className="h-6 w-6" stroke="currentColor" fill="none"
                                                 viewBox="0 0 24 24">
                                                <path
                                                    className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 6h16M4 12h16M4 18h16"
                                                />
                                                <path
                                                    className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                                <div className="pt-2 pb-3 space-y-1">
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route('home')}
                                        as="button"
                                        active={route().current('home')
                                        }
                                    >
                                        Dashboard
                                    </ResponsiveNavLink>
                                </div>

                                <div className="pt-4 pb-1 border-t border-gray-200">
                                    <div className="px-4">
                                        <div className="font-medium text-base text-gray-800">{user.name}</div>
                                        <div className="font-medium text-sm text-gray-500">{user.email}</div>
                                    </div>

                                    <div className="mt-3 space-y-1">
                                        <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                            Log Out
                                        </ResponsiveNavLink>
                                    </div>
                                </div>
                            </div>
                        </Box>
                    </Stack>

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
