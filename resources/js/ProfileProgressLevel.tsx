import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Tooltip, Typography, Box } from "@mui/material";
import { getLevel } from "@/utils";
import StarIcon from "@mui/icons-material/Star";

const MAX_LEVEL = 100;

const ProfileProgressLevel = ({ xp, xpActions }) => {
    const level = getLevel(xp);
    const progress = xp % 1000;
    const progressPercentage = (progress / 1000) * 100;
    const isMaxLevel = level >= MAX_LEVEL;

    const [showParticles, setShowParticles] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        controls.start({
            width: isMaxLevel ? "100%" : `${progressPercentage}%`,
            transition: { duration: 1.5, ease: "easeInOut" },
        }).then(() => {
            setShowParticles(true);
        });
    }, [isMaxLevel, progressPercentage, controls]);

    const xpExplanation = (
        <Box sx={{ width: 300, p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography
                variant="body2"
                sx={{
                    fontStyle: "italic",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                }}
            >
                {!isMaxLevel ? (
                    <>
                        <strong style={{ color: "#4fc3f7" }}>
                            {1000 - progress}
                        </strong>{" "}
                        XP to next level!
                    </>
                ) : (
                    "Congratulations! You've reached the maximum level!"
                )}
            </Typography>
            {!isMaxLevel && (
                <Box sx={{ mt: 1 }}>
                    {Object.entries(xpActions).map(
                        ([action, points]: [string, number]) => (
                            <Typography
                                key={action}
                                variant="body2"
                                sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.8rem" },
                                }}
                            >
                                {action.replace(/_/g, " ").toLowerCase()}: <strong style={{ color: "#4fc3f7" }}>{points}pts</strong>
                            </Typography>
                        )
                    )}
                </Box>
            )}
        </Box>
    );

    return (
        <Box
            sx={{
                width: "100%",
                p: 3,
                bgcolor: "rgba(0,0,0,0.8)",
                borderRadius: 4,
                fontFamily: "JetBrains Mono, monospace",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <Typography
                variant="h6"
                align="center"
                sx={{ mb: 1, color: "white" }}
            >
                {isMaxLevel ? `Level ${MAX_LEVEL}` : `Level ${level}`}
            </Typography>
            <Tooltip title={xpExplanation} arrow placement="top">
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: "20px",
                        bgcolor: isMaxLevel
                            ? "rgba(255,215,0,0.3)"
                            : "rgba(255,255,255,0.1)",
                        borderRadius: "10px",
                        overflow: "hidden",
                        cursor: "help",
                    }}
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={controls}
                        style={{
                            height: "100%",
                            background: isMaxLevel
                                ? "linear-gradient(90deg, #ffd700, #f9a825)"
                                : "linear-gradient(90deg, #2196f3, #4fc3f7)",
                            borderRadius: "10px",
                            position: "relative",
                        }}
                    />
                    {showParticles && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: `${progressPercentage}%`,
                                height: "100%",
                                pointerEvents: "none",
                                overflow: "hidden",
                            }}
                        >
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        position: "absolute",
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        backgroundColor: isMaxLevel
                                            ? "#ffd700"
                                            : "#4fc3f7",
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        x: [0, Math.random() * 20 - 10],
                                        y: [0, Math.random() * 20 - 10],
                                        opacity: [1, 0],
                                        scale: [1, 0.5],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: Math.random() * 2,
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </Tooltip>
            <Typography
                variant="body2"
                align="center"
                sx={{ mt: 2, color: "white" }}
            >
                {isMaxLevel
                    ? "Max level reached!"
                    : `${Math.round(progressPercentage)}% completed`}
            </Typography>
            {isMaxLevel && (
                <motion.div
                    style={{
                        position: "absolute",
                        top: "-20px",
                        right: "-20px",
                    }}
                    animate={{
                        rotate: 360,
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    <StarIcon sx={{ fontSize: 60, color: "#ffd700" }} />
                </motion.div>
            )}
        </Box>
    );
};

export default ProfileProgressLevel;
