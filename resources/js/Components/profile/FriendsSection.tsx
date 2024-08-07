import {Avatar, Divider, List, ListItem} from "@mui/material";
import {Link} from "@inertiajs/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import React from "react";
import {motion} from "framer-motion";
import {User} from "@/types";

const FriendsSection = ({friends}) => {
    return <List
        className='  text-white min-h-[500px] !pb-5 min-w-72  '>
        <h1 className='text-xl p-4 font-bold text-white mt-4'>CodeMates</h1>
        <Divider className=' !bg-white'/>
        {friends.data.length > 0 ?
            <>

                {friends.data.map((friend: User, i: number) => (

                    <ListItem key={i}
                              component={motion.div}
                              initial={{y: -50, opacity: 0}}
                              animate={{y: 0, opacity: 1}}
                              transition={{duration: 0.3, delay: i * 0.1}}
                              whileHover={{
                                  scale: 1.05,
                                  transition: {duration: 0.3, delay: 0},
                              }}
                              className='flex gap-2'>
                        <Avatar src={friend.profile_image && '/' + friend.profile_image}/>
                        <Link href={route('profiles.show', friend.profile.id)}>
                            <p>{friend.name}</p>
                            <p className='text-xs'>{friend.profile.status}</p>
                        </Link>
                    </ListItem>


                ))}
                <div className='flex items-center px-4 mt-8'>
                    {
                        friends.current_page > 1 ?
                            <Link href={`?page=${friends.current_page - 1}`}
                                  className='mr-auto hover:-translate-x-1 duration-300 ease-in-out'
                                  preserveScroll><ArrowBackIcon/></Link>
                            : <></>
                    }
                    {
                        friends.current_page != friends.last_page ?
                            <Link href={`?page=${friends.current_page + 1}`}
                                  className='ml-auto hover:translate-x-1 duration-300 ease-in-out'
                                  preserveScroll><ArrowForwardIcon/></Link>
                            : <></>
                    }

                </div>
            </> :
            <div>
                <h3 className="block text-white py-2 text-s  mb-2 text-center">
                    User has no CodeMates yet !
                </h3>
            </div>
        }
    </List>
}

export default FriendsSection;
