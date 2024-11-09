import Image from "next/image";
import React from "react";
import Testimonials from "./Testimonials2";

const HeroSection = () => {
  return (
    <div className=" p-20">
      <div>
        <div className=" text-center tracking-widest font-semibold text-base">
          A COMPLETE CHECKUP PLATFORM
        </div>
        <div className="text-center text-3xl font-bold mt-5">
          Get your report done in a matter of minutes
        </div>
        <div className="space-x-32 mt-20 flex justify-center">
          <div>
            <Image src="/template.png" height={500} width={500} alt="png1" />
          </div>
          <div className="text-left max-w-[50%]">
            <div className=" font-bold text-lg">Step 1</div>
            <div className="max-w-96 space-y-2">
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi similique cupiditate repellat?
              </div>
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </div>
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Deserunt, voluptatibus!
              </div>
            </div>
          </div>
        </div>
        <div className="space-x-32 mt-20 flex justify-center">
          <div className="text-left max-w-[50%]">
            <div className=" font-bold text-lg">Step 1</div>
            <div className="max-w-96 space-y-2">
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi similique cupiditate repellat?
              </div>
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </div>
              <div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Deserunt, voluptatibus!
              </div>
            </div>
          </div>
          <div>
            <Image src="/template.png" height={500} width={500} alt="png1" />
          </div>
        </div>
      </div>
      <div className="mt-20">
        <div className="font-bold tracking-widest text-center">TESTIMONIALS</div>
        <div className="text-center text-3xl font-bold mt-5">Check out our reviews!</div>
        <div className="mt-10">
        <Testimonials/>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
