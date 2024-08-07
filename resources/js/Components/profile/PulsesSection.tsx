import {Divider} from "@mui/material";
import Slider from "react-slick";
import {Pulse} from "@/types";
import PulseCard from "@/Components/pulseComp/PulseCard";
import React from "react";

const pulsesSection = ({pulses}: { pulses: Pulse[] }) => {

    const pulseSettings = {
        dots: true,
        infinite: pulses.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
    };


    return <div
        className=' mx-2  p-6 min-h-[500px]'>
        <h1 className='text-xl p-4 font-bold text-white'>Pulse Feed</h1>
        <Divider className='!mb-3 !bg-white'/>
        {

            pulses.length > 0 ?
                <Slider {...pulseSettings}>
                    {
                        pulses.map((pulse: Pulse) => (
                            <div key={pulse.id}>
                                <PulseCard pulse={pulse}/>
                            </div>
                        ))}
                </Slider>
                :
                <div
                    className="  px-8 pt-6 pb-8 my-4 ">
                    <div className="mb-4">
                        <h3 className="block text-white py-2  mb-2 text-center">
                            user has no pulses yet !
                        </h3>
                    </div>
                </div>
        }
    </div>
}

export default pulsesSection;
