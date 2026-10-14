"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, ArrowRight, FileCheck, Layers, FileText, Minimize2 } from "lucide-react";
import { ToolItem, TOOLS } from "@/data/tools";

interface HeroActionDropzoneProps {
  onSelectToolWithFile: (tool: ToolItem, file: File) => void;
}

export function HeroActionDropzone({ onSelectToolWithFile }: HeroActionDropzoneProps) {
  const [draggedFile, setDraggedFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setDraggedFile(file);

      // Auto-detect best tool
      const ext = file.name.split(".").pop()?.toLowerCase();
      let matchedTool: ToolItem | undefined;

      if (ext === "pdf") {
        matchedTool = TOOLS.find((t) => t.id === "pdf-to-docx");
      } else if (ext === "docx" || ext === "doc") {
        matchedTool = TOOLS.find((t) => t.id === "docx-to-pdf");
      } else if (["jpg", "jpeg", "png"].includes(ext || "")) {
        matchedTool = TOOLS.find((t) => t.id === "image-to-pdf");
      } else {
        matchedTool = TOOLS[0];
      }

      if (matchedTool) {
        onSelectToolWithFile(matchedTool, file);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div className="w-full max-w-xl mx-auto mt-7">
      <div
        {...getRootProps()}
        className={`relative rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all border-2 border-dashed ${
          isDragActive
            ? "border-blue-600 bg-blue-50/70 scale-[1.01]"
            : "border-slate-300 hover:border-blue-500 bg-white shadow-sm hover:shadow-md"
        }`}
      >
        <input {...getInputProps()} />

        <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 shadow-2xs">
          <UploadCloud className="w-6 h-6" />
        </div>

        <h3 className="text-sm sm:text-base font-bold text-slate-900">
          {isDragActive
            ? "Lepaskan dokumen Anda di sini..."
            : "Seret dokumen ke sini untuk memulai instan"}
        </h3>

        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Sistem otomatis mendeteksi format <span className="font-semibold text-slate-700">PDF, Word (.docx)</span>, atau <span className="font-semibold text-slate-700">Gambar</span> Anda.
        </p>

        {/* Quick format tags */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-mono font-bold text-slate-600">
          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">.PDF</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">.DOCX</span>
          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">.PNG / .JPG</span>
        </div>
      </div>
    </div>
  );
}
