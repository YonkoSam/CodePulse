import React, {useState} from 'react';
import {useForm} from '@inertiajs/inertia-react';
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from '@mui/material';
import {motion} from 'framer-motion';
import SpringModal from "@/Components/ui/SpringModal";
import axios from "axios";
import {Toast} from "@/utils";
import TextInput from "@/Components/formComp/TextInput";
import PrimaryButton from "@/Components/formComp/PrimaryButton";

const ReportForm = ({open, setOpen, reportableType, reportableId}) => {
    const initialValue = {
        reason: '',
        additional_text: ''
    };

    const [errors, setErrors] = useState(initialValue);
    const [loading, setLoading] = useState(false);
    const {data, setData, reset} = useForm({
        ...initialValue,
        reportable_type: reportableType,
        reportable_id: reportableId,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors(initialValue);
        axios.post(route('report'), data)
            .then((r) => {
                reset();
                Toast.fire({
                    icon: 'success',
                    text: r.data?.status,
                });
            })
            .catch((e) => setErrors(e.response.data?.errors)).finally(() => setLoading(false));
    };

    return (
        <SpringModal isOpen={open} setIsOpen={setOpen}>
            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                exit={{opacity: 0, y: -20}}
                className="antialiased text-white bg-gradient-to-br from-purple-900 to-indigo-900 p-6 rounded-xl shadow-2xl"
            >
                <div className="max-w-2xl mx-auto">
                    <motion.h1
                        initial={{opacity: 0, y: -20}}
                        animate={{opacity: 1, y: 0}}
                        className="font-bold text-center text-3xl mb-8 "
                    >
                        Report an Issue
                    </motion.h1>
                    <p className="text-center  mb-8">
                        Thanks for looking out for yourself and your fellow CodeMates. Let us know what's happening, and
                        we'll look into it.
                    </p>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="report-type-label" className="!text-white">Select an option</InputLabel>
                            <Select
                                labelId="report-type-label"
                                id="report-type"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                                label="Select an option"
                                className="bg-gray-800/50 !text-white"
                            >
                                <MenuItem value="">Select an option</MenuItem>
                                <MenuItem value={1}>Inappropriate Content</MenuItem>
                                <MenuItem value={2}>Spam</MenuItem>
                                <MenuItem value={3}>Harassment</MenuItem>
                                <MenuItem value={4}>Other</MenuItem>
                            </Select>
                            {errors?.reason && <FormHelperText error>{errors.reason}</FormHelperText>}
                        </FormControl>

                        <TextInput
                            isTextArea
                            label="Tell us More"
                            value={data.additional_text}
                            onChange={(e) => setData('additional_text', e.target.value)}
                            placeholder="Tell us More"
                        />
                        {errors?.additional_text && <FormHelperText error>{errors.additional_text}</FormHelperText>}

                        <motion.div
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                        >
                            <PrimaryButton
                                type="submit"
                                disabled={loading}
                                className='w-full'
                            >
                                {loading ? 'Submitting...' : 'Submit Report'}
                            </PrimaryButton>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </SpringModal>
    );
};

export default ReportForm;
