"use client";

import React, { useState, useEffect, useRef } from "react";
import { pusherClient } from "@/src/adapters/realtime/pusher-client";
import { PaperPlaneRight, User, Circle } from "@phosphor-icons/react";

type Message = {
  id: string;
  senderId: string;
  content: string;
  isSystemMessage: boolean;
  createdAt: string;
};

interface ChatInterfaceProps {
  conversationId: string;
  currentUserId: string;
  initialMessages?: Message[];
}

export function ChatInterface({
  conversationId,
  currentUserId,
  initialMessages = [],
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const channelName = `presence-${conversationId}`;
    const channel = pusherClient.subscribe(channelName);

    channel.bind("new-message", (data: Message) => {
      setMessages((prev) => {
        // Prevent duplicates in strict mode
        if (prev.find((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    });

    return () => {
      pusherClient.unsubscribe(channelName);
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const content = input;
    setInput("");

    try {
      await fetch("/api/realtime/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content,
        }),
      });
    } catch (error) {
      console.error("Failed to send message", error);
      // Fallback/error handling can be implemented here
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F9FC] border border-[#D8E1EE] rounded-xl overflow-hidden">
      {/* Messages View */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          
          if (msg.isSystemMessage) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="bg-[#EAF5F8] text-[#53647A] text-[12px] px-3 py-1 rounded-full text-center">
                  {msg.content}
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex w-full ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-[12px] px-4 py-2 ${
                  isOwn
                    ? "bg-[#DBEEFE] text-[#001040]"
                    : "bg-[#FFFFFF] text-[#001040] border border-[#D8E1EE]"
                }`}
              >
                <p className="text-[14px] leading-relaxed">{msg.content}</p>
                <span className="text-[10px] text-[#53647A] opacity-80 flex justify-end mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#FFFFFF] p-4 border-t border-[#D8E1EE]">
        <form onSubmit={sendMessage} className="flex gap-2 items-center">
          <input
            type="text"
            className="flex-1 bg-[#F1F5FB] border border-[#D8E1EE] text-[#001040] text-[14px] rounded-[8px] px-4 py-2 focus:outline-none focus:border-[#0080FF]"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="bg-[#001040] text-[#FFFFFF] rounded-[8px] p-2 hover:bg-[#001040]/90 transition-colors disabled:opacity-50"
          >
            <PaperPlaneRight size={20} weight="fill" />
          </button>
        </form>
      </div>
    </div>
  );
}
