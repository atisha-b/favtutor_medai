"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { getAuth, onAuthStateChanged, User } from "@firebase/auth";
import { app, db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import UserInfo from "@/botComponent/UserInfo";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface MedicalRecord {
  allergies: string;
  currentMedications: string;
  dateOfBirth: string;
  fileURLs: string[];
  gender: string;
  medicalHistory: string;
  timestamp: string;
  fileURL: string;
}

export default function ChatWindow() {
  const [user, setUser] = useState<User | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const auth = getAuth(app);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    setUser(null);
  };

  const createSystemMessage = (records: MedicalRecord[]): Message => {
    const record = records[0];
  
    const dobTimestamp = record.dateOfBirth as any;
    const dobMillis = dobTimestamp.seconds * 1000 + dobTimestamp.nanoseconds / 1e6;
    const dob = new Date(dobMillis);
    const now = new Date();
    const ageInMillis = now.getTime() - dob.getTime();
    const ageInYears = Math.floor(ageInMillis / (1000 * 60 * 60 * 24 * 365.25));
  
    const systemMessageContent = `Medical Context:
      Patient Information:
      - Age: ${ageInYears} years
      - Allergies: ${record.allergies}
      - Current Medications: ${record.currentMedications}
      - Medical History: ${record.medicalHistory}
      - Gender: ${record.gender}
      - Age: ${ageInYears}
      ${record.fileURL ? `\nMedical Reports Content:\n${record.fileURL}` : ""}
  
      Please consider this medical history and provide insight. Always provide responses in the context of this patient's medical history.`;
  
    return {
      role: "system",
      content: systemMessageContent,
    };
  };

  useEffect(() => {
    if (user) {
      const fetchMedicalForms = async () => {
        try {
          const medicalFormsRef = doc(db, "users", user.uid, "medicalForms", "userdata");
          const q = await getDoc(medicalFormsRef);

          const records: MedicalRecord[] = [];
          const data = q.data() as MedicalRecord;

          if (data) {
            records.push(data);
            if (data.fileURLs && data.fileURLs.length > 0) {
              for (const url of data.fileURLs) {
                try {
                  const response = await fetch(url);
                  const fileURL = await response.text();
                  data.fileURL = fileURL;
                } catch (error) {
                  console.error("Error fetching file:", error);
                }
              }
            }
          }

          setMedicalRecords(records);

          if (records.length > 0) {
            const systemMessage = createSystemMessage(records);
            const botGreeting: Message = {
              role: "assistant",
              content: `Hello! I'm your medical assistant. How can I help you today?`,
            };

            setMessages([systemMessage, botGreeting]);
          }
        } catch (error) {
          console.error("Error fetching medical forms:", error);
        }
      };

      fetchMedicalForms();
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage: Message = {
      role: "user",
      content: input,
    };

    const systemMessage = messages.find((m) => m.role === "system");

    const updatedMessages = systemMessage
      ? [systemMessage, ...messages.filter((m) => m.role !== "system"), newUserMessage]
      : [...messages, newUserMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response.content,
      };

      setMessages([
        ...(systemMessage ? [systemMessage] : []),
        ...messages.filter((m) => m.role !== "system"),
        newUserMessage,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-1/4 h-full border-r bg-white shadow-sm overflow-x-scroll">
        <div className="p-4 h-full overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Patient Profile</h2>
            <UserInfo user={user} onLogout={handleLogout} />
          </div>
          
          {medicalRecords.length > 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Medical Info</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Allergies: {medicalRecords[0].allergies}</p>
                  <p>Medications: {medicalRecords[0].currentMedications}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Header */}
        <div className="flex-shrink-0 border-b bg-white p-4 shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Medical Assistant Chat</h1>
          <p className="text-sm text-gray-500">Get personalized medical assistance and information</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages
            .filter((message) => message.role !== "system")
            .map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-sm ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-gray-800"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="flex-shrink-0 border-t bg-white p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}