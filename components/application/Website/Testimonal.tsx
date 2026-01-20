"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { CustomArrowProps } from "react-slick";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { IoStar } from "react-icons/io5";
import { BsChatQuote } from "react-icons/bs";
import { useState, useEffect } from "react";

const ArrowNext = (props: CustomArrowProps) => {
    const { onClick } = props;
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white right-10"
        >
            <LuChevronRight size={25} className="text-gray-600" />
        </button>
    );
};
const ArrowPrevious = (props: CustomArrowProps) => {
    const { onClick } = props;
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-14 h-14 flex justify-center items-center rounded-full absolute z-10 top-1/2 -translate-y-1/2 bg-white left-10"
        >
            <LuChevronLeft size={25} className="text-gray-600" />
        </button>
    );
};

const testimonials = [
    {
        name: "Amit Sharma",
        rating: 5,
        review: `The overall experience was absolutely fantastic.
The product quality exceeded my expectations in every way.
I would highly recommend this to anyone looking for reliability and value.`,
    },
    {
        name: "Priya Verma",
        rating: 4,
        review: `I am really impressed with the design and usability.
Customer support was responsive and helpful throughout.
Definitely worth considering for long-term use.`,
    },
    {
        name: "Rahul Mehta",
        rating: 5,
        review: `From ordering to delivery, everything went smoothly.
The performance has been consistent and dependable.
This is one of the best purchases I have made recently.`,
    },
    {
        name: "Sneha Kapoor",
        rating: 4,
        review: `The interface is clean and very easy to navigate.
It helped me save a lot of time and effort.
Overall, I am quite satisfied with the experience.`,
    },
    {
        name: "Vikas Patel",
        rating: 5,
        review: `The quality of service is top-notch and professional.
Every feature works exactly as promised.
I will definitely continue using this in the future.`,
    },
    {
        name: "Neha Singh",
        rating: 4,
        review: `I found the product to be very user-friendly.
It performs well even under heavy usage.
A solid option for anyone looking for consistency.`,
    },
    {
        name: "Arjun Rao",
        rating: 5,
        review: `The attention to detail in this product is impressive.
It delivers excellent results without any hassle.
I am extremely happy with my decision to choose this.`,
    },
    {
        name: "Pooja Malhotra",
        rating: 4,
        review: `The setup process was quick and straightforward.
Features are thoughtfully designed and practical.
Overall, it provides great value for the price.`,
    },
    {
        name: "Kunal Desai",
        rating: 5,
        review: `I have been using this for a while now.
The performance has remained stable and efficient.
It clearly stands out compared to similar options.`,
    },
    {
        name: "Anjali Iyer",
        rating: 4,
        review: `The product meets all my basic and advanced needs.
Support documentation is clear and easy to follow.
I would confidently recommend this to others.`,
    },
];

const Testimonal = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: windowWidth < 480 ? 1 : windowWidth < 600 ? 2 : windowWidth < 1024 ? 3 : 4,
        slidesToScroll: windowWidth < 480 ? 1 : windowWidth < 600 ? 2 : windowWidth < 1024 ? 3 : 4,
        nextArrow: <ArrowNext />,
        prevArrow: <ArrowPrevious />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                },
            },
        ],
    };
    return (
        <section className="sm:pt-20 pt-5 pb-10">
            <h2 className="text-center sm:text-4xl text-2xl mb-5 font-semibold">Customer Reviews</h2>
            <Slider {...settings}>
                {
                    testimonials.map((dt,index)=>(
                        <div key={index} className="p-5">
                            <div className="border rounded-lg p-5 min-h-[250px]">
                                <BsChatQuote size={30} className="mb-3" />
                                <p className="mb-5">
                                    {dt.review}
                                </p>
                                <h4 className="font-semibold">{dt.name}</h4>
                                <div className="flex mt-1">
                                    {
                                        Array.from({length: dt.rating}).map((_,i)=>(
                                            <IoStar key={`star${i}`} className="text-yellow-400" size={20} />
                                        ))
                                    }
                                    
                                </div>
                            </div>
                        </div>

                    ))
                }
               
            </Slider>

        </section>
    );
};

export default Testimonal;