import React from 'react';
import {PageProps, Pulse, Team} from "@/types";
import PulseCard from "@/Components/pulseComp/PulseCard";
import {Link, router, usePage} from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {Box, Stack} from "@mui/material";
import PrimaryButton from "@/Components/formComp/PrimaryButton";
import Pagination from "@/Components/genralComp/Pagination";
import SearchBar from "@/Components/genralComp/SearchBar";
import {dataType} from "@/utils";
import {motion} from 'framer-motion';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TeamSelector from "@/Components/genralComp/TeamSelector";
import FirstTimeCard from "@/Components/genralComp/FirstTimeCard";

const Index = ({pulses, teams}: { pulses: any, teams: Team[] }) => {
    const {auth} = usePage<PageProps>().props;

    const handleChange = (teamId) => {
        router.get(route('teams.switch', {team: teamId}));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            title='Pulses'
            header={
                <span className='flex items-center gap-2'>
          <Link href={route('pulses.index')}>
            <ArrowBackIcon className='!text-white hover:-translate-x-1 duration-300 ease-in-out'/>
          </Link>
          <h2 className="font-semibold text-xl text-white leading-tight">Pulses Feed</h2>
        </span>
            }
        >
            <Stack justifyContent='start' gap={3} padding={3}>
                <div className='flex flex-col sm:flex-row justify-between items-center gap-3'>
                    <TeamSelector
                        placeholder='Filter posts by: Global / Team'
                        teams={teams}
                        className='!text-white'
                        currentTeamId={auth.currentTeam?.id}
                        onChange={handleChange}
                    />
                    <SearchBar
                        type={dataType.pulses}
                        placeholder='find a pulse by title ...'
                    />
                    <Link href={route('pulses.create')}>
                        <PrimaryButton> Create Pulse</PrimaryButton>
                    </Link>
                </div>

                {pulses.data.length > 0 ? (
                    <motion.div
                        layout
                        className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3'
                    >
                        {pulses.data.map((pulse: Pulse, i: number) => (
                            <motion.div
                                key={pulse.id}
                                initial={{y: -50, opacity: 0}}
                                animate={{y: 0, opacity: 1}}
                                transition={{duration: 0.3, delay: i * 0.1}}
                            >
                                <PulseCard pulse={pulse}/>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <FirstTimeCard
                        bodyText={'it seems there are no pulses in the currently selected team. Be the first to write a pulse.'}
                    >
                        <Link href={route('pulses.create')}>
                            <PrimaryButton>Create Pulse</PrimaryButton>
                        </Link>
                    </FirstTimeCard>
                )}

                <Stack justifyContent='center' alignItems='center'>
                    <Box maxWidth={'fit-content'}>
                        <Pagination currentPage={pulses.current_page}
                                    lastPage={pulses.last_page} paginatedDataName={'pulses'}/>
                    </Box>
                </Stack>
            </Stack>
        </AuthenticatedLayout>
    );
};

export default Index;
