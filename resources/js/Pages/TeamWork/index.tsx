import React, {useState} from 'react';
import {Link, useForm} from '@inertiajs/react';
import {
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {motion} from 'framer-motion';
import CreateTeamForm from "@/Pages/TeamWork/create";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import EditTeamForm from "@/Pages/TeamWork/edit";
import {Add, Delete, Edit, Logout, PeopleAlt} from "@mui/icons-material";
import {LogInIcon} from "lucide-react";
import Swal from "sweetalert2";
import {Team} from "@/types";

const TeamsList = ({teams, auth}) => {
    const {delete: destroy} = useForm();

    const [openCreateForm, setOpenCreateForm] = useState(false)
    const [editTeamId, setEditTeamId] = useState(null);
    const isOwnerOfTeam = (team) => auth.user.id == team.owner_id;

    const handleDelete = (teamId: number) => {
        Swal.fire({
            title: "You won't be able to revert this?",
            text: "all the team data will be removed including messages and pulses",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000",
            cancelButtonColor: "#57534e",
            confirmButtonText: "Yes, delete it!"
        }).then((result: any) => {
            if (result.isConfirmed) {
                destroy(route('teams.destroy', teamId), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Deleted!",
                            text: `Team has been deleted.`,
                            icon: "success"
                        });
                    },
                    onError: (errors: any) => {
                        console.error(errors);
                    },
                });
            }
        });
    };

    const handleLeave = (teamId: number, teamName: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: `You are about to leave team ${teamName}!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000",
            cancelButtonColor: "#57534e",
            confirmButtonText: "Yes, leave it!"
        }).then((result: any) => {
            if (result.isConfirmed) {
                destroy(route('teams.members.destroy', {id: teamId, user_id: auth.user.id}), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "you left the team!",
                            text: `you left ${teamName} successfully .`,
                            icon: "success"
                        });
                    },
                    onError: (errors: any) => {
                        console.error(errors);
                    },
                });
            }
        });
    };


    const renderTeams = () => {
        return (
            <Table className="bg-transparent">
                <TableHead>
                    <TableRow>
                        <TableCell className="!text-white">Name</TableCell>
                        <TableCell className="!text-white">Status</TableCell>
                        <TableCell className="!text-white">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {teams.map((team: Team) => (
                        <TableRow key={team.id} className="hover:bg-black/20">
                            <TableCell className="!text-white">{team.name}</TableCell>
                            <TableCell>
                                {isOwnerOfTeam(team) ? (
                                    <Chip label="Owner" className="!bg-indigo-600 !text-white"/>
                                ) : (
                                    <Chip label="Member" className="!bg-indigo-600 !text-white"/>
                                )}
                            </TableCell>
                            <TableCell className="space-x-1">
                                {auth.currentTeam?.id !== team.id ? (
                                    <Link href={route('teams.switch', team.id)} className="mr-2">
                                        <Button variant="outlined" size="small" startIcon={<LogInIcon/>}
                                                className="!text-white !border-white">
                                            Switch
                                        </Button>
                                    </Link>
                                ) : (
                                    <Chip label="Current team" className="!bg-indigo-700 !text-white"/>
                                )}
                                <Link href={route('teams.members.show', team.id)}>
                                    <Button variant="outlined" size="small" startIcon={<PeopleAlt/>}
                                            className="!text-white !border-white">
                                        Members
                                    </Button>
                                </Link>

                                {isOwnerOfTeam(team) ? (
                                    <>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<Edit/>}
                                            onClick={() => setEditTeamId(team.id)}
                                            className="!text-white !border-white"
                                        >
                                            Edit
                                        </Button>
                                        {editTeamId === team.id && (
                                            <EditTeamForm
                                                open={editTeamId === team.id}
                                                setOpen={() => setEditTeamId(null)}
                                                team={team}
                                            />
                                        )}
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            startIcon={<Delete/>}
                                            onClick={() => handleDelete(team.id)}
                                            className="!text-red-400 !border-red-400"
                                        >
                                            Delete
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        startIcon={<Logout/>}
                                        onClick={() => handleLeave(team.id, team.name)}
                                        className="text-red-600 border-red-600"
                                    >
                                        Leave Team
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            title="My Teams"
            header={<Typography variant="h4" className="text-white font-semibold">My Teams</Typography>}
        >
            <motion.div
                className={`max-w-3xl mx-auto bg-black/30 rounded-3xl`}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <Typography variant="h6" className="text-white">Teams</Typography>
                        <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Add/>}
                            onClick={() => setOpenCreateForm(true)}
                            className="!text-white !border-white"
                        >
                            Create Team
                        </Button>
                        <CreateTeamForm open={openCreateForm} setOpen={setOpenCreateForm}/>
                    </div>
                    <TableContainer>
                        {teams.length > 0 ? (
                            renderTeams()
                        ) : (
                            <p className="text-gray-300 text-center w-full p-5">
                                It seems you don't belong to any team at the moment. You can create a team or join
                                existing teams.
                            </p>
                        )}
                    </TableContainer>
                </div>
            </motion.div>
        </AuthenticatedLayout>

    );


};

export default TeamsList;
