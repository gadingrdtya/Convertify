import React from "react";
import {
  FileText,
  Copy,
  Scissors,
  Image,
  Archive,
  Lock,
  Unlock,
  Bot,
  HelpCircle,
  FileCode,
} from "lucide-react";
import { ToolItem } from "@/data/tools";

interface Win98ToolCardProps {
  tool: ToolItem;
  onOpen: (tool: ToolItem) => void;
}

const getWinIcon = (id: string) => {
  switch (id) {
    case "merge-pdf":
      return <Copy className="w-8 h-8 text-blue-700" />;
    case "split-pdf":
      return <Scissors className="w-8 h-8 text-amber-700" />;
    case "image-to-pdf":
      return <Image className="w-8 h-8 text-teal-700" />;
    case "pdf-to-docx":
      return <FileText className="w-8 h-8 text-blue-800" />;
    case "docx-to-pdf":
      return <FileCode className="w-8 h-8 text-red-700" />;
    case "compress-pdf":
      return <Archive className="w-8 h-8 text-amber-800" />;
    case "protect-pdf":
      return <Lock className="w-8 h-8 text-red-800" />;
    case "unlock-pdf":
      return <Unlock className="w-8 h-8 text-green-800" />;
    case "ai-chat-pdf":
      return <Bot className="w-8 h-8 text-purple-800" />;
    default:
      return <FileText className="w-8 h-8 text-slate-800" />;
  }
};

export function Win98ToolCard({ tool, onOpen }: Win98ToolCardProps) {
  return (
    <div
      onClick={() => onOpen(tool)}
      role="button"
      tabIndex={0}
      className="win98-outset p-3 flex flex-col justify-between hover:bg-[#d4d0c8] cursor-pointer active:translate-y-0.5 select-none text-left"
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 bg-white border border-gray-400 shadow-inner flex items-center justify-center">
            {getWinIcon(tool.id)}
          </div>
          <div>
            <h4 className="text-xs font-bold text-black leading-tight flex items-center gap-1">
              <span>{tool.title}</span>
              {tool.execution === "client" && (
                <span className="text-[9px] bg-teal-800 text-white px-1 py-0.2 rounded-xs font-mono">
                  EXE
                </span>
              )}
            </h4>
            <span className="text-[10px] text-gray-600 block mt-0.5">
              {tool.execution === "client" ? "Local Win32" : "Cloud Worker"}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-gray-800 leading-snug line-clamp-2 my-2 border-t border-b border-gray-300 py-1.5 font-sans">
          {tool.description}
        </p>

        <ul className="space-y-1 text-[10px] text-gray-700 font-mono">
          {tool.features.map((f, idx) => (
            <li key={idx} className="flex items-center gap-1">
              <span className="text-blue-800 font-bold">•</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 pt-2 border-t border-gray-400 flex items-center justify-between">
        <span className="text-[10px] text-gray-600 font-mono">
          {tool.id}.exe
        </span>
        <button
          type="button"
          className="win98-button text-[11px] font-bold py-1 px-3"
        >
          Run...
        </button>
      </div>
    </div>
  );
}
