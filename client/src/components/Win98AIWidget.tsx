"use client";

import React, { useState } from "react";
import { Bot, Send, X, Loader2, Sparkles, HelpCircle } from "lucide-react";

interface Win98AIWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

export function Win98AIWidget({ isOpen, onClose, onOpen }: Win98AIWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      sender: "bot",
      text: "Convertify 98 Assistant v1.0 Siap.\nKetik pertanyaan Anda tentang konversi PDF, format Times New Roman, atau panduan alat.",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);

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
      const res = await fetch("http://localhost:8000/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          documentText: "Convertify Windows 98 assistant environment.",
        }),
      });

      if (!res.ok) throw new Error("Gagal mengambil respon dari AI server");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "bot",
          text: data.answer || "Perintah berhasil dieksekusi.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: "bot",
          text: "ERROR 500: Koneksi ke FastAPI worker terputus. Pastikan port 8000 aktif.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Retro Assistant Icon / Clippy-style button */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-12 right-4 z-40 win98-button font-bold text-xs flex items-center gap-1.5 bg-[#ffffcc] text-black shadow-md border border-black"
        >
          <Bot className="w-4 h-4 text-purple-900" />
          <span>Ask Assistant.exe</span>
        </button>
      )}

      {/* Retro Window Dialog */}
      {isOpen && (
        <div className="fixed bottom-12 right-3 sm:right-6 z-50 win98-outset w-[340px] sm:w-[400px] h-[480px] flex flex-col shadow-2xl">
          {/* Title bar */}
          <div className="win98-titlebar cursor-move">
            <div className="flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-white" />
              <span>Convertify Assistant - Dialog.exe</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="win98-titlebar-btn" title="Minimize">_</button>
              <button onClick={onClose} className="win98-titlebar-btn font-bold text-red-900" title="Close">✕</button>
            </div>
          </div>

          {/* Assistant Sub-header */}
          <div className="p-2 bg-[#ffffdf] border-b border-gray-400 text-xs flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-yellow-300 border border-black flex items-center justify-center font-bold text-black text-xs font-mono">
              ?
            </div>
            <p className="text-[11px] text-gray-800 leading-tight">
              Tanyakan panduan penggunaan modul dokumen Convertify kapan saja.
            </p>
          </div>

          {/* Quick Prompts */}
          <div className="p-1 bg-[#c0c0c0] border-b border-gray-400 flex flex-wrap gap-1 text-[10px]">
            <button
              onClick={() => handleSend("Bagaimana cara ubah PDF ke Word?")}
              className="win98-button text-[10px] py-0.5 px-1.5"
            >
              PDF ke Word?
            </button>
            <button
              onClick={() => handleSend("Bagaimana cara kompres PDF?")}
              className="win98-button text-[10px] py-0.5 px-1.5"
            >
              Kompres PDF?
            </button>
            <button
              onClick={() => handleSend("Cara gabung beberapa PDF?")}
              className="win98-button text-[10px] py-0.5 px-1.5"
            >
              Gabung PDF?
            </button>
          </div>

          {/* Messages Output Area */}
          <div className="flex-1 overflow-y-auto p-2 bg-white win98-inset m-2 space-y-2 text-xs font-mono">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`p-1.5 text-xs ${
                  m.sender === "user"
                    ? "bg-[#e0e8ff] border border-blue-400 text-blue-900 font-sans"
                    : "bg-[#f5f5f5] border border-gray-300 text-black font-sans whitespace-pre-line"
                }`}
              >
                <span className="font-bold font-mono text-[10px] text-gray-600 block mb-0.5">
                  {m.sender === "user" ? "> USER:" : "> ASSISTANT:"}
                </span>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memproses query...</span>
              </div>
            )}
          </div>

          {/* Input Controls */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2 bg-[#c0c0c0] flex gap-1.5 border-t border-gray-400"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ketik pertanyaan..."
              className="win98-inset bg-white px-2 py-1 text-xs flex-1 font-mono focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputVal.trim()}
              className="win98-button font-bold text-xs"
            >
              Kirim
            </button>
          </form>
        </div>
      )}
    </>
  );
}
