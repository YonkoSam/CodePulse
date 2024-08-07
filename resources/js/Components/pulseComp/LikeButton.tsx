import {Badge} from "@mui/material";
import {motion} from "framer-motion";
import {FavoriteBorder} from "@mui/icons-material";
import PulseEffect from "@/Components/animatedComp/PulseEffect";
import React, {useState} from "react";
import axios from "axios";

function LikeButton({likes, pulseId, authId}) {

    const [like, setLike] = useState(likes.some(like => like.user_id === authId))
    const [likesCount, setLikesCount] = useState(likes.length);
    const [loading, setLoading] = useState(false)

    const handleLike = () => {
        setLoading(true);
        axios.post(route('like.store', {'pulse_id': pulseId}))
            .then(response => {
                const [action, like] = response.data;
                setLike(like);
                if (like)
                    setLikesCount(prevState => ++prevState);
                else {
                    setLikesCount(prevState => --prevState);
                }
                setLoading(false);
            })
            .catch(error => console.log(error.message));
    }

    return <div className={`relative ${loading && "pointer-events-none"}`}>
        <Badge
            component={motion.div}
            whileTap={{scale: 0.5}}
            transition={{duration: 1, type: "spring"}}
            color={"primary"}
            onClick={handleLike}
            className="!absolute !right-3 !top-3 z-50  cursor-pointer"
            style={{color: like ? "#1976d2" : "#fff"}}
            badgeContent={likesCount}
            overlap="circular">
            <FavoriteBorder className="!h-8 !w-8"/>
        </Badge>
        <PulseEffect
            color={like ? "#1976d2" : "#fff"}/>
    </div>;
}


export default LikeButton;
