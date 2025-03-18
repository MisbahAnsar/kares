import React, { useState, useEffect, useRef } from "react";
import { MessageInput } from "./MessageInput";
import Image from "next/image";

interface Message {
  sender: string;
  text: string;
  avatar?: string;
  timestamp?: string;
}

interface ChatsProps {
  characterName: string | null;
  characterDescription: string | null;
  characterAvatar: string | null;
  disabled: boolean;
  onBack: () => void;
  chatHistory: Message[]; // Accept chat history from parent
  onUpdateChatHistory: (messages: Message[]) => void; // Callback to update history in parent
}

export default function Chats({
  characterName,
  characterDescription,
  characterAvatar,
  disabled,
  onBack,
  chatHistory,
  onUpdateChatHistory,
}: ChatsProps) {
  const [messages, setMessages] = useState<Message[]>(chatHistory); // Initialize with chatHistory
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update messages when chatHistory changes (e.g., when switching characters)
  useEffect(() => {
    setMessages(chatHistory);
  }, [chatHistory]);

  // Auto-focus input field on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Auto-scroll to bottom when messages are updated
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to get current time in Indian timezone
  const getIndianTime = () => {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date());
  };

  const handleSendMessage = async (message: string) => {
    if (!characterDescription || !characterName) return;

    const userMessage: Message = {
      sender: "You",
      text: message,
      timestamp: getIndianTime(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    onUpdateChatHistory(updatedMessages); // Update parent state

    setLoading(true);
    setIsTyping(true);

    try {
      const chatHistoryString = messages
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join("\n");
      const finalPrompt = `${characterDescription}\n${chatHistoryString}\nRespond concisely and naturally, like a real conversation. Don't go off-topic.\nYou: ${message}`;

      const res = await fetch("/api/generative-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await res.json();
      if (res.ok) {
        const botMessage: Message = {
          sender: characterName,
          text: data.response,
          avatar: characterAvatar || "",
          timestamp: getIndianTime(),
        };
        const newMessages = [...updatedMessages, botMessage];
        setMessages(newMessages);
        onUpdateChatHistory(newMessages); // Update parent state
      } else {
        const errorMessage: Message = {
          sender: characterName,
          text: "Error occurred. Please try again.",
          timestamp: getIndianTime(),
        };
        const newMessages = [...updatedMessages, errorMessage];
        setMessages(newMessages);
        onUpdateChatHistory(newMessages);
      }
    } catch (error) {
      console.error("Error: ", error);
      const errorMessage: Message = {
        sender: characterName,
        text: "Failed to fetch AI response.",
        timestamp: getIndianTime(),
      };
      const newMessages = [...updatedMessages, errorMessage];
      setMessages(newMessages);
      onUpdateChatHistory(newMessages);
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };

  return (
<<<<<<< HEAD
    <div className="px-2 sm:px-4 md:px-6">
      <div className="mx-auto p-4 h-full border-2 rounded-xl border-gray-700 flex flex-col">
        {/* Message Display Area */}
        <div className="overflow-y-auto h-96 flex-grow mb-4">
          {messages.map((msg, index) => (
           <div
           key={index}
           className={`flex items-start gap-4 mb-2 ${
             msg.sender === 'You' ? 'justify-end' : 'justify-start'
           }`}
         >
           {/* Message Bubble */}
           {msg.sender === 'You' ? (
             <>
               <div
                 className={`p-2 rounded max-w-xs ${
                   msg.sender === 'You'
                     ? 'bg-red-500 text-white text-right'
                     : 'bg-gray-700 text-white'
                 }`}
               >
                 <strong>{msg.sender}: </strong>
                 <span>{msg.text}</span>
               </div>
               <Image
                 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXMMYlFDadWZBR8ee8PxvE941Gn38Tj22wColbJv1v-i8YbqWoKZyG7f4P&s=10"
                 alt={msg.sender}
                 className="w-10 h-10 rounded-full mr-2"
               />
             </>
           ) : (
             <>
               {msg.avatar && (
                 <Image
                   src={msg.avatar}
                   alt={msg.sender}
                   className="w-10 h-10 rounded-full"
                 />
               )}
               <div
                 className={`p-2 rounded max-w-xs ${
                   msg.sender === 'You'
                     ? 'bg-red-500 text-white text-right'
                     : 'bg-gray-700 text-white'
                 }`}
               >
                 <strong>{msg.sender}: </strong>
                 <span>{msg.text}</span>
               </div>
             </>
           )}
         </div>
         
          ))}
=======
    <div className="flex flex-col h-full bg-black md:bg-[hsl(12,1.75%,10.83%)] text-white">
      {/* Header Section */}
      <div className="flex items-center p-4 border-b border-zinc-900">
        <button className="md:hidden mr-4" onClick={onBack}>
          ←
        </button>
        <div className="flex items-center space-x-3">
          {characterAvatar && (
            <Image
              src={characterAvatar}
              alt={characterName || "Character"}
              width={48}
              height={48}
              className="rounded-full"
            />
          )}
          <div>
            <h2 className="font-semibold">{characterName}</h2>
            <p className="text-xs text-green-500">Online</p>
          </div>
>>>>>>> 22528d4 (made changes)
        </div>
      </div>

      {/* Chat Messages Section */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 scrollbar-hide chat-container flex flex-col"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 mb-4 ${
              msg.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div>
              <div
                className={`px-3 py-2 block rounded-lg max-w-xs ${
                  msg.sender === "You"
                    ? `bg-none border-2 border-[hsla(12,12%,15%,1)]`
                    : `bg-none border-2 border-[hsla(12,12%,15%,1)]`
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              <div className="block">
                <p className="text-xs text-zinc-400 mt-1">{msg.timestamp}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Section */}
      <div className="p-4 border-t border-zinc-900">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={disabled || loading}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}