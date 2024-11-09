import Image from "next/image";
import React from "react";
import Navbar from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import Header from "@/components/Header";
const page = () => {
  return (
    <div className="h-full w-full">
      <div>
      
        <div className=" flex justify-center items-center">
          <LoginForm /> 
        </div>
      </div>
      
    </div>
  );
};

export default page;
