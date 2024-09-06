import React from 'react';
import {motion} from 'framer-motion';
import {Tooltip} from '@mui/material';
import {getLevel} from "@/utils";

const MAX_LEVEL = 100;

const ProfileProgressLevel = ({xp, xpActions}) => {
    const level = getLevel(xp);
    const progress = xp % 1000;
    const progressPercentage = (progress / 1000) * 100;

    const isMaxLevel = level >= MAX_LEVEL;

    const xpExplanation = (
        <div className="w-72 px-2">
            {!isMaxLevel ? (
                <>
                    <p className="mb-3 border-b border-solid border-grey-600/50 pb-2 italic">
                        <strong className="text-blue-400">{1000 - progress}</strong> experience to go until the next
                        level!
                    </p>
                    <p className="mb-2">
                        <strong>In case you were wondering, you earn XP when you:</strong>
                    </p>
                    <ul className="pl-4 list-disc">
                        {Object.entries(xpActions).map(([action, points]: [action: string, points: number]) => (
                            <li key={action}>
                                {action.replace(/_/g, ' ').toLowerCase()} <span
                                className="font-bold text-blue-400">— {points}pts</span>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p className="text-blue-400 italic">Congratulations! You've reached the maximum level!</p>
            )}
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center w-full p-2 bg-black/80 rounded-3xl font-jetBrains">
            <div className="text-center mb-1">
                <span className="text-white font-semibold text-sm">
                    {isMaxLevel ? `Level ${MAX_LEVEL}` : `Level ${level}`}
                </span>
            </div>
            <Tooltip
                title={xpExplanation}
                arrow
                placement="top"
            >
                <div
                    className={`relative w-2/3 h-2 ${isMaxLevel ? 'bg-amber-600' : 'bg-gray-300'} rounded-full overflow-hidden cursor-help`}>
                    <motion.div
                        initial={{width: 0}}
                        animate={{width: isMaxLevel ? '100%' : `${progressPercentage}%`}}
                        transition={{duration: 1, ease: 'easeInOut'}}
                        className={`h-full ${isMaxLevel ? 'bg-gold' : 'bg-blue-500'} rounded-full`}
                    />
                </div>
            </Tooltip>
            <div className="text-center mt-2">
                <span className="text-white font-semibold text-sm">
                    {isMaxLevel ? 'Max level reached!' : `${Math.round(progressPercentage)}% completed`}
                </span>
            </div>
        </div>
    );
};

export default ProfileProgressLevel;
