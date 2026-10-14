import React from "react";
import { HardDrive, Shield, Zap, FileText } from "lucide-react";

export function TrustBadges() {
  const badges = [
    {
      icon: <HardDrive className="w-4 h-4 text-blue-600" />,
      title: "Local Client RAM",
      desc: "Merge, split & gambar diproses di browser tanpa pernah diunggah.",
    },
    {
      icon: <Shield className="w-4 h-4 text-blue-600" />,
      title: "Jaminan Zero Retention",
      desc: "File konversi otomatis terhapus seketika tanpa indeks penyimpanan.",
    },
    {
      icon: <Zap className="w-4 h-4 text-blue-600" />,
      title: "Fast Micro-Workers",
      desc: "Throughput konversi tinggi didukung engine PyMuPDF & pdf2docx.",
    },
    {
      icon: <FileText className="w-4 h-4 text-blue-600" />,
      title: "Standar Times New Roman",
      desc: "Hasil dokumen Word rapi, proporsional, dan siap pakai.",
    },
  ];

  return (
    <section className="w-full border-y border-slate-200/80 bg-white py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map((b, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                {b.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{b.title}</p>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
