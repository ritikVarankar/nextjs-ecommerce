'use client'
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { CustomArrowProps } from "react-slick";
import { FilePath } from "@/lib/ExportFiles";
import Image from "next/image";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

const ArrowNext=(props:CustomArrowProps)=>{
    const { onClick } = props;
    return(
        <button type="button" onClick={onClick} className="w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white right-10">
            <LuChevronRight size={25} className="text-gray-600" />
        </button>
    )
}
const ArrowPrevious=(props:CustomArrowProps)=>{
    const { onClick } = props;
    return(
        <button type="button" onClick={onClick} className="w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white left-10">
            <LuChevronLeft size={25} className="text-gray-600" />
        </button>
    )
}

const MainSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        nextArrow: <ArrowNext />,
        prevArrow: <ArrowPrevious />,
        responsive: [
            {
                breakpoint: 480,
                settings: {
                    dots: true,
                    arrows: false,
                    nextArrow: undefined,
                    prevArrow: undefined
                }
            }
        ]
    };
  return (
    <div>
        <Slider {...settings}>
            <div>
                <Image src={FilePath.Slider1.src} alt="Slider1" width={FilePath.Slider1.width} height={FilePath.Slider1.height} />
            </div>
            <div>
                <Image src={FilePath.Slider2.src} alt="Slider2" width={FilePath.Slider2.width} height={FilePath.Slider2.height} />
            </div>
            <div>
                <Image src={FilePath.Slider3.src} alt="Slider3" width={FilePath.Slider3.width} height={FilePath.Slider3.height} />
            </div>
            <div>
                <Image src={FilePath.Slider4.src} alt="Slider4" width={FilePath.Slider4.width} height={FilePath.Slider4.height} />
            </div>
        </Slider>
    </div>
  );
};

export default MainSlider;
