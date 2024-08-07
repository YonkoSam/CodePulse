import {motion} from "framer-motion";
import React, {useState} from "react";
import {ChevronDown} from "lucide-react";
import {Logout, PeopleAlt, Person, Settings} from "@mui/icons-material";
import {BACKGROUND_GRADIENT} from "@/utils";
import {router} from "@inertiajs/react";

const StaggeredDropDown = ({title}) => {
    const [open, setOpen] = useState(false);

    return (
        <div className=" px-4 sm:px-6 lg:px-8 z-50">
            <motion.div animate={open ? "open" : "closed"} className="relative">
                <button
                    onClick={() => setOpen((pv) => !pv)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-3xl text-white ${BACKGROUND_GRADIENT} hover:bg-indigo-500 transition-colors `}
                >
                    <span className="font-medium text-sm">{title}</span>
                    <motion.span variants={iconVariants}>
                        <ChevronDown/>
                    </motion.span>
                </button>

                <motion.ul
                    initial={wrapperVariants.closed}
                    variants={wrapperVariants}
                    style={{originY: "top", translateX: "-50%"}}
                    className="flex flex-col gap-2 p-2 rounded-2xl bg-white shadow-xl absolute top-[120%] left-[50%] w-48 overflow-hidden"
                >
                    <Option onClick={() => router.visit(route('profiles.edit'))} Icon={Person} text="Edit profile"/>
                    <Option onClick={() => router.visit(route('teams.index'))} Icon={PeopleAlt} text="Teams"/>
                    <Option onClick={() => router.visit(route('profile.edit'))} Icon={Settings} text="Settings"/>
                    <Option onClick={() => router.post(route('logout'))} Icon={Logout} text="Logout"/>
                </motion.ul>
            </motion.div>
        </div>
    );
};

const Option = ({text, Icon, onClick}) => {
    return (
        <motion.li
            variants={itemVariants}
            onClick={() => onClick()}
            className="flex items-center gap-2 w-full p-2 text-xs font-medium whitespace-nowrap rounded-2xl hover:bg-indigo-100 text-slate-700 hover:text-indigo-500 transition-colors cursor-pointer"
        >
            <motion.span variants={actionIconVariants}>
                <Icon/>
            </motion.span>
            <span>{text}</span>
        </motion.li>
    );
};

export default StaggeredDropDown;

const wrapperVariants = {
    open: {
        scaleY: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.1,
        },
    },
    closed: {
        scaleY: 0,
        transition: {
            when: "afterChildren",
            staggerChildren: 0.1,
        },
    },
};

const iconVariants = {
    open: {rotate: 180},
    closed: {rotate: 0},
};

const itemVariants = {
    open: {
        opacity: 1,
        y: 0,
        transition: {
            when: "beforeChildren",
        },
    },
    closed: {
        opacity: 0,
        y: -15,
        transition: {
            when: "afterChildren",
        },
    },
};

const actionIconVariants = {
    open: {scale: 1, y: 0},
    closed: {scale: 0, y: -7},
};


