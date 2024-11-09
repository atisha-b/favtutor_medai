"use client";

import React, { useState, useEffect, useRef } from "react";
import ChatWindow from "./ChatWindow";
import ChatBotIcon from "./ChatBotIcon";
import UserInfo from "./UserInfo";
import { onAuthStateChangedListener } from "./auth";
import styled from "styled-components";
import Link from "next/link";

const Container = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

const Message = styled.div`
  position: absolute;
  bottom: 80px;
  right: 20px;
  background-color: white;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  opacity: ${(props) => (props.$hovered ? "1" : "0")};
  transition: opacity 0.3s ease-in-out;
`;

const ChatBotButton = styled.div`
  border: ${(props) =>
    props.$hovered ? "1px solid #f9f0ff" : "4px solid #3ae090"};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border 0.3s ease-in-out;
`;

const BotPage = () => {
  const [user, setUser] = useState(null);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [hovered, setHovered] = useState(false);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      console.log("Auth state changed:", user);
      setUser(user);
    });

    return () => {
      console.log("Unsubscribing from auth listener");
      unsubscribe();
    };
  }, []);

  const handleChatOpen = () => {
    console.log("Opening chat window");
    setShowChatWindow(true);
  };

  const handleClickOutside = (event) => {
    if (
      chatWindowRef.current &&
      !chatWindowRef.current.contains(event.target) &&
      showChatWindow
    ) {
      console.log("Clicked outside, closing chat window");
      setShowChatWindow(false);
    }
  };

  useEffect(() => {
    if (showChatWindow) {
      console.log("Adding click outside listener");
      document.addEventListener("click", handleClickOutside);
    } else {
      console.log("Removing click outside listener");
      document.removeEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showChatWindow]);

  return (
    <div>
      <style jsx global>{`
        h1 {
          color: #333;
        }

        button {
          cursor: pointer;
        }

        input[type="file"] {
          display: none;
        }
      `}</style>
      <div className="relative">
        <Link href="/ChatWindow">
          <ChatBotButton
            $hovered={hovered}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={handleChatOpen}
          >
            <ChatBotIcon />
          </ChatBotButton>
        </Link>
        {user && <UserInfo user={user} onLogout={() => setUser(null)} />}
        <Message $hovered={hovered} className="">
          Hey, it's MediBot{" "}
          <span role="img" aria-label="call me hand gesture">
            ✋
          </span>
        </Message>
      </div>
    </div>
  );
};

export default BotPage;
