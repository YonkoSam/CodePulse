import React from 'react';
import {Avatar, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import {motion} from 'framer-motion';
import {getLevel} from "@/utils";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import ReactTimeAgo from "react-time-ago";
import Pagination from "@/Components/genralComp/Pagination";
import {EmojiEvents, Star} from '@mui/icons-material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const getRankIcon = (rank) => {
    if (rank === 1) return <Star className='text-amber-300  text-4xl'/>;
    if (rank === 2) return <EmojiEvents className='text-stone-300 text-3xl'/>;
    if (rank === 3) return <WorkspacePremiumIcon className='text-amber-300 text-3xl'/>;
    return null;
};

const getRankBackground = (rank) => {
    if (rank === 1) return "bg-gradient-to-r from-amber-600 to-amber-400";
    if (rank === 2) return "bg-gradient-to-r from-stone-800 to-stone-400";
    if (rank === 3) return "bg-gradient-to-r from-amber-800 to-amber-600";
    return "bg-black/30";
};


const Leaderboard = ({profiles, auth}) => {
    console.log(profiles);
    return (
        <Authenticated user={auth.user} title={'Leaderboard'}
                       header={<h2 className="font-semibold text-2xl text-white leading-tight">Leaderboard</h2>}>
            <Box className='p-8 grid overflow-auto'>
                <TableContainer component={motion.div}
                                className="bg-black/30 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl "
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                transition={{duration: 0.6}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="font-semibold !text-white p-4">Rank</TableCell>
                                <TableCell className="font-semibold !text-white p-4">Name</TableCell>
                                <TableCell className="font-semibold !text-white p-4">Country</TableCell>
                                <TableCell className="font-semibold !text-white p-4">XP</TableCell>
                                <TableCell className="font-semibold !text-white p-4">Level</TableCell>
                                <TableCell className="font-semibold !text-white p-4">Last Activity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {profiles.data.map((profile, index) => (
                                <motion.tr
                                    key={profile.id}
                                    initial={{opacity: 0, x: -50, scale: 0.5}}
                                    animate={{opacity: 1, x: 0, scale: 1}}
                                    transition={{duration: 0.3, delay: index * 0.1}}
                                    className={`text-white transition-transform duration-300 hover:scale-105 ${
                                        getRankBackground(profile.rank)} rounded-2xl`}
                                >
                                    <TableCell className="text-center flex items-center justify-center text-white">
                                        {getRankIcon(profile.rank) ||
                                            <span className="text-white font-bold text-xl">{profile.rank}</span>}
                                    </TableCell>
                                    <TableCell className="">
                                        <div className="flex items-center">
                                            <Avatar src={profile.user.profile_image}
                                                    className={`w-12 h-12 ${profile.rank <= 3 ? 'border-4 border-white shadow-2xl' : ''}`}/>
                                            <Typography variant="caption"
                                                        className={`!ml-4 font-medium ${profile.rank <= 3 ? 'text-white font-bold text-lg' : 'text-white text-lg'}`}>
                                                {profile.user.name}
                                            </Typography>
                                        </div>
                                    </TableCell>
                                    <TableCell><span
                                        className={`text-sm ${profile.rank <= 3 ? 'text-white font-bold' : 'text-white'}`}>
                    {profile.country}
                  </span></TableCell>
                                    <TableCell><span
                                        className={`text-sm ${profile.rank <= 3 ? 'text-white font-bold' : 'text-white'}`}>
                    {profile.xp}
                  </span></TableCell>
                                    <TableCell><span
                                        className={`text-sm ${profile.rank <= 3 ? 'text-white font-bold' : 'text-white'}`}>
                    {getLevel(profile.xp)}
                  </span></TableCell>
                                    <TableCell className="!text-base !text-white">{
                                        profile.user.last_activity ? <ReactTimeAgo
                                            date={Date.parse(profile.user.last_activity)}/> : 'long time ago'}</TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>

                    <div className='flex m-6 justify-center'>
                        <Pagination currentPage={profiles.current_page} lastPage={profiles.last_page}
                                    paginatedDataName={'profiles'}/>
                    </div>

                </TableContainer>
            </Box>
        </Authenticated>
    );
};

export default Leaderboard;
