"use client";

import React from "react";
import { Sparkles, FileText, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { ToolItem, TOOLS } from "@/data/tools";

interface SignatureHeroBentoProps {
  onSelectTool: (tool: ToolItem) => void;
}

export function SignatureHeroBento({ onSelectTool }: SignatureHeroBentoProps) {
  const pdfToDocx = TOOLS.find((t) => t.id === "pdf-to-docx");
  const aiCopilot = TOOLS.find((t) => t.id === "ai-chat-pdf");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-10">
      {/* KARTU 1 UTAMA: PDF to Word dengan Standar Times New Roman (7 Kolom) */}
      {pdfToDocx && (
        <div
          onClick={() => onSelectTool(pdfToDocx)}
          className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 border border-blue-200/90 p-7 sm:p-8 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all text-left relative overflow-hidden group select-none"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-extrabold text-[11px] tracking-wide">
                UNGGULAN CONVERTIFY
              </span>
              <span className="text-xs font-bold text-blue-800 bg-blue-100/80 px-2.5 py-1 rounded-full">
                Times New Roman Ready
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
              PDF ke Microsoft Word (.docx)
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
              Solusi konversi pertama yang secara otomatis menerapkan tipografi resmi{" "}
              <strong className="text-blue-700">Times New Roman</strong>, tabel proporsional, dan tata letak dokumen yang siap diserahkan untuk skripsi atau tugas kantor.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-blue-100 px-3 py-1.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Format Font Times New Roman</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-white border border-blue-100 px-3 py-1.5 rounded-xl shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Tabel & Diagram Teratur</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-blue-100/80 flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 group-hover:underline">
              Buka Konverter Word Sekarang
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {/* KARTU 2 UTAMA: AI Document Copilot In-House (5 Kolom) */}
      {aiCopilot && (
        <div
          onClick={() => onSelectTool(aiCopilot)}
          className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-white to-indigo-50/30 border border-indigo-200/90 p-7 sm:p-8 flex flex-col justify-between cursor-pointer hover:shadow-lg hover:border-indigo-300 transition-all text-left relative overflow-hidden group select-none"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-[11px] tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ASISTEN IN-HOUSE
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
              AI Document Copilot
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Analisis bab, ringkas klausul perjanjian, dan ajukan pertanyaan langsung pada AI tanpa perlu berpindah ke aplikasi lain.
            </p>

            <div className="mt-6 space-y-2">
              <div className="p-2.5 rounded-xl bg-white border border-indigo-100 text-[11px] text-slate-600 font-medium">
                💬 <em>"Rangkum 3 poin krusial dari bab kesimpulan ini..."</em>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-indigo-100 text-[11px] text-slate-600 font-medium">
                ⚡ <em>"Bagaimana struktur format tabel yang tepat?"</em>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-indigo-100/80 flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 group-hover:underline">
              Buka AI Dokumen
            </span>
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform shadow-sm">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
