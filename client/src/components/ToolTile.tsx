import React from "react";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Archive,
  Image as ImageIcon,
  Layers,
  Split,
  RotateCw,
  Trash2,
  FilePlus,
  Edit3,
  Stamp,
  Hash,
  Crop,
  Lock,
  Unlock,
  PenTool,
  Sparkles,
  BookOpen,
  HelpCircle,
  Languages,
  Check,
  ArrowRight,
} from "lucide-react";
import { ToolItem } from "@/data/tools";

interface ToolTileProps {
  tool: ToolItem;
  onSelect: (tool: ToolItem) => void;
  compact?: boolean;
}

export function ToolTile({ tool, onSelect, compact = false }: ToolTileProps) {
  const renderIcon = () => {
    switch (tool.badgeLabel) {
      case "DOCX":
      case "WORD":
        return <FileText className="w-5 h-5" />;
      case "EXCEL":
        return <FileSpreadsheet className="w-5 h-5" />;
      case "PPT":
        return <Presentation className="w-5 h-5" />;
      case "COMPRESS":
      case "OCR":
      case "PDF/A":
        return <Archive className="w-5 h-5" />;
      case "JPG":
      case "PNG":
      case "FOTO":
        return <ImageIcon className="w-5 h-5" />;
      case "MERGE":
        return <Layers className="w-5 h-5" />;
      case "SPLIT":
        return <Split className="w-5 h-5" />;
      case "ROTATE":
        return <RotateCw className="w-5 h-5" />;
      case "DELETE":
        return <Trash2 className="w-5 h-5" />;
      case "EXTRACT":
        return <FilePlus className="w-5 h-5" />;
      case "EDIT":
        return <Edit3 className="w-5 h-5" />;
      case "WATERMARK":
        return <Stamp className="w-5 h-5" />;
      case "NOMOR":
        return <Hash className="w-5 h-5" />;
      case "CROP":
        return <Crop className="w-5 h-5" />;
      case "KUNCI":
        return <Lock className="w-5 h-5" />;
      case "BUKA":
        return <Unlock className="w-5 h-5" />;
      case "TANDA TANGAN":
        return <PenTool className="w-5 h-5" />;
      case "AI COPILOT":
        return <Sparkles className="w-5 h-5" />;
      case "RANGKUM":
        return <BookOpen className="w-5 h-5" />;
      case "SOAL & KUIS":
        return <HelpCircle className="w-5 h-5" />;
      case "TERJEMAH":
        return <Languages className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  if (compact) {
    return (
      <div
        onClick={() => onSelect(tool)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(tool);
          }
        }}
        className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 hover:border-slate-300 hover:bg-slate-50/80 transition-all cursor-pointer group text-left select-none shadow-2xs"
      >
        <div
          style={{ backgroundColor: tool.badgeBg, color: tool.badgeColor }}
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold"
        >
          {renderIcon()}
        </div>
        <div className="truncate">
          <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">
            {tool.title}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelect(tool)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(tool);
        }
      }}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer select-none text-left flex flex-col justify-between group focus:outline-none focus:ring-2 focus:ring-blue-600"
    >
      <div>
        {/* Soft Pastel Badge Icon */}
        <div className="flex items-center justify-between mb-3.5">
          <div
            style={{ backgroundColor: tool.badgeBg, color: tool.badgeColor }}
            className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
          >
            {renderIcon()}
          </div>
          <span
            style={{ backgroundColor: tool.badgeBg, color: tool.badgeColor }}
            className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-md"
          >
            {tool.badgeLabel}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {tool.title}
        </h3>
        <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
          {tool.description}
        </p>

        {/* Bullet point fitur */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-1">
          {tool.features.slice(0, 2).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-2 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
        <span>Gunakan Modul</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
