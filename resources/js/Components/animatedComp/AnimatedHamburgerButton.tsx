import React, {useState} from "react";
import {motion, MotionConfig} from "framer-motion";
import {BACKGROUND_GRADIENT} from "@/utils";

const AnimatedHamburgerButton = ({size = 'small', onClick}) => {
    const [active, setActive] = useState(false);

    function handleClick() {
        onClick();
        setActive((pv) => !pv);
    }

    return (
        <MotionConfig
            transition={{
                duration: 0.5,
                ease: "easeInOut",
            }}
        >

            <motion.button
                initial={false}
                animate={active ? "open" : "closed"}
                onClick={handleClick}
                className={`relative ${size == 'small' ? 'h-9 w-9' : size == 'medium' ? 'w-12 h-12' : size == 'large' ? 'h-20 w-20' : ''} rounded-full  transition-colors ${BACKGROUND_GRADIENT}`}
            >
                <motion.span
                    variants={VARIANTS.top}
                    className="absolute h-1 w-7 bg-white"
                    style={{y: "-50%", left: "50%", x: "-50%", top: "35%"}}
                />
                <motion.span
                    variants={VARIANTS.middle}
                    className="absolute h-1 w-7 bg-white"
                    style={{left: "50%", x: "-50%", top: "50%", y: "-50%"}}
                />
                <motion.span
                    variants={VARIANTS.bottom}
                    className="absolute h-1 w-2 bg-white"
                    style={{
                        x: "-50%",
                        y: "50%",
                        bottom: "35%",
                        left: "calc(50% + 10px)",
                    }}
                />
            </motion.button>
        </MotionConfig>
    );
};

const VARIANTS = {
    top: {
        open: {
            rotate: ["0deg", "0deg", "45deg"],
            top: ["35%", "50%", "50%"],
        },
        closed: {
            rotate: ["45deg", "0deg", "0deg"],
            top: ["50%", "50%", "35%"],
        },
    },
    middle: {
        open: {
            rotate: ["0deg", "0deg", "-45deg"],
        },
        closed: {
            rotate: ["-45deg", "0deg", "0deg"],
        },
    },
    bottom: {
        open: {
            rotate: ["0deg", "0deg", "45deg"],
            bottom: ["35%", "50%", "50%"],
            left: "50%",
        },
        closed: {
            rotate: ["45deg", "0deg", "0deg"],
            bottom: ["50%", "50%", "35%"],
            left: "calc(50% + 10px)",
        },
    },
};

export default AnimatedHamburgerButton;

