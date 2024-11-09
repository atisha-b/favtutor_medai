// src/app/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { getAuth, onAuthStateChanged, User } from "@firebase/auth";
import { app, db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

interface Message {
  role: "user" | "assistant" | "system";  // Added system role
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
  fileContent?: string;
}

export default function ChatWindow() {
  const [user, setUser] = useState<User | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const auth = getAuth(app);

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

  const createSystemMessage = (records: MedicalRecord[]): Message => {
    const record = records[0]; // Using the first record
    return {
      role: "system",
      content: `Medical Context:
        Patient Information:
        - Allergies: ${record.allergies}
        - Current Medications: ${record.currentMedications}
        - Medical History: ${record.medicalHistory}
        - Gender: ${record.gender}
        - Date of Birth: ${record.dateOfBirth}
        ${record.fileContent ? `\nMedical Reports Content:\n${record.fileContent}` : ''}
        
        Please consider this medical history when providing responses. Always provide responses in the context of this patient's medical history.`
    };
  };

  useEffect(() => {
    if (user) {
      const fetchMedicalForms = async () => {
        try {
          // Alternative approach - query documents where userId matches
          const medicalFormsRef = collection(db, "medicalForms");
          const q = query(medicalFormsRef, where("userId", "==", user.uid));
          const snapshot = await getDocs(q);

          const records: MedicalRecord[] = [];

          for (const doc of snapshot.docs) {
            const data = doc.data() as MedicalRecord;
            records.push(data);

            if (data.fileURLs && data.fileURLs.length > 0) {
              for (const url of data.fileURLs) {
                try {
                  const response = await fetch(url);
                  const fileContent = await response.text();
                  data.fileContent = fileContent;
                } catch (error) {
                  console.error("Error fetching file:", error);
                }
              }
            }
          }

          setMedicalRecords(records);
          
          if (records.length > 0) {
            const systemMessage = createSystemMessage(records);
            setMessages([systemMessage]);
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

    // Get the existing system message if it exists
    const systemMessage = messages.find(m => m.role === "system");
    
    // Create the updated messages array with system message first (if it exists)
    const updatedMessages = systemMessage 
      ? [systemMessage, ...messages.filter(m => m.role !== "system"), newUserMessage]
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

      // Add the assistant message while preserving the system message at the start
      setMessages([
        ...(systemMessage ? [systemMessage] : []),
        ...messages.filter(m => m.role !== "system"),
        newUserMessage,
        assistantMessage
      ]);

    } catch (error) {
      console.error("Error:", error);
      alert("Failed to send message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Medical Assistant</h1>

      {medicalRecords.length > 0 && (
        <div className="mb-4 p-4 bg-blue-500 rounded-lg">
          <h2 className="font-semibold mb-2">Current Medical Information:</h2>
          <ul className="text-sm space-y-1">
            <li>Allergies: {medicalRecords[0].allergies}</li>
            <li>Current Medications: {medicalRecords[0].currentMedications}</li>
            <li>Medical History: {medicalRecords[0].medicalHistory}</li>
          </ul>
        </div>
      )}

      <div className="flex-grow mb-4 overflow-hidden border rounded-lg shadow-sm">
        <div
          className="h-full overflow-y-auto p-4"
          style={{ scrollBehavior: "smooth" }}
        >
          <div className="space-y-4">
            {messages
              .filter(message => message.role !== "system") // Don't show system messages in the UI
              .map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-blue-50 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about your health..."
          disabled={isLoading}
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}