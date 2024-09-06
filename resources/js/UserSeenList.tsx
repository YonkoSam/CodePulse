import React, {ChangeEvent, useCallback, useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import SpringModal from "@/Components/ui/SpringModal";
import {UserSeen} from "@/types";
import FriendStatus from "@/Pages/Friends/FriendStatus";
import ReactTimeAgo from "react-time-ago";
import debounce from 'lodash.debounce';
import TextInput from "@/Components/formComp/TextInput";

const UserSeenList = ({open, setOpen, msgId}: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    msgId: number;
}) => {
    const [filteredUsers, setFilteredUsers] = useState<UserSeen[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const observerRef = useRef<IntersectionObserver | null>(null);
    const [loading, setLoading] = useState(false)

    const fetchUsers = async (term: string, page: number) => {
        try {
            const response = await fetch(route('message.users-seen', {message: msgId, search: term, page}));
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const {usersSeen} = await response.json();
            setFilteredUsers(prevUsersSeen => page === 1 ? usersSeen.data : [...prevUsersSeen, ...usersSeen.data]);
            setHasMore(usersSeen.current_page < usersSeen.last_page);
        } catch (error) {
            console.error('Failed to fetch filtered users:', error);
        }
    };

    const debouncedSearch = useCallback(
        debounce((term: string) => {
            setCurrentPage(1);
            fetchUsers(term, 1).then(
                () => setLoading(false)
            );
        }, 1000),
        []
    );


    useEffect(() => {
        if (!searchTerm) {
            setFilteredUsers([]);
            setHasMore(true);
            setLoading(true);
            fetchUsers('', 1).then(
                () => setLoading(false)
            );
        } else {
            setLoading(true);
            debouncedSearch(searchTerm);
        }
    }, [msgId, searchTerm]);

    useEffect(() => {
        if (!hasMore) return;
        if (observerRef.current) observerRef.current.disconnect();
        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setCurrentPage(prevPage => {
                    const nextPage = prevPage + 1;
                    fetchUsers(searchTerm, nextPage);
                    return nextPage;
                });
            }
        });
        if (observerRef.current) {
            const endOfList = document.querySelector('.end-of-list');
            if (endOfList) observerRef.current.observe(endOfList);
        }
    }, [filteredUsers, hasMore, searchTerm]);
    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <SpringModal isOpen={open} setIsOpen={setOpen}>
            <div className="space-y-4">
                <TextInput
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Find users who've seen this message..."
                />
                {
                    loading ? <p className='text-center font-light text-gray-200'>
                            loading ...</p> :
                        filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                                <motion.div
                                    key={index}
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.3}}
                                >
                                    <div className='relative'>
                                        <FriendStatus friend={user} enableBadge={false}/>
                                        <span className='text-xs text-gray-200 absolute top-8 left-14'>
                                seen <ReactTimeAgo date={Date.parse(user.pivot.seen_at)}/>
                            </span>
                                    </div>
                                </motion.div>
                            )) :
                            <p className='text-center font-light text-gray-200'>
                                {searchTerm && "user haven't seen this message yet."}
                            </p>
                }
                {hasMore && <div className="end-of-list" style={{height: '1px'}}></div>}
            </div>
        </SpringModal>
    );
};

export default UserSeenList;
