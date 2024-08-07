import React, {useMemo, useState} from 'react';
import {Badge, Box, Button, Container, Divider, Grid, IconButton, Switch, Tooltip, Typography} from "@mui/material";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Link, router, usePage} from "@inertiajs/react";
import {PageProps, Team, User} from "@/types";
import {dataType, handleUnblock, useScrollToBottom, useWindowSize} from "@/utils";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import FriendStatus from "@/Pages/Friends/FriendStatus";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchBar from "@/Components/genralComp/SearchBar";
import {motion} from 'framer-motion';
import FirstTimeCard from "@/Components/genralComp/FirstTimeCard";
import {AnimatedUsers} from "@/Components/animatedComp/AnimatedUsers";
import {Add, Groups, People, Person, PersonAdd, Settings} from "@mui/icons-material";
import CreateTeamForm from "@/Pages/TeamWork/create";
import {ArrowDown, ArrowLeftRight, ArrowUp, UserRoundCheck, UserRoundX} from "lucide-react";
import {renderMessages} from "@/Components/chat/renderMessages";
import {isTypingNotification} from "@/Components/chat/isTypingNotification";
import MessageSubmitForm from "@/Components/chat/MessageSubmitForm";

const Messages = ({messages, friends, teams, receiver, team, blockInitiatorId, blockedList}) => {

    const [showBlockedList, setShowBlockedList] = useState(false);
    const [switchChat, setSwitchChat] = useState(!!team)
    const [mobileNavigation, setMobileNavigation] = useState(true)
    const {auth} = usePage<PageProps>().props;
    const [open, setOpen] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)


    const {width} = useWindowSize();

    const reversedMessages = useMemo(() => {
        if (messages && messages.data?.length)
            return [...messages.data.slice().reverse()];
        else
            return null
    }, [messages])

    const sortedFriends = useMemo(() => {
        if (friends && friends.data?.length)
            return [...friends.data
                .sort((a: any, b: any) => b.unreadMessagesCount - a.unreadMessagesCount)];
        else return null
    }, [friends])


    const fetchMessages = () => {
        router.reload({only: ['messages']});
    };
    const isBlockInitiator = (blockInitiatorId == auth.user.id);
    const MessageBoxRef = useScrollToBottom(reversedMessages);

    const renderFriends = () => {
        return sortedFriends
            .map((friend: User, i: number) => (
                <motion.div key={friend.id}
                            initial={{y: -50, opacity: 0}}
                            animate={{y: 0, opacity: 1}}
                            transition={{duration: 0.3, delay: i * 0.2}}
                >
                    <Link href={route('chat.user', friend.id)}
                          except={['blockedList', 'teams']}
                          className="cursor-pointer flex gap-x-3 justify-start">
                        <FriendStatus friend={friend}/>
                        <Badge
                            color={friend.unreadMessagesCount ? "error" : "default"}
                            badgeContent={friend.unreadMessagesCount}
                            overlap="circular"
                        />
                    </Link>
                    <Divider className='bg-white/30'/>
                </motion.div>
            ))


    };

    const renderTeams = () => {
        return teams.map((team: Team, i: number) => (
            <motion.div
                key={team.id}
                initial={{y: -20, opacity: 0}}
                animate={{y: 0, opacity: 1}}
                transition={{duration: 0.3, delay: i * 0.1}}
                className="flex flex-1  items-center rounded-3xl justify-between p-3 m-3 gap-2  bg-black/30 shadow-2xl hover:bg-gray-200  group duration-300 ease-in-out"
            >
                <Link
                    href={route('chat.team', {teamId: team.id})}
                    except={['friends', 'blockedList']}
                    className="flex items-center gap-2 w-full text-white  group-hover:text-gray-800"
                >
                    <People className="group-hover:text-gray-800"/>
                    <div className="flex gap-3 group-hover:text-gray-800">
                        <p className="text-sm font-medium group-hover:text-gray-800">{team.name}</p>
                        <Badge
                            color={team.unreadMessagesCount ? 'error' : 'default'}
                            badgeContent={team.unreadMessagesCount}
                            overlap="circular"
                            className="group-hover:text-gray-800"
                        />
                    </div>

                    <div className="flex items-center justify-center w-full flex-wrap ">
                        <AnimatedUsers users={team.users}/>
                    </div>
                </Link>

                {team.owner_id == auth.user.id && (
                    <Tooltip title="invite a user to group">
                        <Link href={route('teams.members.show', team.id)}>
                            <IconButton size="small" className="!text-white group-hover:!text-gray-800">
                                <PersonAdd/>
                            </IconButton>
                        </Link>
                    </Tooltip>
                )}
            </motion.div>
        ));
    };

    const renderBlockedList = () => {
        return blockedList.map((user: User, i: number) => (
            <motion.div key={user.id}
                        initial={{y: -50, opacity: 0}}
                        animate={{y: 0, opacity: 1}}
                        transition={{duration: 0.3, delay: i * 0.2}}

            ><Link href={route('chat.user', user.id)} className="cursor-pointer flex gap-x-3 "
                   except={['friends', 'blockedList', 'teams']}

                   key={user.id}>
                <FriendStatus friend={user} enableBadge={false}/>
            </Link>
            </motion.div>

        ))
    }

    const isMobile = width <= 768;
    return (
        <AuthenticatedLayout renderChat={false} user={auth.user} title='Messages'
                             header={<Typography variant="h5" className="font-semibold text-white">My
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
                      className=" bg-black/30  rounded-3xl  shadow-md max-h-[90vh]">


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
                                {teams?.length > 0 ? renderTeams() :
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
                                                <div className="grid gap-4 mt-8">{renderFriends()}</div>
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
                                        {renderBlockedList()}

                                    </div>
                                </>
                        }

                    </Grid>


                    <Grid ref={MessageBoxRef} item xs={isMobile ? 0 : 8}
                          className={`w-full  h-[73vh] bg-black/10 p-8  ${isMobile && (mobileNavigation ? '!block' : '!hidden')} overflow-auto rounded-3xl `}>
                        <div className='fixed top-16 z-10 text-white  rounded-2xl p-2'>
                            {
                                receiver ? <FriendStatus friend={receiver} enableBadge={!blockInitiatorId}/>
                                    : team &&
                                    <div>
                                    <span className='flex items-center gap-2 px-4 py-2 text-lg font-medium'>
                                    <People/>
                                <p className=" text-white">{team.name}</p></span>
                                        <Divider className='bg-white w-72'/>
                                    </div>
                            }
                        </div>

                        <div className="flex items-center justify-center">
                            {messages?.next_page_url ?
                                <Tooltip title="Show older messages">
                                    <Link href={messages?.next_page_url}
                                          className="p-5 !text-white hover:text-blue-500 duration-300"
                                          preserveScroll><ArrowUp/></Link>
                                </Tooltip> : <></>}
                        </div>
                        <div className="grid py-11">
                            {reversedMessages?.length ? renderMessages(reversedMessages, imagePreview, setImagePreview) : sortedFriends?.length > 0 ?
                                blockInitiatorId &&
                                <Typography variant="body2" style={{color: '#999'}} className='text-center'>Sorry
                                    You cant Send a Message</Typography>
                                :
                                <Typography variant="body2" style={{color: '#999'}} className='text-center'>Be the
                                    First One to Send a
                                    Message</Typography>
                                &&
                                <Typography variant="body2" style={{color: '#999'}} className='text-center'>To Be
                                    the
                                    to be able to message you need to add some CodeMates
                                </Typography>

                            }

                            {isTypingNotification(receiver, team?.id)}
                        </div>

                        <div className="flex items-center justify-center">
                            {messages?.prev_page_url ?
                                <Tooltip title="Show latest messages">
                                    <Link href={messages?.prev_page_url}
                                          className="p-5 transform -translate-y-8 !text-white hover:text-blue-500 duration-300"
                                          preserveScroll><ArrowDown/></Link>
                                </Tooltip> : <></>}
                        </div>


                        <>

                            {

                                blockInitiatorId ? (isBlockInitiator ? <Box
                                            sx={{
                                                padding: '16px',
                                                backgroundColor: '#f9f9f9',
                                                borderRadius: '8px',
                                                border: '1px solid #ddd',
                                                marginTop: '16px'
                                            }}
                                        >
                                            <Typography variant="body1" paragraph>
                                                You blocked <strong>{receiver.name}</strong>.
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" paragraph>
                                                You can't message them and they can't message you unless you unblock them
                                            </Typography>
                                            <Divider sx={{marginY: '8px'}}/>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleUnblock(receiver)}
                                                sx={{marginTop: '8px'}}
                                            >
                                                Unblock
                                            </Button>
                                        </Box> :
                                        <Box
                                            sx={{
                                                padding: '16px',
                                                backgroundColor: '#f9f9f9',
                                                borderRadius: '8px',
                                                border: '1px solid #ddd',
                                                marginTop: '16px'
                                            }}
                                        >
                                            <Typography variant="body1" paragraph>
                                                <strong>{receiver.name}</strong> blocked you.
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" paragraph>
                                                You can't message them and they can't message unless they unblock you
                                            </Typography>
                                            <Divider sx={{marginY: '8px'}}/>
                                        </Box>) :
                                    <div
                                        className='fixed bottom-[10%] md:w-2/4 md:  z-10 bg-black/30 p-3 rounded-2xl backdrop-blur-[5px]'>
                                        <MessageSubmitForm
                                            prev_page_url={messages?.prev_page_url}
                                            receiverId={receiver?.id}
                                            team_id={team?.id}
                                            disabled={!sortedFriends && !reversedMessages && !teams?.length || (sortedFriends?.length <= 0 && reversedMessages?.length <= 0 && teams?.length <= 0)}
                                            callBack={fetchMessages}
                                        />
                                    </div>


                            }


                        </>

                    </Grid>


                </Grid>
            </Container>
        </AuthenticatedLayout>
    )

};

export default Messages;

