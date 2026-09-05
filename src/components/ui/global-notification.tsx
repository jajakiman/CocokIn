"use client";

import React, { useEffect, useState } from "react";
import { createPusherClient, parsePusherBrowserConfig } from "@/src/adapters/realtime/pusher-client";
import { motion, AnimatePresence } from "framer-motion";
import { X, BellRinging } from "@phosphor-icons/react";

type NotificationMessage = {
  id: string;
  type: string;
  content: string;
  createdAt: string;
};

export function GlobalNotification({ userId }: { userId?: string }) {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    let pusherClient: ReturnType<typeof createPusherClient> | undefined;
    const channelName = `user-${userId}`;

    const connect = async () => {
      try {
        const response = await fetch("/api/realtime/config");
        if (!response.ok) return;
        const config = parsePusherBrowserConfig(await response.json());
        if (cancelled) return;
        
        pusherClient = createPusherClient(config);
        const channel = pusherClient.subscribe(channelName);
        
        channel.bind("new-notification", (data: NotificationMessage) => {
          setNotifications((prev) => {
            // Check for duplicates
            if (prev.some((n) => n.id === data.id)) return prev;
            return [...prev, data];
          });
          
          // Auto-dismiss after 5 seconds
          setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== data.id));
          }, 5000);
        });
      } catch (err) {
        console.error("Failed to connect to global notifications", err);
      }
    };

    void connect();

    return () => {
      cancelled = true;
      pusherClient?.unsubscribe(channelName);
      pusherClient?.disconnect();
    };
  }, [userId]);

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none w-80 max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="bg-white border border-[#D8E1EE] shadow-xl rounded-xl p-4 pointer-events-auto flex gap-3 overflow-hidden relative"
          >
            {/* Left accent bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF8010]" />
            
            <div className="mt-0.5 text-[#FF8010]">
              <BellRinging size={20} weight="fill" />
            </div>
            
            <div className="flex-1">
              <h4 className="text-[13px] font-bold text-[#001040] mb-1">
                {notif.type}
              </h4>
              <p className="text-[13px] text-[#53647A] leading-tight">
                {notif.content}
              </p>
            </div>
            
            <button 
              onClick={() => dismiss(notif.id)}
              className="text-[#53647A] hover:text-[#E11D48] transition-colors h-fit p-1"
              aria-label="Dismiss notification"
            >
              <X size={16} weight="bold" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
