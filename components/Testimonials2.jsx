"use client";
import Star from "@/utils/Star";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const reviews = [
  {
    description:
      "This platform has revolutionized how we stay updated on SaaS and AI trends. The real-time updates and in-depth insights are invaluable for our strategic planning.",
    stars: 5,
    author: "John Doe",
    position: "CEO of Tech Innovations",
  },
  {
    description:
      "This platform has revolutionized how we stay updated on SaaS and AI trends. The real-time updates and in-depth insights are invaluable for our strategic planning.",
    stars: 5,
    author: "John Doe",
    position: "CEO of Tech Innovations",
  },
  {
    description:
      "This platform has revolutionized how we stay updated on SaaS and AI trends. The real-time updates and in-depth insights are invaluable for our strategic planning.",
    stars: 5,
    author: "John Doe",
    position: "CEO of Tech Innovations",
  },
  {
    description:
      "This platform has revolutionized how we stay updated on SaaS and AI trends. The real-time updates and in-depth insights are invaluable for our strategic planning.",
    stars: 5,
    author: "John Doe",
    position: "CEO of Tech Innovations",
  },
  {
    description:
      "This platform has revolutionized how we stay updated on SaaS and AI trends. The real-time updates and in-depth insights are invaluable for our strategic planning.",
    stars: 5,
    author: "John Doe",
    position: "CEO of Tech Innovations",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };

  const calculateOpacity = (index) => {
    const distance = Math.abs(currentIndex - index);
    return 1 - distance * 0.15; // Opacity decreases by 25% per card distance
  };
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 1500
  };
  return (
    <div className="slider-container relative">
      <Slider {...settings}>
        {reviews.map((review, index) => (
          <div
            key={index}
            className=" bg-gray-100 text-black  border-2 border-gray-300 rounded-lg min-w-[300px] max-w-[300px] border-gradient p-5 space-y-3"
          >
            <Star stars={5} />
            <Image
              src="/images/review-icon.svg"
              height={60}
              width={60}
              alt="review icon"
            />
            <div className="text-sm">{review.description}</div>
            <div className="mt-4">
              <div className="text-xs">{review.author}</div>
              <div className="text-xs text-[#B3B3B3]">{review.position}</div>
            </div>
          </div>
        ))}

        </Slider>
        <div className="absolute top-80 right-50 z-10 gradient-02 w-96 h-96" />
        <div className="absolute -bottom-0 right-50 z-10 gradient-01 w-96 h-96" />
    </div>
  );
};

export default Testimonials;
