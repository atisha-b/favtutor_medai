
import React from "react";
import { motion } from "framer-motion";
import { slideIn, staggerContainer, textVariant } from "../utils/motion";

const FooterComp = () => {
  return (
    <div className="md:m-5 max-w-full rounded-lg md:px-10 5 flex justify-center font-extrabold">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="mt-10 glassmorphism bg-opacity-15 rounded-lg hover:scale-105 transition hover:bg-opacity-25 shadow-xl">
          <div className="">
            <div className="flex justify-center font-bold text-base md:text-2xl pt-5 tracking-wide">
              ABOUT US
            </div>
            <div className="flex justify-center">
              <div className="p-2 md:p-5 text-slate-900 md:text-base text-sm">
                We use NLP to answer your queries and provide you precise evaluation of your reports so that you can escape the struggle of standing in a long queue 
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 bg-white bg-opacity-15 rounded-lg hover:scale-105 transition hover:bg-opacity-25 shadow-xl">
          <div className="flex justify-center font-bold text-base md:text-2xl pt-5 tracking-wide">
            CONTACT US
          </div>
          <div className="flex justify-center">
            <div className="p-2 md:p-5 text-slate-900 md:text-base text-sm">
              You can contact us through our email analyzeReports@gmail.com or through
              our phone number +70 9236912354
            </div>
          </div>
        </div>
        <div className="mt-10 bg-white bg-opacity-15 rounded-lg hover:scale-105 transition hover:bg-opacity-25 shadow-xl">
          <div className="flex justify-center font-bold text-base md:text-2xl pt-5 tracking-wide">
            STEPS TO FOLLOW
          </div>
          <div className="flex justify-center">
            <div className="p-2 md:p-5 text-slate-900 md:text-base text-sm">
              Just sign-up in our application and upload the pdf of the medical
              report in the mentioned area. We will provide you an analysis
              based on your report in no time ;)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterComp;
