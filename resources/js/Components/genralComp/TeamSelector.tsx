import React, {useState} from 'react';
import {FormControl, InputLabel, MenuItem, Select, Typography} from '@mui/material';
import {motion} from 'framer-motion';

const TeamSelector = ({teams, currentTeamId, placeholder, onChange, className = ""}) => {

    const [selectedTeam, setSelectedTeam] = useState(currentTeamId)
    const handleChange = (event) => {
        setSelectedTeam(event.target.value);
        onChange(event.target.value == -1 ? null : event.target.value);
    };

    return (
        <div className="p-2 min-w-52 w-max ">
            <motion.div
                className="max-w-lg mx-auto"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <FormControl fullWidth variant="standard">
                    <InputLabel id="team-selector-label" className={className}>{placeholder}</InputLabel>
                    <Select
                        labelId="team-selector-label"
                        value={selectedTeam || -1}
                        onChange={handleChange}
                        className={className}
                    >
                        <MenuItem key={-1} value={-1}>
                            <Typography variant="body2">
                                Global
                            </Typography>
                        </MenuItem>
                        {teams.map((team) => (
                            <MenuItem key={team.id} value={team.id}>
                                <Typography variant="body2">
                                    {team.name}
                                </Typography>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </motion.div>
        </div>
    );
};

export default TeamSelector;
