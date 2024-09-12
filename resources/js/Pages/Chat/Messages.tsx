import React, {useEffect, useRef, useState} from 'react';
import {Container, Grid, IconButton, Switch, Tooltip, Typography} from "@mui/material";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Link, router, usePage} from "@inertiajs/react";
import {Message, PageProps, Team, User, UserSeen} from "@/types";
import {dataType, handleUnblock} from "@/utils";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchBar from "@/Components/genralComp/SearchBar";
import {motion} from 'framer-motion';
import FirstTimeCard from "@/Components/genralComp/FirstTimeCard";
import {Add, Groups, Person, Settings} from "@mui/icons-material";
import CreateTeamForm from "@/Pages/TeamWork/create";
import {ArrowDown, ArrowLeftRight, ArrowUp, UserRoundCheck, UserRoundX} from "lucide-react";
import ChatChannelListener from "@/Components/ChatChannelListener";
import {format} from "date-fns";
import ChatHeader from "@/Pages/Chat/ChatHeader";
import FriendList from "@/Pages/Chat/FriendList";
import TeamList from "@/Pages/Chat/TeamList";
import BlockedList from "@/Pages/Chat/BlockedList";
import {renderMessages} from "@/Components/chat/renderMessages";
import MessageSubmitForm from "@/Components/chat/MessageSubmitForm";
import {useWindowSize} from "@/utils/customHooks";

