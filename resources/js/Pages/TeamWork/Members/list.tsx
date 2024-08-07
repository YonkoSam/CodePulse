import React, {useEffect, useState} from 'react';
import {Link, useForm} from '@inertiajs/react';
import {
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {motion} from 'framer-motion';
import SearchBar from "@/Components/genralComp/SearchBar";
import {dataType, Toast} from "@/utils";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FriendStatus from "@/Pages/Friends/FriendStatus";
import InputError from "@/Components/formComp/InputError";
import {Delete, Email} from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import {User} from "@/types";
import TextInput from "@/Components/formComp/TextInput";
import {AnimatedText} from "@/Components/animatedComp/AnimatedText";

const TeamMembers = ({team, auth}) => {
    const {data, setData, post, reset, errors, delete: destroy} = useForm({
        email: '',
        id: '',
    });

    const [selectedUser, setSelectedUser] = useState(null);
    const isOwnerOfTeam = (team) => team.owner_id == auth.user.id;

    useEffect(() => {
        setData('id', selectedUser?.id)
    }, [selectedUser])
    const handleInvite = (e) => {
        e.preventDefault();

        post(route('teams.members.invite', team.id), {
            onSuccess: () => {
                Toast.fire({
                    icon: 'success',
                    title: 'invitation send successfully'
                })
                setSelectedUser(null)
                reset();

            }
        });
    };

    const handleDeleteMember = (userId: number, userName: string) => {

        Swal.fire({
            title: "Are you sure?",
            text: `You are about to delete ${userName} from ${team.name}!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ff0000",
            cancelButtonColor: "#57534e",
            confirmButtonText: "Yes, delete him!"
        }).then((result: any) => {
            if (result.isConfirmed) {
                destroy(route('teams.members.destroy', [team.id, userId]), {
                    onSuccess: () => {
                        Swal.fire({
                            title: "Deleted!",
                            text: ` ${userName} has been deleted successfully .`,
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            title="Team Members"
            header={<Typography variant="h4" className="text-white font-semibold">Team Members</Typography>}
        >
            <div className="p-4">
                <motion.div
                    className="max-w-2xl mx-auto"
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5}}
                >
                    <div className="p-6 mb-6 bg-black/30 text-white rounded-2xl">
                        <div className="flex justify-start items-center mb-4 gap-2">
                            <Link href={route('teams.index')}>
                                <IconButton
                                    size="small"
                                    className="!border-gray-400 !text-gray-400"
                                >
                                    <ArrowBackIcon/>
                                </IconButton>
                            </Link>
                            <Typography variant="h6" className="!text-white">Members of team "{team.name}"</Typography>
                        </div>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="!text-white">Name</TableCell>
                                        <TableCell className="!text-white">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {team.users.map((user: User) => (
                                        <TableRow key={user.id} className="hover:bg-gray-700">
                                            <TableCell className="!text-white">{user.name}</TableCell>
                                            <TableCell>
                                                {isOwnerOfTeam(team) && auth.user.id !== user.id && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        className="!text-red-400 !border-red-800 hover:text-white"
                                                        startIcon={<Delete/>}
                                                        onClick={() => handleDeleteMember(user.id, user.name)}
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    <div className="p-6 mb-6 bg-black/30 text-white rounded-2xl">
                        <Typography variant="h6" className="mb-4 !text-white">Pending Invitations</Typography>
                        <TableContainer>
                            <Table>
                                <TableHead className="bg-gray-700 !important">
                                    <TableRow>
                                        <TableCell className="!text-white">E-Mail</TableCell>
                                        <TableCell className="!text-white">Action</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {team.invites.length ? team.invites.map((invite) => (
                                            <TableRow key={invite.id} className="hover:bg-gray-700">
                                                <TableCell className="!text-white">
                                                    {invite.email}
                                                </TableCell>
                                                <TableCell>
                                                    <Link href={route('teams.members.resend_invite', invite.id)}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            className="!border-gray-400 !text-gray-400 "
                                                            startIcon={<Email/>}
                                                        >
                                                            Resend invite
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        )) :
                                        <TableRow>
                                            <TableCell>
                                                <AnimatedText text={'no pending invites found'}
                                                              className='text-white '/>
                                            </TableCell>
                                        </TableRow>
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    <div className="p-6 bg-black/30 text-white rounded-2xl">
                        <Typography variant="h6" className="mb-4 !text-white">Invite to team "{team.name}"</Typography>
                        <SearchBar type={dataType.Users} placeholder="type the name of the user You want to invite"
                                   setSelectedObject={setSelectedUser}/>
                        <form onSubmit={handleInvite}>
                            <div className="mb-4">
                                {selectedUser ? (
                                    <FriendStatus friend={selectedUser} enableBadge={false}/>
                                ) : (
                                    <TextInput
                                        type='email'
                                        value={data.email}
                                        placeholder='or invite by Email'
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                )}
                            </div>
                            <InputError message={errors.email}/>
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    className="!bg-blue-500 hover:bg-blue-600 !text-white"
                                    startIcon={<Email/>}
                                >
                                    Invite to Team
                                </Button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AuthenticatedLayout>


    );
};

export default TeamMembers;
