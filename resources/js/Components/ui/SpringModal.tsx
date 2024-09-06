import {AnimatePresence, motion} from "framer-motion";
import {IconButton} from "@mui/material";
import {CloseRounded} from "@mui/icons-material";


const SpringModal = ({isOpen, setIsOpen, children}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    onClick={() => setIsOpen(false)}
                    className="bg-slate-900/20 backdrop-blur p-8 h-screen fixed inset-0 grid place-items-center  cursor-pointer z-[1060] "
                >
                    <motion.div
                        initial={{scale: 0, rotate: "12.5deg"}}
                        animate={{scale: 1, rotate: "0deg"}}
                        exit={{scale: 0, rotate: "0deg"}}
                        onClick={(e) => e.stopPropagation()}
                        className="relative bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-3xl  max-h-[80vh] w-full overflow-auto max-w-2xl shadow-xl cursor-default  "
                    >
                        {children}

                        <IconButton
                            onClick={() => setIsOpen(false)}
                            className="!absolute !top-2 !right-3 !text-indigo-800 !bg-white hover:scale-105 hover:rotate-6 duration-300 ease-in-out"
                        >
                            <CloseRounded/>
                        </IconButton>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SpringModal;
