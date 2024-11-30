"use client";
import Header from "@/components/Header";
import React from "react";
import FillForm from "@/components/FillForm";

const Page = () => {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 -z-20" />
      <Header />
      <main className="relative z-10">
        <FillForm />
      </main>
      <div className="hidden md:block absolute left-5 gradient-01 w-96 h-96" />
      <div className="absolute top-80 right-50 gradient-02 w-96 h-96" />
    </div>
  );
};

export default Page;