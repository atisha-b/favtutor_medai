"use client";
import Image from "next/image";
import Header from "../components/Header";
import FooterComp from "../components/FooterComp";
import MainPageRight from "../components/MainPageRight";
import MainPageLeft from "../components/MainPageLeft";
import HeroSection from "../components/HeroSection";
import BotPage from "../botComponent/BotPage";
import ChatBotIcon from '../botComponent/ChatBotIcon';


export default function Home() {
  return (
    <div className="h-full w-full ">
      <div className="">
        <Header />
        <div className="lg:flex">
          <div className="lg:w-3/4">
            <MainPageLeft />
          </div>
          <div>
            <MainPageRight />
          </div>
        </div>
        <div>
          <HeroSection/>
        </div>
        <div>
          <ChatBotIcon />
        </div>
        
  
        <div>
          <FooterComp />
        </div>
      </div>
    </div>
  );
}
