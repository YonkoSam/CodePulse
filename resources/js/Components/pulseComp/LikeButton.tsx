import {Badge} from "@mui/material";
import {motion} from "framer-motion";
import {FavoriteBorder} from "@mui/icons-material";
import PulseEffect from "@/Components/animatedComp/PulseEffect";
import React, {useState} from "react";
import axios from "axios";

function LikeButton({likes, pulseId, commentId = null, authId}) {

    const [like, setLike] = useState(likes.some(like => like.user_id === authId))
    const [likesCount, setLikesCount] = useState(likes.length);
    const [loading, setLoading] = useState(false)

    const handleLike = () => {
        setLoading(true);
        axios.post(route('like.store', {'pulse_id': pulseId, 'comment_id': commentId}))
            .then(response => {
                const {like} = response.data;
                setLike(like);
                if (like) {
                    setLikesCount(prevState => prevState + 1);
                } else {
                    setLikesCount(prevState => prevState - 1);
                }
            })
            .catch(error => {
                console.log(error.message);
            })
            .finally(() =>
                setLoading(false)
            );
    }


    return <div className='relative'>
        <Badge
            component={motion.div}
            whileTap={{scale: loading ? 1 : 0.5}}
            transition={{duration: 1, type: "spring"}}
            color={"primary"}
            onClick={loading ? undefined : handleLike}
            className={`!absolute !right-3 !top-3 z-50   ${loading ? "cursor-wait" : 'cursor-pointer'}`}
            style={{color: like ? "#4f46e5" : "#fff"}}
            badgeContent={likesCount}
            overlap="circular">
            <FavoriteBorder className="!h-8 !w-8"/>
        </Badge>
        <PulseEffect
            color={like ? "#4f46e5" : "#fff"}/>
    </div>;
}


export default LikeButton;
