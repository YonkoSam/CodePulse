import React, {useEffect, useState} from 'react';
import {Box, Chip, Stack} from '@mui/material';
import {Cancel} from '@mui/icons-material';
import TextInput from "@/Components/formComp/TextInput";
import PrimaryButton from "@/Components/formComp/PrimaryButton";

const SkillInput = ({skills, setSkills, onSkillsChange}) => {
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (onSkillsChange) {
            onSkillsChange(skills.join(', '));
        }
    }, [skills]);

    const handleAddSkill = () => {

        const newSkills = [...skills, inputValue.trim()];
        setSkills(newSkills);
        setInputValue('');
        if (onSkillsChange) {
            onSkillsChange(newSkills.join(', '));
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
            <Stack direction="row" spacing={2} alignItems={'center'}>
                <TextInput
                    variant="outlined"
                    placeholder="Add a Skill"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <PrimaryButton className='text-xs mx-1' disabled={inputValue.length <= 0}
                               onClick={handleAddSkill}>
                    Add
                </PrimaryButton>
            </Stack>
            <Box mt={2} display="flex" flexWrap="wrap" gap={1}
                 className={`rounded  ${skills?.length > 0 ? 'py-2 px-1' : ''} `}>
                {skills?.map((skill, index) => (
                    <Chip
                        key={index}
                        label={skill}
                        className='!text-white !bg-gray-800'
                        onDelete={() => handleDeleteSkill(skill)}
                        deleteIcon={<Cancel/>}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default SkillInput;
