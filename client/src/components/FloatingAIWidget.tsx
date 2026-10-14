"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, Bot, User, Loader2 } from "lucide-react";
import API_BASE_URL from "@/utils/api";

interface FloatingAIWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export function FloatingAIWidget({ isOpen, onClose, onOpen }: FloatingAIWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: "Halo! Saya Convertify Assistant. Silakan tanyakan panduan konversi dokumen, tips pengaturan font Times New Roman, atau pemilihan modul yang sesuai.",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    { label: "Konversi PDF ke Word", query: "Bagaimana cara konversi PDF ke Word dengan format rapi?" },
    { label: "Opsi Times New Roman", query: "Bagaimana memilih font Times New Roman untuk dokumen Word?" },
    { label: "Kompresi Berkas", query: "Bagaimana cara kompres PDF agar ukuran kecil tanpa pecah?" },
  ];

  const handleSend = async (queryText?: string) => {
    const text = (queryText || inputVal).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          documentText: "Convertify studio document workspace.",
        }),
      });

      if (!res.ok) throw new Error("Gagal mengambil respon dari AI server");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "bot",
          text: data.answer || "Perintah berhasil diproses.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "bot",
          text: "Koneksi ke backend Convertify sedang terputus. Pastikan server FastAPI di port 8000 aktif.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={onOpen}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-200" />
            <span>AI Copilot</span>
          </button>
        </div>
      )}

      {/* Slide-over Copilot Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[360px] sm:w-[400px] h-[540px] max-w-[calc(100vw-32px)] bg-white rounded-xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-none">Convertify Copilot</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Asisten In-House Resmi</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex flex-wrap gap-1.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(p.query)}
                  className="text-[10px] font-medium px-2 py-1 rounded bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#F8FAFC] text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.sender === "bot" && (
                  <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3 h-3" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-lg p-2.5 leading-relaxed ${
                    m.sender === "user"
                      ? "bg-blue-600 text-white font-medium"
                      : "bg-white border border-slate-200 text-slate-800 shadow-2xs whitespace-pre-line"
                  }`}
                >
                  {m.text}
                </div>
                {m.sender === "user" && (
                  <div className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 pl-7">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>Memproses jawaban...</span>
              </div>
            )}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex gap-1.5"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Tanyakan fitur atau modul dokumen..."
              className="flex-1 text-xs px-2.5 py-1.5 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-800"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="p-2 rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
