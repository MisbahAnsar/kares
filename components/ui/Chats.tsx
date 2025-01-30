import React, { useState } from "react";
import { MessageInput } from "./MessageInput";
import Image from "next/image";

interface Message {
  sender: string;
  text: string;
  avatar?: string; // For character avatar
}

interface ChatsProps {
  characterName: string | null;
  characterDescription: string | null;
  characterAvatar: string | null;
  disabled: boolean;
}

export default function Chats({
  characterName,
  characterDescription,
  characterAvatar,
  disabled,
}: ChatsProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!characterDescription || !characterName) return;

    const userMessage: Message = { sender: "You", text: message };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const chatHistory = messages
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join("\n");
      const finalPrompt = `${characterDescription}\n${chatHistory}\nYou: ${message}`;

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
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        const errorMessage: Message = {
          sender: characterName,
          text: "Error occurred. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error: ", error);
      const errorMessage: Message = {
        sender: characterName,
        text: "Failed to fetch AI response.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        </div>

        {/* Message Input Area */}
        <div className="border-t border-gray-700">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={disabled || loading}
          />
        </div>
      </div>
    </div>
  );
}
