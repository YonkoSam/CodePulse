import {Link} from "@inertiajs/react";

const Sidebar = () => {
    return (
        <div>
            <div className="flex min-h-full">
                <div className="hidden md:flex flex-col w-64  ">
                    <div className="flex flex-col flex-1 overflow-y-auto">
                        <nav
                            className="flex flex-col flex-1 overflow-y-auto bg-gradient-to-b from-purple-700 to-blue-500 px-2 py-4 gap-10  ">
                            <div className="flex flex-col flex-1 gap-3">
                                <Link href={route('home')}
                                      className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
                                    <svg width="24" height="24" viewBox="0 0 24 24" className="mr-2">
                                        <path fill="currentColor" fillRule="evenodd"
                                              d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6l2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2z"
                                              clipRule="evenodd"/>
                                    </svg>
                                    Home
                                </Link>
                                <Link href={route('profiles.index')}
                                      className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
                                    <svg width="24" height="24" viewBox="0 0 32 32" className="mr-2">
                                        <path fill="currentColor"
                                              d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7zm0-26h10v2H22zm0 5h10v2H22zm0 5h7v2h-7z"/>
                                    </svg>
                                    Developers
                                </Link>
                                <Link href={route('posts.index')}
                                      className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
                                    <svg width="24" height="24" viewBox="0 0 24 24" className="mr-2">
                                        <path fill="none" stroke="currentColor" strokeWidth="2"
                                              d="M16 7h3v4h-3zm-7 8h11M9 11h4M9 7h4M6 18.5a2.5 2.5 0 1 1-5 0V7h5.025M6 18.5V3h17v15.5a2.5 2.5 0 0 1-2.5 2.5h-17"/>
                                    </svg>
                                    Posts
                                </Link>
                                <Link href={route('friends.index')}
                                      className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
                                    <svg width="24" height="24" viewBox="0 0 32 32" className="mr-2">
                                        <path fill="currentColor"
                                              d="M21.053 20.8c-1.132-.453-1.584-1.698-1.584-1.698s-.51.282-.51-.51s.51.51 1.02-2.548c0 0 1.413-.397 1.13-3.68h-.34s.85-3.51 0-4.7c-.85-1.188-1.188-1.98-3.057-2.547s-1.188-.454-2.547-.396c-1.36.058-2.492.793-2.492 1.19c0 0-.85.056-1.188.396c-.34.34-.906 1.924-.906 2.32s.283 3.06.566 3.625l-.337.114c-.284 3.283 1.13 3.68 1.13 3.68c.51 3.058 1.02 1.756 1.02 2.548s-.51.51-.51.51s-.452 1.245-1.584 1.698c-1.132.452-7.416 2.886-7.927 3.396c-.512.51-.454 2.888-.454 2.888H29.43s.06-2.377-.452-2.888c-.51-.51-6.795-2.944-7.927-3.396zm-12.47-.172c-.1-.18-.148-.31-.148-.31s-.432.24-.432-.432s.432.432.864-2.16c0 0 1.2-.335.96-3.118h-.29s.144-.59.238-1.334a10.01 10.01 0 0 1 .037-.996l.038-.426c-.02-.492-.107-.94-.312-1.226c-.72-1.007-1.008-1.68-2.59-2.16c-1.584-.48-1.01-.384-2.16-.335c-1.152.05-2.112.672-2.112 1.01c0 0-.72.047-1.008.335c-.27.27-.705 1.462-.757 1.885v.28c.048.654.26 2.45.47 2.873l-.286.096c-.24 2.782.96 3.118.96 3.118c.43 2.59.863 1.488.863 2.16s-.432.43-.432.43s-.383 1.058-1.343 1.44l-.232.092v5.234h.575c-.03-1.278.077-2.927.746-3.594c.357-.355 1.524-.94 6.353-2.862zm22.33-9.056c-.04-.378-.127-.715-.292-.946c-.718-1.008-1.007-1.68-2.59-2.16c-1.583-.48-1.007-.384-2.16-.335c-1.15.05-2.11.672-2.11 1.01c0 0-.72.047-1.008.335c-.27.272-.71 1.472-.758 1.89h.033l.08.914c.02.23.022.435.027.644c.09.666.21 1.35.33 1.59l-.286.095c-.24 2.782.96 3.118.96 3.118c.432 2.59.863 1.488.863 2.16s-.43.43-.43.43s-.054.143-.164.34c4.816 1.898 5.92 2.384 6.303 2.617c.267.147.397.313.46.44v-5.474c-.95-.38-1.338-1.443-1.338-1.443s-.432.24-.432-.43s.43.43.863-2.16c0 0 1.2-.335.96-3.118l-.29.1z"/>
                                    </svg>
                                    My Friends
                                </Link>
                                <Link href={route('chat.index')}
                                      className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-400 hover:bg-opacity-25 rounded-2xl">
                                    <svg width="32" height="32" viewBox="0 0 32 32"
                                         className=" text-white  ">
                                        <path fill="currentColor"
                                              d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z"
                                              clipRule="currentColor"/>
                                        <path fill="currentColor"
                                              d="M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z"
                                              clipRule="currentColor"/>
                                    </svg>

                                    My Messages
                                </Link>

                            </div>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
