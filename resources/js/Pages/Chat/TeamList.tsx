// components/TeamList.jsx
import React from 'react';
import {Badge, IconButton, Tooltip} from "@mui/material";
import {People, PersonAdd} from "@mui/icons-material";
import {Team} from "@/types";
import {motion} from "framer-motion";
import {Link} from "@inertiajs/react";
import {AnimatedUsers} from "@/Components/animatedComp/AnimatedUsers";

const TeamList = ({teams, userId}) => {
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
                preserveScroll
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

            {team.owner_id == userId && (
                <Tooltip title="invite a user to group">
                    <Link href={route('teams.members.show', team.id)}>
                        <IconButton size="small" className="!text-white group-hover:!text-gray-800">
                            <PersonAdd/>
                        </IconButton>
                    </Link>
                </Tooltip>
            )}
        </motion.div>
    ))
};

export default TeamList;