const Messages = ({messages, friends, teams: initialTeams, receiver, team, blockInitiatorId, blockedList}) => {
    const {auth} = usePage<PageProps>().props;
    const [showBlockedList, setShowBlockedList] = useState(false);
    const [switchChat, setSwitchChat] = useState(!!team);
    const [mobileNavigation, setMobileNavigation] = useState(true);
    const [open, setOpen] = useState(false);
    const [imagePreview, setImagePreview] = useState<null | number>(null);
    const [showUsersSeen, setShowUsersSeen] = useState<null | number>(null);
    const [showScrollDownArrow, setShowScrollDownArrow] = useState(false)

    const [teams, setTeams] = useState(initialTeams);
    const endRef = useRef(null);
    const [reversedMessages, setReversedMessages] = useState(() => {
        if (messages && messages.data?.length)
            return [...messages.data.slice().reverse()];
        else
            return [];
    })
    const initialFriends = () => {
        {
            if (friends && friends.data?.length)
                return [...friends.data
                    .sort((a: any, b: any) => b.unreadMessagesCount - a.unreadMessagesCount)];
            else return []
        }
    }
    const [sortedFriends, setSortedFriends] = useState(initialFriends);
    const {width} = useWindowSize();
    const isBlockInitiator = (blockInitiatorId == auth.user.id);
    const isMobile = width <= 768;
    const onDelete = (id: number) => {
        setReversedMessages(
            prevState => prevState.filter(msg => msg.id != id)
        )
    };
    useEffect(() => {
        scrollToBottom();
    }, [reversedMessages, showScrollDownArrow]);

    const scrollToBottom = () => {
        endRef.current?.scrollIntoView({behavior: "smooth"});
    }

    useEffect(() => {
        setSortedFriends(initialFriends);
    }, [friends]);

    useEffect(() => {
        window.Echo.channel(`my-messages-${auth.user.id}`)
            .listen('.message-sent', async (e) => {
                if (e.sender) {
                    await updateUnreadCountForUsers(e.sender);
                }
                if (e.team) {
                    await updateUnreadCountForTeams(e.team);
                }
            })

        return () => {
            window.Echo.leaveChannel(`public:my-messages-${auth.user.id}`);
        };
    }, [auth.user.id]);

    useEffect(() => {
        setTeams(initialTeams);
    }, [initialTeams])

    const handleScroll = (e) => {
        const {scrollTop, scrollHeight, clientHeight} = e.target;

        const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

        setShowScrollDownArrow(distanceFromBottom > 300);

    }

    const updateMessages = (message?: Message): void => {
        setReversedMessages(
            prevState => [
                ...prevState,
                message]
        )
    };
    const updateUnreadCountForTeams = async (currentTeam: Team) => {
        setTeams((prevState: Team[]) => {
            const teamIndex = prevState.findIndex(team => team.id === currentTeam.id);
            let updatedTeams: Team[];
            if (teamIndex !== -1) {
                const updatedFriend = {
                    ...prevState[teamIndex],
                    unreadMessagesCount: (prevState[teamIndex].unreadMessagesCount ?? 0) + 1,
                };
                updatedTeams = [
                    updatedFriend,
                    ...prevState.slice(0, teamIndex),
                    ...prevState.slice(teamIndex + 1),
                ];
            } else {
                updatedTeams = [
                    {
                        ...currentTeam,
                        unreadMessagesCount: 1,
                    },
                    ...prevState,
                ];

            }
            return updatedTeams;
        });

    };
    const updateUnreadCountForUsers = async (sender: User) => {
        const maxFriends = 7;
        setSortedFriends(prevState => {
            if (sender.id === receiver?.id) {
                return prevState;
            }
            const friendIndex = prevState.findIndex(friend => friend.id === sender.id);
            let updatedFriends: User[];
            if (friendIndex !== -1) {
                const updatedFriend = {
                    ...prevState[friendIndex],
                    online: true,
                    unreadMessagesCount: (prevState[friendIndex].unreadMessagesCount ?? 0) + 1,
                };
                updatedFriends = [
                    updatedFriend,
                    ...prevState.slice(0, friendIndex),
                    ...prevState.slice(friendIndex + 1),
                ];
            } else {
                updatedFriends = [
                    {
                        ...sender,
                        online: true,
                        unreadMessagesCount: 1,
                    },
                    ...prevState,
                ];

                if (updatedFriends.length > maxFriends) {
                    updatedFriends.pop();
                }
            }

            return updatedFriends;
        });

    };
    const updateSeen = (userSeen?: UserSeen) => {
        if (userSeen) {
            setReversedMessages(prevState =>
                prevState.map(msg => {
                    const isSameSender = userSeen.id === msg.sender_id;
                    const isUserSeenExists = msg.users_seen?.some((user: UserSeen) => user.id === userSeen.id);
                    const updatedUsersSeen = (isUserSeenExists || isSameSender)
                        ? msg.users_seen
                        : [
                            ...(msg.users_seen || []),
                            userSeen
                        ];
                    const updatedUsersSeenCount = (isUserSeenExists || isSameSender)
                        ? msg.users_seen_count
                        : (msg.users_seen_count ?? 0) + 1
                    return {
                        ...msg,
                        users_seen_count: updatedUsersSeenCount,
                        users_seen: updatedUsersSeen
                    };
                })
            );
        } else
            setReversedMessages(prevState =>
                prevState.map(msg =>
                    !msg.seen_at
                        ? {...msg, seen_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss')}
                        : msg
                )
            );
    }


    return (
        <AuthenticatedLayout renderChat={false} user={auth.user} title='Messages'
                             header={<Typography variant="h5" className="font-semibold text-white">
                                 Messages</Typography>}>
            <Container maxWidth='xl'>
                {isMobile && <div className='p-8  flex justify-end '>
                    <motion.button
                        animate={{rotate: mobileNavigation ? 180 : 0, scale: mobileNavigation ? 1.2 : 1}}
                        transition={{type: "spring"}}
                        className='!text-white'
                        onClick={() => setMobileNavigation(prevState => !prevState)}>
                        <ArrowLeftRight/>
                    </motion.button>

                </div>}
                <Grid container spacing={2} justifyContent='center'
                      className=" bg-black/30  rounded-3xl  shadow-md max-h-[85vh]">
                    <Grid item xs={isMobile ? 0 : 4}
                          className={`p-3  relative rounded-3xl  ${isMobile && (mobileNavigation ? '!hidden' : '!block')} h-[85vh]`}>
                        {blockedList.length > 0 && !switchChat && (
                            <Tooltip title={`show ${showBlockedList ? 'CodeMates' : 'blocked list'}`}>
                                <motion.div
                                    className='inline-block'
                                    animate={{rotate: showBlockedList ? 360 : 0, scale: showBlockedList ? 1.2 : 1}}
                                    transition={{type: 'spring', stiffness: 300, damping: 20}}
                                >
                                    <IconButton
                                        className="!text-white"
                                        onClick={() => setShowBlockedList(prevState => !prevState)}
                                    >
                                        {showBlockedList ? <UserRoundCheck/> : <UserRoundX/>}
                                    </IconButton>
                                </motion.div>
                            </Tooltip>
                        )}
                        <Tooltip title={`switch ${switchChat ? 'to friend chat' : 'to team chat'}`}>
                            <Switch
                                icon={<Person style={{fontSize: 25, color: '#fff'}}/>}
                                checkedIcon={<Groups style={{fontSize: 25, color: '#fff'}}/>}
                                onChange={() => setSwitchChat(prevState => !prevState)}
                                inputProps={{'aria-label': 'controlled'}}
                                className='!absolute right-0 top-1  rounded-3xl'
                            />
                        </Tooltip>
                        {
                            switchChat ? <>
                                <div className='flex mt-7'>
                                    <Typography variant="h6"
                                                className="!font-semibold !mb-2 !text-white">My Teams</Typography>
                                    <IconButton
                                        className='!ml-auto !text-white hover:scale-105 hover:rotate-90 duration-1000 ease-in-out'
                                        onClick={() => router.visit(route('teams.index'))}><Settings/></IconButton>
                                    <IconButton className='!text-white hover:scale-105 duration-300 ease-in-out '
                                                onClick={() => setOpen(true)}><Add/></IconButton>
                                    <CreateTeamForm open={open} setOpen={setOpen}/>

                                </div>
                                {teams?.length > 0 ? <TeamList teams={teams} userId={auth.user.id}/> :
                                    <FirstTimeCard className='bg-black/90'
                                                   bodyText={"It looks like you don't have any Teams yet. you can create a team from here!"}>
                                        <PrimaryButton onClick={() => setOpen(true)}>
                                            Create Team
                                        </PrimaryButton>
                                    </FirstTimeCard>

                                }
                            </> : !showBlockedList ?
                                <>
                                    <Typography variant="h6"
                                                className="!font-semibold !mb-2 !text-white">My
                                        CodeMates</Typography>

                                    {sortedFriends?.length > 0 ? (
                                        <>
                                            <SearchBar placeholder='Find a friend by name...'
                                                       type={dataType.Friends}/>
                                            <div>
                                                <div className="grid gap-4 mt-8"><FriendList friends={sortedFriends}/>
                                                </div>
                                                <div className='flex items-center'>
                                                    {
                                                        friends?.prev_page_url ?
                                                            <Link href={friends?.prev_page_url}
                                                                  preserveState
                                                                  only={['friends']}
                                                                  className='mr-auto !text-white'><ArrowBackIcon/></Link>
                                                            : <></>
                                                    }
                                                    {
                                                        friends?.next_page_url ?
                                                            <Link href={friends?.next_page_url}
                                                                  preserveState
                                                                  only={['friends']}
                                                                  className='ml-auto !text-white'><ArrowForwardIcon/></Link>
                                                            : <></>
                                                    }

                                                </div>
                                            </div>
                                        </>

                                    ) : (

                                        <FirstTimeCard className='bg-black/90 '
                                                       bodyText={"It looks like you don't have any CodeMates yet. Let's add some!"}>
                                            <Link href={route('profiles.index')} className="text-white">
                                                <PrimaryButton>
                                                    Add CodeMates
                                                </PrimaryButton>
                                            </Link>
                                        </FirstTimeCard>


                                    )}
                                </> :
                                <>
                                    <Typography variant="h6"
                                                className="!font-semibold !mb-2 !text-white">Blocked List</Typography>
                                    <div className="grid gap-4">
                                        <BlockedList blockedList={blockedList}/>

                                    </div>
                                </>
                        }

                    </Grid>


                    <div className="flex-1 px-9 md-px-0">
                        <ChatHeader isBlockInitiator={isBlockInitiator} team={team} receiver={receiver}/>
                        <Grid
                            onScroll={handleScroll}
                            className={`w-full bg-black/10 p-8  ${isMobile && (mobileNavigation ? '!block' : '!hidden')}  relative h-[67vh] overflow-auto`}>
                            {showScrollDownArrow && (
                                <motion.button
                                    className='fixed bottom-52 z-40 p-2 hover:bg-blue-500 rounded-full text-white'
                                    onClick={scrollToBottom}
                                    animate={{y: [0, 10, 0]}}
                                    transition={{repeat: Infinity, duration: 1}}
                                >
                                    <ArrowDown/>
                                </motion.button>
                            )}

                            <div className="flex items-center justify-center">
                                {messages?.next_page_url ?
                                    <Tooltip title="Show older messages">
                                        <Link href={messages?.next_page_url}
                                              className="p-1 !text-white hover:text-blue-500 duration-300"
                                              preserveScroll><ArrowUp/></Link>
                                    </Tooltip> : <></>}
                            </div>
                            <div className="grid  md:py-6">
                                {reversedMessages?.length ? (
                                    <>
                                        {renderMessages(auth, reversedMessages, imagePreview, setImagePreview, onDelete, false, team?.users_count, showUsersSeen, setShowUsersSeen)}
                                    </>
                                ) : blockInitiatorId ? (
                                    <Typography variant="body2" style={{color: '#999'}} className='text-center'>
                                        Sorry, you can't send a message.
                                    </Typography>
                                ) : sortedFriends?.length || teams?.length ? (
                                    <Typography variant="body2" style={{color: '#999'}} className='text-center'>
                                        Be the first one to send a message.
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" style={{color: '#999'}} className='text-center'>
                                        To be able to message, you need to add some CodeMates.
                                    </Typography>
                                )}

                                {ChatChannelListener(updateMessages, updateSeen, team, receiver)}
                            </div>
                            <div className="flex items-center justify-center">
                                {messages?.prev_page_url ?
                                    <Tooltip title="Show latest messages">
                                        <Link href={messages?.prev_page_url}
                                              className="p-1 !text-white hover:text-blue-500 duration-300"
                                              preserveScroll><ArrowDown/></Link>
                                    </Tooltip> : <></>}
                            </div>

                            <div ref={endRef}></div>

                        </Grid>
                        <>
                            {blockInitiatorId ? (isBlockInitiator ?
                                        <div
                                            className="w-full flex  items-center bg-gray-800 bg-opacity-50 border-none outline-none text-white font-bold py-3 px-4 rounded-xl text-base mt-2">

                                            <p className="text-gray-300 text-sm">
                                                You blocked <strong>{receiver.name}</strong> You can't message them, and
                                                they can't message you unless you unblock them.
                                            </p>
                                            <button
                                                onClick={() => handleUnblock(receiver)}
                                                className="bg-blue-500 text-white font-bold py-1 px-3 ml-auto rounded hover:bg-blue-600"
                                            >
                                                Unblock
                                            </button>
                                        </div>
                                        :
                                        <div
                                            className="w-full flex  items-center bg-gray-800 bg-opacity-50 border-none outline-none text-white font-bold py-3 px-4 rounded-xl text-base mt-2">
                                            <p className="text-gray-300 text-sm">
                                                <strong>{receiver.name}</strong> blocked you .
                                                You can't message them, and
                                                they can't message you unless they unblock you.
                                            </p>
                                        </div>
                                )
                                :
                                <div
                                    className={`bg-black/30 p-3  backdrop-blur-[5px]`}
                                >

                                    <MessageSubmitForm
                                        prev_page_url={messages?.prev_page_url}
                                        receiverId={receiver?.id}
                                        team_id={team?.id}
                                        disabled={(sortedFriends?.length <= 0 && reversedMessages?.length <= 0 && teams?.length <= 0)}
                                        updateMessages={updateMessages}
                                    />
                                </div>


                            }

                        </>
                    </div>

                </Grid>

            </Container>
        </AuthenticatedLayout>
    )

};

export default Messages;

