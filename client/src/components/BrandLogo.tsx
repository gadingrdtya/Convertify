import React from "react";

export function BrandLogo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 shadow-md shadow-blue-500/20"
      >
        <svg
          width={size * 0.62}
          height={size * 0.62}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Document shape with fold */}
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          {/* Fluid conversion arrows */}
          <path d="M9 13l2-2 2 2" strokeWidth="2.2" />
          <path d="M11 11v6" strokeWidth="2.2" />
        </svg>
        {/* Subtle accent badge */}
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-300 border-2 border-white" />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-extrabold text-lg tracking-tight text-blue-950 font-sans">
            Convert<span className="text-blue-600">ify</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full">
            PDF
          </span>
        </div>
      </div>
    </div>
  );
}
