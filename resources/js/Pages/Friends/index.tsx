import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Link} from "@inertiajs/react";
import {Avatar, Box, Button, IconButton, Stack, Tooltip} from "@mui/material";
import React, {useState} from "react";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import {User} from "@/types";
import {dataType, handleUnblock} from "@/utils";
import Pagination from "@/Components/genralComp/Pagination";
import SearchBar from "@/Components/genralComp/SearchBar";
import {EyeIcon} from "lucide-react";
import {motion} from "framer-motion";
import FirstTimeCard from "@/Components/genralComp/FirstTimeCard";
import FriendCard from "@/Components/profile/FriendCard";

const Index = ({["code-mates"]: codeMates, blockedList, auth}) => {

    const hasCodeMates = codeMates && codeMates.data.length > 0;
    const hasBlockedList = blockedList && blockedList.length > 0;

    const [showBlockedList, setShowBlockedList] = useState(false);


    return (
        <AuthenticatedLayout
            user={auth.user}
            title="My Friends"
            header={<h2 className="font-semibold text-xl text-white leading-tight">My CodeMates</h2>}
        >
            <div className="flex flex-col justify-center items-center px-4">
                {hasBlockedList && (
                    <Tooltip title={`Show ${showBlockedList ? "CodeMates" : "Blocked"} List`}>
                        <IconButton
                            onClick={() => setShowBlockedList((prevState) => !prevState)}
                            className="!bg-white md:!mr-auto md:!ml-12"
                        >
                            <EyeIcon/>
                        </IconButton>
                    </Tooltip>
                )}

                {showBlockedList ? (
                    <div className="mt-8 w-full">
                        <h2 className="font-semibold text-xl text-white leading-tight px-6">
                            Block List
                        </h2>
                        <div
                            className='grid gap-4 p-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6'>

                            {blockedList.map((blockedUser: User, i: number) => (
                                <motion.div
                                    key={blockedUser.id}
                                    initial={{x: -50, y: -50, opacity: 0}}
                                    animate={{x: 0, y: 0, opacity: 1}}
                                    transition={{duration: 0.3, delay: i * 0.1}}
                                >
                                    <div
                                        className="w-full h-64 flex flex-col justify-between bg-black/30 p-2 mb-4 shadow-lg rounded-xl duration-150 hover:scale-105 hover:shadow-md"
                                    >
                                        <div>
                                            <Avatar
                                                className="!w-32 !h-32 !rounded-xl !object-cover !object-top !bg-gray-600 !mx-auto"
                                                src={blockedUser.profile_image && '/' + blockedUser.profile_image}
                                                alt={blockedUser.name}
                                            />
                                            <p className="font-bold text-white text-center p-3 line-clamp-2">
                                                {blockedUser.name}
                                            </p>
                                        </div>
                                        <Button
                                            color="error"
                                            size="small"
                                            variant="contained"
                                            onClick={() => handleUnblock(blockedUser)}
                                        >
                                            Unblock
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : !hasCodeMates ? (
                    <FirstTimeCard
                        bodyText={"It looks like you don't have any codeMates yet. Let's add some developers!"}
                    >
                        <Link href={route("profiles.index")} className="text-white">
                            <PrimaryButton>Add Developers</PrimaryButton>
                        </Link>
                    </FirstTimeCard>
                ) : (
                    <div className="w-full">
                        <div className="max-w-md mx-auto">
                            <SearchBar type={dataType.Friends} placeholder={"Find a CodeMate by name ..."}/>
                        </div>
                        <div>
                            <div
                                className="grid gap-2 p-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                            >
                                {codeMates.data.map((friend: User, i: number) => (
                                    <motion.div
                                        key={friend.id}
                                        initial={{x: -50, y: -50, opacity: 0}}
                                        animate={{x: 0, y: 0, opacity: 1}}
                                        transition={{duration: 0.3, delay: i * 0.05}}
                                    >
                                        <FriendCard friend={friend}/>
                                    </motion.div>
                                ))}
                            </div>
                            <Stack justifyContent="center" alignItems="center" mt={4}>
                                <Box maxWidth="fit-content">
                                    <Pagination
                                        currentPage={codeMates.current_page}
                                        lastPage={codeMates.last_page}
                                        paginatedDataName={'code-mates'}
                                    />
                                </Box>
                            </Stack>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
