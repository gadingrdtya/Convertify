"use client";

import React, { useState, useEffect } from "react";
import { BrandLogo } from "./BrandLogo";
import { Folder, HardDrive, HelpCircle, Lock, Power } from "lucide-react";

interface Win98TaskbarProps {
  onStartClick: () => void;
  isStartOpen: boolean;
  activeAppTitle?: string;
  onOpenAI: () => void;
  onOpenAuth: () => void;
  currentUser?: string | null;
}

export function Win98Taskbar({
  onStartClick,
  isStartOpen,
  activeAppTitle,
  onOpenAI,
  onOpenAuth,
  currentUser,
}: Win98TaskbarProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-9 bg-[#c0c0c0] border-t-2 border-white z-50 flex items-center justify-between px-1 shadow-md select-none">
      {/* Start Button & Active Windows */}
      <div className="flex items-center gap-1.5 h-full py-0.5">
        <button
          onClick={onStartClick}
          className={`win98-button font-bold text-xs h-full px-2 flex items-center gap-1.5 ${
            isStartOpen ? "border-t-2 border-black border-l-2" : ""
          }`}
        >
          {/* Windows 98 4-color flag */}
          <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
            <span className="bg-[#D83B01]"></span>
            <span className="bg-[#107C41]"></span>
            <span className="bg-[#0078D7]"></span>
            <span className="bg-[#FFB900]"></span>
          </div>
          <span className="text-black font-extrabold text-[13px]">Start</span>
        </button>

        {/* Vertical divider */}
        <div className="w-[2px] h-6 bg-gray-400 border-r border-white mx-0.5"></div>

        {/* Active Application Button */}
        {activeAppTitle && (
          <div className="win98-inset bg-[#dfdfdf] px-3 h-full flex items-center gap-1.5 text-xs font-bold text-black max-w-[200px] truncate">
            <Folder className="w-3.5 h-3.5 text-amber-700" />
            <span className="truncate">{activeAppTitle}</span>
          </div>
        )}

        <button
          onClick={onOpenAI}
          className="win98-button text-xs h-full px-2 hidden sm:flex items-center gap-1 text-purple-950 font-bold"
        >
          <span>Assistant.exe</span>
        </button>
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2 win98-inset px-2.5 py-1 text-xs text-black font-mono">
        <button
          onClick={onOpenAuth}
          className="hover:underline flex items-center gap-1 text-[11px]"
        >
          <Lock className="w-3 h-3 text-gray-700" />
          <span>{currentUser || "User Login"}</span>
        </button>
        <div className="w-[1px] h-3 bg-gray-400"></div>
        <span className="text-black font-bold">{time || "12:00"}</span>
      </div>
    </div>
  );
}
