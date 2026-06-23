"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/AdminShell";
import { api } from "@/lib/client";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    api("/api/admin/messages").then(setMessages).catch(() => {});
  }, []);

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold text-navy">Contact Messages</h1>
      </div>

      {!messages ? (
        <div className="py-16 text-center text-muted">Loading messages...</div>
      ) : messages.length === 0 ? (
        <div className="card text-center text-muted py-12">No messages received yet.</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Sender</th>
                <th className="px-6 py-4 font-bold">Subject</th>
                <th className="px-6 py-4 font-bold">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messages.map((msg) => (
                <tr 
                  key={msg._id} 
                  className="transition-colors hover:bg-slate-50 cursor-pointer"
                  onClick={() => setSelectedMessage(msg)}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-navy">{msg.name}</div>
                    <div className="text-xs text-slate-500">{msg.email}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700 max-w-[200px] truncate">
                    {msg.subject}
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                    {msg.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMessage(null)}></div>
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl transition-all">
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-navy">Message Details</h3>
              <button onClick={() => setSelectedMessage(null)} className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase text-gray-400">From</div>
                <div className="font-bold text-gray-900">{selectedMessage.name}</div>
                <div className="text-sm text-gray-600"><a href={`mailto:${selectedMessage.email}`} className="hover:underline hover:text-orange-600">{selectedMessage.email}</a></div>
              </div>
              
              <div>
                <div className="text-xs font-semibold uppercase text-gray-400">Received</div>
                <div className="text-sm text-gray-700">{new Date(selectedMessage.createdAt).toLocaleString()}</div>
              </div>
              
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div className="font-bold text-navy mb-2 break-words">{selectedMessage.subject}</div>
                <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed break-words">
                  {selectedMessage.message}
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button onClick={() => setSelectedMessage(null)} className="rounded-xl border border-gray-200 bg-white px-5 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
