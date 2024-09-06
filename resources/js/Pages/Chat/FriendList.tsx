import React from 'react';
import {Badge, Divider} from "@mui/material";
import FriendStatus from "@/Pages/Friends/FriendStatus";
import {User} from "@/types";
import {motion} from "framer-motion";
import {Link} from "@inertiajs/react";

const FriendList = ({friends}) => {

    return friends
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

export default FriendList;
