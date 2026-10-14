"use client";

import React from "react";
import { ToolItem, TOOLS } from "@/data/tools";
import { ToolTile } from "./ToolTile";

interface MegaCatalogProps {
  onSelectTool: (tool: ToolItem) => void;
}

export function MegaCatalog({ onSelectTool }: MegaCatalogProps) {
  const sections = [
    {
      title: "Konversi ke Office & Format",
      categoryKey: "office",
      tools: TOOLS.filter((t) => t.category === "office" && !t.isHeroFeatured),
    },
    {
      title: "Organisir & Tata Kelola Lembar",
      categoryKey: "organize",
      tools: TOOLS.filter((t) => t.category === "organize"),
    },
    {
      title: "Optimasi, Kompresi & OCR",
      categoryKey: "optimize",
      tools: TOOLS.filter((t) => t.category === "optimize"),
    },
    {
      title: "Edit, Anotasi & Penomoran",
      categoryKey: "edit",
      tools: TOOLS.filter((t) => t.category === "edit"),
    },
    {
      title: "Keamanan Sandi & Tanda Tangan",
      categoryKey: "security",
      tools: TOOLS.filter((t) => t.category === "security"),
    },
    {
      title: "AI Dokumen Suite",
      categoryKey: "ai",
      tools: TOOLS.filter((t) => t.category === "ai" && !t.isHeroFeatured),
    },
  ];

  return (
    <div className="space-y-10">
      {sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">
              {section.title}
            </h3>
            <span className="text-[11px] font-bold text-slate-400">
              {section.tools.length} Modul
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
            {section.tools.map((tool) => (
              <ToolTile
                key={tool.id}
                tool={tool}
                onSelect={onSelectTool}
                compact={true}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
