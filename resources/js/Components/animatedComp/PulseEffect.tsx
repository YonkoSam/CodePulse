import {motion} from "framer-motion";
import React from "react";

const PulseEffect = ({color = 'white'}) => {
    return (
        <motion.div className='grid place-items-center'>
            {Array.from({length: 4}, (_, i) => (
                <motion.div
                    key={i}
                    initial={{opacity: 0}}
                    animate={{opacity: [0, 1, 0], scale: 1.1}}
                    style={{
                        borderRadius: "50%",
                        background:
                            "linear-gradient(90deg, rgba(21, 11, 48, 0.2) 0%, rgba(91, 57, 184, 0.2) 100%)",
                        border: `1px solid ${color}`,
                        gridArea: "1 / 1 / 2 / 2",
                        width: `${45 + i * 4}px`,
                        height: `${45 + i * 4}px`,
                        zIndex: 4 - i
                    }}
                    transition={{
                        duration: 1 + i,
                        repeat: Infinity,
                        delay: i * 0.3,
                        repeatDelay: 4 - i - 1,
                        ease: "easeOut"
                    }}
                />
            ))}
        </motion.div>
    );
};


export default PulseEffect;
