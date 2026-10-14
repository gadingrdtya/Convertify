import React from "react";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kolom 1 Brand */}
          <div className="space-y-3">
            <BrandLogo size={32} />
            <p className="text-xs text-slate-500 leading-relaxed">
              Solusi dokumen PDF online lengkap, cepat, dan 100% aman. Konversi, gabung, kompres, dan modifikasi file tanpa batasan.
            </p>
          </div>

          {/* Kolom 2 Konversi */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">
              Konversi Populer
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><a href="#katalog-alat" className="hover:text-blue-600 transition-colors">PDF ke Word (.docx)</a></li>
              <li><a href="#katalog-alat" className="hover:text-blue-600 transition-colors">Word ke PDF</a></li>
              <li><a href="#katalog-alat" className="hover:text-blue-600 transition-colors">Gambar ke PDF</a></li>
            </ul>
          </div>

          {/* Kolom 3 Utilitas */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">
              Alat Dokumen
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 font-medium">
              <li><a href="#katalog-alat" className="hover:text-blue-600 transition-colors">Gabung PDF (Merge)</a></li>
              <li><a href="#katalog-alat" className="hover:text-blue-600 transition-colors">Pisah PDF (Split)</a></li>
              <li><a href="#katalog-alat" className="hover:text-blue-600 transition-colors">Kompres Ukuran PDF</a></li>
              <li><a href="#katalog-alat" className="hover:text-blue-600 transition-colors">Kunci & Buka Sandi</a></li>
            </ul>
          </div>

          {/* Kolom 4 Keamanan */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-wider uppercase mb-3">
              Privasi & Jaminan
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              File Anda aman bersama kami. Seluruh dokumen otomatis dihapus tanpa penyimpanan jangka panjang.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>100% Bebas Jejak Log</span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Convertify PDF. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-blue-600">Privasi</a>
            <a href="#" className="hover:text-blue-600">Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
