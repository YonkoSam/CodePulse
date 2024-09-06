import React, {useState} from 'react';
import {Button, Divider, IconButton, List, ListItem, Typography} from '@mui/material';
import {Search as SearchIcon} from 'lucide-react';
import {dataType} from "@/utils";
import FriendStatus from "@/Pages/Friends/FriendStatus";
import {Link} from "@inertiajs/react";
import {motion} from 'framer-motion';
import SpringModal from "@/Components/ui/SpringModal";
import TextInput from "@/Components/formComp/TextInput";

function SearchBar({placeholder, type, setSelectedObject}: {
    placeholder: string,
    type: dataType,
    setSelectedObject?: Function
}) {
    const [wordEntered, setWordEntered] = useState('');
    const [data, setData] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [open, setOpen] = useState(false);

    const buttonVariants = {
        hidden: {opacity: 0, x: 20},
        visible: {opacity: 1, x: 0, transition: {duration: 0.5}},
    };

    const inputVariants = {
        hidden: {opacity: 0, x: -20},
        visible: {opacity: 1, x: 0, transition: {duration: 0.5, delay: 0.5}},
    };
    const handleFilter = async () => {
        if (wordEntered === '') {
            setData([]);
            setNoResults(false);
            return;
        }

        let query = wordEntered;
        switch (type) {
            case dataType.Users :
                query += '*.*.*.*Users';
                break;
            case dataType.Friends :
                query += '*.*.*.*Friends';
                break;

            case dataType.pulses:
                query += '*.*.*.*pulses';
                break;
            default :
                query += '*.*.*.*All';

        }

        try {
            const response = await fetch(`/search/${query}`);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            setData(result.data);
            if (result.data.length <= 0) {
                setNoResults(true);
            }

            setOpen(true);

        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const renderListItem = (value,) => {
        switch (type) {
            case dataType.Friends:
                return (
                    <ListItem>
                        {setSelectedObject ?
                            <div className='flex items-center text-white'>
                                <FriendStatus friend={value} enableBadge={false}/>
                                <Button onClick={() => setSelectedObject(value)}>Select</Button>
                            </div>
                            :
                            <Link href={route('chat.user', value.id)}
                                  className="cursor-pointer flex gap-x-3"
                                  key={value.id}>
                                <FriendStatus friend={value} enableBadge={false}/>
                            </Link>
                        }

                    </ListItem>
                );

            case dataType.Users:
                return (
                    <ListItem>
                        {setSelectedObject ?
                            <div className='flex w-full items-start justify-between text-white'>
                                <FriendStatus friend={value} enableBadge={false}/>
                                <Button size='small' className='!h-fit' variant='contained'
                                        onClick={() => {
                                            setSelectedObject(value);
                                            setOpen(false);
                                        }}>select</Button>
                            </div> :
                            <Link href={route('profiles.show', value.profile.id)}
                                  className="cursor-pointer flex gap-x-3">
                                <FriendStatus friend={value} enableBadge={false}/>
                            </Link>}
                    </ListItem>
                );
            case dataType.pulses:
                return (
                    <ListItem>
                        <div className='flex flex-col'>
                            <Link href={route('pulses.show', value.id)}
                                  className="text-white font-bold line-clamp-2  hover:underline mb-2 ">
                                {value.title ?? 'no title available. '}
                            </Link>
                            <div className="text-white  font-light text-sm line-clamp-3">
                                {value.text ?? 'No description available.'}
                            </div>

                        </div>

                    </ListItem>
                );
            default:
                return null;
        }
    };


    return (
        <div>
            <div className="bg-transparent">
                <div className="h-20 flex items-center space-x-1">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={inputVariants}
                        className="searchBar flex-1"
                    >
                        <TextInput
                            placeholder={placeholder}
                            value={wordEntered}
                            onChange={(e) => {
                                setWordEntered(e.target.value);
                                setData([]);
                                setNoResults(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleFilter();
                                }
                            }}
                        />
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={buttonVariants}
                        whileHover="hover"
                    >
                        <IconButton
                            aria-label='search button'
                            onClick={handleFilter}
                            className="!text-white hover:scale-105 duration-300"
                            disabled={!wordEntered}
                        >
                            <SearchIcon/>
                        </IconButton>
                    </motion.div>
                </div>
            </div>
            <SpringModal isOpen={open} setIsOpen={setOpen}>

                <Typography id="modal-title" variant="h6" component="h2" className='text-white'>
                    Search Results
                </Typography>
                <div className='mt-2'>
                    {data.length > 0 ? (
                        <List>
                            {data.map((value, index) => {
                                return <div key={index}>{renderListItem(value)}
                                    <Divider className='bg-white !my-1'/>
                                </div>;
                            })
                            }
                        </List>

                    ) : (
                        noResults && <span className='text-xs text-white text-center p-4'>No results were found</span>
                    )}
                </div>
            </SpringModal>
        </div>
    );
}

export default SearchBar;
