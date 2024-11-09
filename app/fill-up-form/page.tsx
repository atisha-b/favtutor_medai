import Header from "@/components/Header";
import React from "react";
import { useState } from "react";
import FillForm from "@/components/FillForm"
const page = () => {

  return (
    <div>
      <div className="h-screen w-full fixed left-0  -z-20   flex items-center justify-center">
        
      </div>
      <div>
        <Header />
      </div>
      <div className="mt-20">
       
        
        <FillForm/>

      </div>
      <div className="hidden md:flex absolute left-5 z-10 gradient-01 w-96 h-96" />
      <div className="absolute top-80 right-50 z-10 gradient-02 w-96 h-96" />
    </div>
  );
};

export default page;
