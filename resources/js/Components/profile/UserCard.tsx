import {Avatar} from '@mui/material';
import {motion} from 'framer-motion';
import {Link} from "@inertiajs/react";

const UserCard = ({friend}) => {

    function generateLightColor() {
        const red = Math.floor(Math.random() * 156) + 100;   // 100 to 255
        const green = Math.floor(Math.random() * 156) + 100; // 100 to 255
        const blue = Math.floor(Math.random() * 156) + 100;  // 100 to 255

        const rgbToHex = (r, g, b) => {
            return "#" +
                (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
        };

        return rgbToHex(red, green, blue);
    }


    const color = generateLightColor();
    return (
        <Link href={route('profiles.show', friend.profile.id)}>
            <motion.div
                className="mx-auto px-5"
                whileHover={{
                    scale: 1.1,
                    rotate: 2,
                    transition: {duration: 0.3},
                }}
                whileTap={{scale: 0.95}}
            >
                <motion.div
                    className="max-w-xs cursor-pointer bg-black/30 p-2 mb-4 shadow-lg rounded-2xl"
                    initial={{opacity: 0, y: 50}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.5, type: 'spring', stiffness: 50}}
                >
                    <motion.div
                        whileHover={{
                            scale: 1.1,
                            rotate: 5,
                            transition: {duration: 0.3},
                        }}
                    >
                        <Avatar
                            className="!w-32 !h-32 lg:!w-44 lg:!h-44 !rounded-2xl  mx-auto !object-cover !object-top"
                            src={friend.profile_image}
                            alt={friend.name}
                        />
                    </motion.div>
                    <motion.p
                        className="my-4 pl-4 font-bold text-white"
                        whileHover={{color: color, scale: 1.1}}
                    >
                        {friend.name}
                    </motion.p>
                    <motion.p
                        className="mb-4 ml-4 text-xl font-semibold text-white"
                        whileHover={{color: color, scale: 1.1}}
                    >
                        {friend.profile.status}
                    </motion.p>
                </motion.div>
            </motion.div>
        </Link>
    );
};

export default UserCard;
