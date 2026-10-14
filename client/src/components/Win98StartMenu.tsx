"use client";

import React from "react";
import { ToolItem, TOOLS } from "@/data/tools";
import {
  FileText,
  Lock,
  LogOut,
  Folder,
  Bot,
  HelpCircle,
  HardDrive,
  Cpu,
} from "lucide-react";

interface Win98StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: ToolItem) => void;
  onOpenAI: () => void;
  onOpenAuth: () => void;
  currentUser?: string | null;
  onSignOut?: () => void;
}

export function Win98StartMenu({
  isOpen,
  onClose,
  onSelectTool,
  onOpenAI,
  onOpenAuth,
  currentUser,
  onSignOut,
}: Win98StartMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed bottom-9 left-1 z-50 win98-outset w-64 shadow-2xl flex overflow-hidden select-none animate-in fade-in duration-100"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Blue Vertical Banner (Windows 98 Style) */}
      <div className="w-8 bg-gradient-to-t from-[#000080] to-[#1084d0] flex items-end justify-center pb-3">
        <span
          className="text-white font-extrabold text-sm tracking-wider uppercase font-sans transform -rotate-90 origin-bottom-left whitespace-nowrap ml-6"
        >
          Convertify 98
        </span>
      </div>

      {/* Menu Items List */}
      <div className="flex-1 p-1 bg-[#c0c0c0] text-xs text-black space-y-0.5">
        <div className="px-2 py-1 text-[11px] font-bold text-gray-700 border-b border-gray-400 mb-1">
          {currentUser ? `User: ${currentUser}` : "Sistem Siap"}
        </div>

        {/* AI Assistant */}
        <button
          onClick={() => {
            onClose();
            onOpenAI();
          }}
          className="w-full text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer"
        >
          <Bot className="w-4 h-4 text-purple-700" />
          <span>AI Copilot Assistant...</span>
        </button>

        <div className="border-t border-b border-gray-400 my-1 py-1 space-y-0.5">
          <span className="px-2 text-[10px] text-gray-500 font-bold block uppercase">
            Aplikasi Dokumen
          </span>
          {TOOLS.slice(0, 6).map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                onClose();
                onSelectTool(tool);
              }}
              className="w-full text-left px-2 py-1 hover:bg-[#000080] hover:text-white flex items-center gap-2 truncate cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-blue-800" />
              <span className="truncate">{tool.title}</span>
            </button>
          ))}
        </div>

        {/* Login / Auth */}
        {currentUser ? (
          <button
            onClick={() => {
              onClose();
              if (onSignOut) onSignOut();
            }}
            className="w-full text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer text-red-900"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun ({currentUser})</span>
          </button>
        ) : (
          <button
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-gray-700" />
            <span>Masuk / Daftar Akun...</span>
          </button>
        )}
      </div>
    </div>
  );
}
