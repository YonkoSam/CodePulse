import React, { useEffect, useState } from "react";
import { audio, BACKGROUND_GRADIENT } from "@/utils";
import { motion } from "framer-motion";
import SpringModal from "@/Components/ui/SpringModal";
import Lottie from "lottie-react";
import confetti from ".././assets/images/confetti.json";

const UserLevelUpNotification = ({ user }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [levelData, setLevelData] = useState({ level: 0, xp: 0 });

    useEffect(() => {
        window.Echo.channel(`user-level-up-${user.id}`).listen(
            ".level-up",
            async (e) => {
                setLevelData({ level: e.newLevel, xp: e.xp });
                setIsModalOpen(true);
                audio.play().catch((err) => "playback error");
            }
        );

        return () => {
            window.Echo.leaveChannel(`user-level-up-${user.id}`);
        };
    }, [user.id]);

    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <SpringModal isOpen={isModalOpen} setIsOpen={handleClose}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="relative text-center p-12 overflow-hidden"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, type: "spring", stiffness: 200 }}
                    className={`absolute inset-0 rounded-full ${BACKGROUND_GRADIENT} blur-2xl opacity-50`}
                />
                <div className="z-0 absolute max-h-full">
                    <Lottie animationData={confetti} loop={true} />
                </div>

                <motion.div
                    initial={{ scale: 0.5, opacity: 0, rotate: 90 }}
                    animate={{ scale: 1.2, opacity: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.2,
                    }}
                    className="relative z-10 text-3xl font-extrabold text-yellow-400 mb-4"
                >
                    🎉🎊 Incredible Level Up! 🎊🎉
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.4,
                    }}
                    className="relative z-10 text-3xl font-bold text-white"
                >
                    Wow! You're absolutely crushing it!
                    <br />
                    You've soared to level {levelData.level}!
                </motion.div>

                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: 0.6,
                    }}
                    className="relative z-10 text-2xl text-blue-300 mt-4"
                >
                    Your XP is now a jaw-dropping {levelData.xp}!
                    <br />
                    You're on fire! 🔥
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    className="relative z-10 mt-8"
                >
                    <button
                        onClick={handleClose}
                        className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 text-xl font-bold rounded-full shadow-lg hover:from-yellow-500 hover:to-orange-600 transition duration-200 transform hover:-translate-y-1"
                    >
                        Let's Keep Rocking! 🚀
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="absolute inset-0 overflow-hidden z-0"
                >
                    {[...Array(5)].map((_, index) => (
                        <motion.div
                            key={index}
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 0.5 }}
                            transition={{
                                delay: 1 + index * 0.2,
                                duration: 1.5,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            className={`absolute w-${20 + index * 4} h-${
                                20 + index * 4
                            } rounded-full blur-xl opacity-50`}
                            style={{
                                left: `${20 * index}%`,
                                backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </SpringModal>
    );
};

export default UserLevelUpNotification;
