import React, {useMemo} from 'react';
import {
    Avatar,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {AnimatePresence, motion} from 'framer-motion';
import {getLevel} from "@/utils";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ReactTimeAgo from "react-time-ago";
import Pagination from "@/Components/genralComp/Pagination";
import {EmojiEvents, Star, WorkspacePremium} from '@mui/icons-material';
import {Profile} from "@/types";

const getRankIcon = (rank: number) => {
    switch (rank) {
        case 1:
            return <Star className='text-yellow-200 text-5xl'/>;
        case 2:
            return <EmojiEvents className='text-gray-200 text-4xl'/>;
        case 3:
            return <WorkspacePremium className='text-yellow-500 text-4xl'/>;
        default:
            return null;
    }
};

const getRankStyle = (rank: number) => {
    switch (rank) {
        case 1:
            return 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black shadow-lg shadow-yellow-500/50';
        case 2:
            return 'bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 text-gray-900 shadow-md shadow-gray-400/50';
        case 3:
            return 'bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 text-yellow-100 shadow-md shadow-yellow-800/50';
        default:
            return 'bg-gray-800 text-white hover:bg-gray-700';
    }
};

const LeaderboardRow = React.memo(({profile, index}: { profile: Profile; index: number }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const rankStyle = getRankStyle(profile.rank);

    return (
        <motion.tr
            key={profile.id}
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.3, delay: index * 0.05}}
            className={`transition-all duration-300 ${rankStyle}`}
        >
            <TableCell className="text-center flex items-center justify-center">
                {getRankIcon(profile.rank) || <span className="font-bold text-xl text-white">{profile.rank}</span>}
            </TableCell>
            <TableCell>
                <div className="flex items-center">
                    <Avatar
                        src={profile.user.profile_image}
                        className={`w-12 h-12 ${profile.rank <= 3 ? 'ring-4 ring-offset-2 shadow-lg' : ''} ${
                            profile.rank === 1 ? 'ring-yellow-300 ring-offset-yellow-500' :
                                profile.rank === 2 ? 'ring-gray-200 ring-offset-gray-400' :
                                    profile.rank === 3 ? 'ring-yellow-500 ring-offset-yellow-700' : ''
                        }`}
                    />
                    <Typography variant="body1"
                                className={`pl-3 font-medium ${profile.rank <= 3 ? 'font-bold text-lg' : 'text-white'}`}>
                        {profile.user.name}
                    </Typography>
                </div>
            </TableCell>
            {!isMobile && (
                <>
                    <TableCell><span
                        className={`text-sm  ${profile.rank <= 3 ? 'font-bold' : 'text-white'}`}>{profile.country}</span></TableCell>
                    <TableCell><span
                        className={`text-sm ${profile.rank <= 3 ? 'font-bold' : 'text-white'}`}>{profile.xp}</span></TableCell>
                    <TableCell><span
                        className={`text-sm ${profile.rank <= 3 ? 'font-bold' : 'text-white'}`}>{getLevel(profile.xp)}</span></TableCell>
                    <TableCell className={`text-sm ${profile.rank <= 3 ? 'font-bold' : '!text-white'}`}>
                        {profile.user.last_activity ?
                            <ReactTimeAgo date={Date.parse(profile.user.last_activity)}/> : 'long time ago'}
                    </TableCell>
                </>
            )}
        </motion.tr>
    );
});

const Leaderboard = ({profiles, auth}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const memoizedProfiles = useMemo(() => profiles.data, [profiles.data]);

    return (
        <Authenticated
            user={auth.user}
            title={'Leaderboard'}
            header={<h2 className="font-semibold text-2xl text-white leading-tight">Leaderboard</h2>}
        >
            <Box className='p-4 md:p-8 overflow-auto'>
                <TableContainer
                    component={motion.div}
                    className="bg-gray-900 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.6}}
                >
                    <Table>
                        <TableHead>
                            <TableRow className="bg-gray-800">
                                <TableCell className="font-semibold !text-white p-4">Rank</TableCell>
                                <TableCell className="font-semibold !text-white p-4">Name</TableCell>
                                {!isMobile && (
                                    <>
                                        <TableCell className="font-semibold !text-white p-4">Country</TableCell>
                                        <TableCell className="font-semibold !text-white p-4">XP</TableCell>
                                        <TableCell className="font-semibold !text-white p-4">Level</TableCell>
                                        <TableCell className="font-semibold !text-white p-4">Last Activity</TableCell>
                                    </>
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <AnimatePresence>
                                {memoizedProfiles.map((profile: Profile, index: number) => (
                                    <LeaderboardRow key={profile.id} profile={profile} index={index}/>
                                ))}
                            </AnimatePresence>
                        </TableBody>
                    </Table>

                    <div className='flex m-6 justify-center'>
                        <Pagination
                            currentPage={profiles.current_page}
                            lastPage={profiles.last_page}
                            paginatedDataName={'profiles'}
                        />
                    </div>
                </TableContainer>
            </Box>
        </Authenticated>
    );
};

export default Leaderboard;
