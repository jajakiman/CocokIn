"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPusherClient, parsePusherBrowserConfig } from "@/src/adapters/realtime/pusher-client";
import { PaperPlaneRight, Link as LinkIcon, Warning, X, Image as ImageIcon } from "@phosphor-icons/react";
import { reportMessageAction } from "@/src/adapters/chat/chat-actions";
import { useActionState } from "react";

type Message = {
  id: string;
  senderId: string;
  content: string;
  isSystemMessage: boolean;
  createdAt: string;
  attachments?: { fileUrl: string; fileType: string }[];
};

interface ChatInterfaceProps {
  conversationId: string;
  currentUserId: string;
  initialMessages?: Message[];
}

// Simple Markdown-lite parser
function renderRichText(text: string) {
  if (!text) return null;
  // Handle basic bold, italic, and links
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|\[.*?\]\(.*?\))/g);
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    const linkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      return (
        <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-[#0080FF] underline hover:text-[#0055CC]">
          {linkMatch[1]}
        </a>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function ChatInterface({
  conversationId,
  currentUserId,
  initialMessages = [],
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [showAttachment, setShowAttachment] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [reportingMessageId, setReportingMessageId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const [reportState, reportFormAction, isReporting] = useActionState(reportMessageAction, null);

  useEffect(() => {
    let cancelled = false;
    let pusherClient: ReturnType<typeof createPusherClient> | undefined;
    const channelName = `presence-${conversationId}`;
    const connect = async () => {
      const response = await fetch("/api/realtime/config");
      if (!response.ok) return;
      const config = parsePusherBrowserConfig(await response.json());
      if (cancelled) return;
      pusherClient = createPusherClient(config);
      const channel = pusherClient.subscribe(channelName);
      channel.bind("new-message", (data: Message) => {
        setMessages((prev) => {
          if (prev.find((message) => message.id === data.id)) return prev;
          return [...prev, data];
        });
      });
    };
    void connect().catch(() => undefined);

    return () => {
      cancelled = true;
      pusherClient?.unsubscribe(channelName);
      pusherClient?.disconnect();
    };
  }, [conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !attachmentUrl.trim()) return;

    const content = input;
    const attUrl = attachmentUrl;
    
    setInput("");
    setAttachmentUrl("");
    setShowAttachment(false);

    try {
      await fetch("/api/realtime/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          content: content || "Dikirim dengan lampiran",
          attachmentUrl: attUrl || undefined,
          attachmentType: attUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? "image" : "link"
        }),
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  useEffect(() => {
    if (reportState?.ok) {
      setReportingMessageId(null);
      alert(reportState.message);
    }
  }, [reportState]);

  return (
    <div className="flex flex-col h-full bg-[#F7F9FC] border border-[#D8E1EE] rounded-xl overflow-hidden relative">
      {/* Report Modal */}
      {reportingMessageId && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#001040]">Laporkan Pesan</h3>
              <button onClick={() => setReportingMessageId(null)} className="text-[#53647A] hover:text-[#E11D48]">
                <X size={20} />
              </button>
            </div>
            <form action={reportFormAction} className="space-y-4">
              <input type="hidden" name="messageId" value={reportingMessageId} />
              <div>
                <label className="block text-sm font-medium text-[#001040] mb-1">Alasan Laporan</label>
                <textarea 
                  name="reason" 
                  required 
                  className="w-full border border-[#D8E1EE] rounded-lg p-3 text-sm focus:outline-none focus:border-[#E11D48] min-h-[80px]"
                  placeholder="Mengapa pesan ini melanggar aturan?"
                />
              </div>
              {reportState?.ok === false && (
                <p className="text-sm text-[#E11D48]">{reportState.message}</p>
              )}
              <button 
                type="submit" 
                disabled={isReporting}
                className="w-full bg-[#E11D48] text-white font-bold py-2 rounded-lg hover:bg-[#BE123C] transition-colors disabled:opacity-50"
              >
                {isReporting ? "Mengirim..." : "Kirim Laporan"}
              </button>
            </form>
          </div>
        </div>
      )}

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
              className={`flex w-full group ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div className="flex items-center gap-2 max-w-[75%]">
                {!isOwn && (
                  <button 
                    onClick={() => setReportingMessageId(msg.id)}
                    className="opacity-0 group-hover:opacity-100 text-[#53647A] hover:text-[#E11D48] transition-opacity p-1"
                    title="Laporkan Pesan"
                  >
                    <Warning size={18} />
                  </button>
                )}
                
                <div
                  className={`rounded-[12px] px-4 py-3 ${
                    isOwn
                      ? "bg-[#DBEEFE] text-[#001040]"
                      : "bg-[#FFFFFF] text-[#001040] border border-[#D8E1EE]"
                  }`}
                >
                  {/* Attachments rendering */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mb-2">
                      {msg.attachments.map((att, i) => (
                        att.fileType === "image" || att.fileUrl.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                          <img key={i} src={att.fileUrl} alt="Attachment" className="max-w-full h-auto rounded-lg max-h-48 object-contain bg-black/5" />
                        ) : (
                          <a key={i} href={att.fileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#006FE6] bg-[#EAF3FF] p-2 rounded-lg text-sm border border-[#BAE6FD] hover:bg-[#DBEEFE] transition-colors">
                            <LinkIcon size={16} /> Lampiran Tautan
                          </a>
                        )
                      ))}
                    </div>
                  )}

                  <p className="text-[14px] leading-relaxed whitespace-pre-wrap">
                    {renderRichText(msg.content)}
                  </p>
                  <span className="text-[10px] text-[#53647A] opacity-80 flex justify-end mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#FFFFFF] p-4 border-t border-[#D8E1EE] flex flex-col gap-2">
        {showAttachment && (
          <div className="flex items-center gap-2 bg-[#F8FAFC] p-2 rounded-lg border border-[#D8E1EE]">
            <ImageIcon size={20} className="text-[#53647A]" />
            <input 
              type="url" 
              placeholder="Masukkan URL gambar atau tautan file (https://...)" 
              className="flex-1 bg-transparent text-sm focus:outline-none text-[#001040]"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
            />
            <button type="button" onClick={() => setShowAttachment(false)} className="text-[#53647A] hover:text-[#E11D48] p-1">
              <X size={16} />
            </button>
          </div>
        )}
        <form onSubmit={sendMessage} className="flex gap-2 items-end">
          <button
            type="button"
            onClick={() => setShowAttachment(!showAttachment)}
            className={`p-2.5 rounded-[8px] transition-colors ${showAttachment ? 'bg-[#EAF3FF] text-[#006FE6]' : 'bg-[#F1F5FB] text-[#53647A] hover:bg-[#EAF3FF] hover:text-[#006FE6]'}`}
            title="Lampirkan URL Gambar/File"
          >
            <LinkIcon size={20} />
          </button>
          <textarea
            className="flex-1 bg-[#F1F5FB] border border-[#D8E1EE] text-[#001040] text-[14px] rounded-[8px] px-4 py-2.5 focus:outline-none focus:border-[#0080FF] resize-none max-h-[120px] min-h-[45px]"
            placeholder="Ketik pesan Anda... (Gunakan **tebal**, *miring*, [tautan](url))"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() && !attachmentUrl.trim()}
            className="bg-[#001040] text-[#FFFFFF] rounded-[8px] p-2.5 hover:bg-[#001040]/90 transition-colors disabled:opacity-50 h-[45px]"
          >
            <PaperPlaneRight size={20} weight="fill" />
          </button>
        </form>
      </div>
    </div>
  );
}
