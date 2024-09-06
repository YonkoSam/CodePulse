import React from 'react';
import {User} from "@/types";
import {motion} from "framer-motion";
import {Link} from "@inertiajs/react";
import FriendStatus from "@/Pages/Friends/FriendStatus";

const BlockedList = ({blockedList}) => {
    return blockedList.map((user: User, i: number) => (
        <motion.div key={user.id}
                    initial={{y: -50, opacity: 0}}
                    animate={{y: 0, opacity: 1}}
                    transition={{duration: 0.3, delay: i * 0.2}}

        ><Link href={route('chat.user', user.id)} className="cursor-pointer flex gap-x-3 "
               except={['friends', 'blockedList', 'teams']}
               preserveScroll
               key={user.id}>
            <FriendStatus friend={user} enableBadge={false}/>
        </Link>
        </motion.div>
    ))
};

export default BlockedList;
