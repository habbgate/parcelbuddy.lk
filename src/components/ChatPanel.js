"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/client";

// Chat between the matched courier and the sender.
// Uses Socket.io when NEXT_PUBLIC_SOCKET_URL is configured, otherwise
// falls back to lightweight polling so the feature always works.
export default function ChatPanel({ requestId, token }) {
  const [messages, setMessages] = useState([]);
  const [me, setMe] = useState(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef(null);
  const socketRef = useRef(null);

  const qs = token ? `?token=${encodeURIComponent(token)}` : "";

  async function load() {
    try {
      const d = await api(`/api/requests/${requestId}/messages${qs}`);
      setMessages(d.messages);
      setMe(d.me);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => {
    load();
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (socketUrl) {
      // Lazy-load socket.io-client only when configured.
      import("socket.io-client").then(({ io }) => {
        const socket = io(socketUrl, { transports: ["websocket"] });
        socketRef.current = socket;
        socket.emit("join", requestId);
        socket.on("message", () => load());
      });
    }
    const interval = setInterval(load, socketUrl ? 15000 : 4000);
    return () => {
      clearInterval(interval);
      socketRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const content = text;
    setText("");
    try {
      await api(`/api/requests/${requestId}/messages${qs}`, {
        method: "POST",
        body: { content },
      });
      socketRef.current?.emit("message", { requestId });
      load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="flex h-[28rem] flex-col rounded-xl border border-border bg-white">
      <div className="border-b border-border px-4 py-3 font-bold text-navy">Chat</div>
      <div className="flex-1 space-y-2 overflow-y-auto p-4">
        {messages.length === 0 && <p className="text-center text-sm text-muted">No messages yet. Say hello.</p>}
        {messages.map((m) => {
          const mine = m.senderType === me;
          return (
            <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${mine ? "bg-orange text-white" : "bg-bg text-navy"}`}>
                {m.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      {error && <p className="px-4 text-xs text-danger">{error}</p>}
      <form onSubmit={send} className="flex gap-2 border-t border-border p-3">
        <input className="input !py-2" placeholder="Type a message…" value={text} onChange={(e) => setText(e.target.value)} />
        <button className="btn-primary !px-4 !py-2">Send</button>
      </form>
    </div>
  );
}

