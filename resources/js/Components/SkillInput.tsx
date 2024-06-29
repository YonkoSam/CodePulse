import React, {useEffect, useState} from 'react';
import {Box, Chip} from '@mui/material';
import {Cancel} from '@mui/icons-material';
import TextInput from "@/Components/TextInput";

const SkillInput = ({skills, setSkills, onSkillsChange}) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (onSkillsChange) {
            onSkillsChange(skills.join(', '));
        }
    }, [skills]);

    const handleAddSkill = (event) => {
        if (event.key === 'Enter' && inputValue.trim()) {
            event.preventDefault();

            const newSkills = [...skills, inputValue.trim()];
            setSkills(newSkills);
            setInputValue('');
            if (onSkillsChange) {
                onSkillsChange(newSkills.join(', '));
            }
        }
    };

    const handleDeleteSkill = (skillToDelete) => {
        const newSkills = skills.filter(skill => skill !== skillToDelete);
        setSkills(newSkills);
        if (onSkillsChange) {
            onSkillsChange(newSkills.join(', '));
        }
    };

    return (
        <Box>
            <TextInput
                variant="outlined"
                placeholder="Add a Skill and Press Enter"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleAddSkill}
                fullWidth
            />
            <Box mt={2} display="flex" flexWrap="wrap" gap={1}
                 className={`bg-white rounded  ${skills?.length > 0 ? 'py-2 px-1' : ''} `}>
                {skills?.map((skill, index) => (
                    <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleDeleteSkill(skill)}
                        deleteIcon={<Cancel/>}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default SkillInput;
