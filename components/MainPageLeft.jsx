import Link from "next/link";
import React from "react";

export default function About() {
  return (
    <div className="py-5 lg:py-20 px-2 lg:px-10 ">
      <div className="hidden md:flex absolute left-5 z-10 gradient-01 w-96 h-96" />
      <div className="absolute top-80 right-50 z-10 gradient-02 w-96 h-96" />
      <div className=" space-y-5 ">
        <div className="font-extrabold text-2xl lg:text-4xl tracking-wide text-center lg:text-left">
          WE HELP ANALYZE YOUR HEALTH
        </div>
        <div className="font-semibold text-base lg:text-lg text-center lg:text-left">
          standing in a queue can be overwhelming sometimes
        </div>
        <div className=" lg:max-w-[70%] text-center lg:text-left ">
          That's where we come in. <span className="hidden lg:flex">
          We utilize Lorem ipsum dolor sit amet
          consectetur adipisicing elit. Minus sequi minima vero voluptatibus,
          rem quisquam cum, quod repudiandae delectus accusamus obcaecati
          repellat distinctio?
          </span>
        </div>
        <div className="pt-10 flex space-x-10 justify-center lg:justify-start">
          <div className="bg-green-800 text-white p-1 lg:px-3 lg:p-2  rounded-md ">Upload your reports</div>
          <div className="bg-gray-200 text-black border border-gray-700  p-1 lg:px-5 lg:p-2  rounded-md">Fill your reports</div>
        </div>
      </div>
    </div>
  );
}
