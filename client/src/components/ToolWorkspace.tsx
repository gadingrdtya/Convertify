"use client";

import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  UploadCloud,
  FileCheck,
  Download,
  RotateCcw,
  AlertCircle,
  Loader2,
  Lock,
  ArrowLeft,
  Trash2,
  Type,
  Plus,
  Stamp,
  Hash,
} from "lucide-react";
import { ToolItem } from "@/data/tools";
import {
  mergePdfFiles,
  splitPdfFile,
  rotatePdfFile,
  deletePdfPage,
  watermarkPdfFile,
  addPageNumbersPdf,
} from "@/tools/pdfLibTools";
import { convertImagesToPdf } from "@/tools/imageTools";
import { consumeGuestQuota } from "@/utils/quota";
import API_BASE_URL from "@/utils/api";

interface ToolWorkspaceProps {
  tool: ToolItem;
  onBack: () => void;
  initialFile?: File | null;
  isLoggedIn: boolean;
  onQuotaExceeded: () => void;
  onRefreshQuota: () => void;
}

export function ToolWorkspace({
  tool,
  onBack,
  initialFile,
  isLoggedIn,
  onQuotaExceeded,
  onRefreshQuota,
}: ToolWorkspaceProps) {
  const [files, setFiles] = useState<File[]>(initialFile ? [initialFile] : []);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tool specific options
  const [splitStart, setSplitStart] = useState<number>(1);
  const [splitEnd, setSplitEnd] = useState<number>(1);
  const [pageToDelete, setPageToDelete] = useState<number>(1);
  const [rotateAngle, setRotateAngle] = useState<number>(90);
  const [watermarkText, setWatermarkText] = useState<string>("CONFIDENTIAL");
  const [password, setPassword] = useState<string>("");
  const [compressLevel, setCompressLevel] = useState<"extreme" | "recommended" | "low">("recommended");
  const [selectedFont, setSelectedFont] = useState<string>("Times New Roman");

  useEffect(() => {
    if (initialFile) {
      setFiles([initialFile]);
    }
  }, [initialFile]);

  const onDrop = (acceptedFiles: File[]) => {
    setErrorMsg(null);
    setDownloadUrl(null);
    if (tool.id === "merge-pdf" || tool.id === "image-to-pdf") {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    } else {
      setFiles(acceptedFiles.slice(0, 1));
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    noClick: files.length > 0,
    accept:
      tool.id === "image-to-pdf"
        ? { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }
        : tool.id === "docx-to-pdf"
        ? { "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] }
        : { "application/pdf": [".pdf"] },
    multiple: tool.id === "merge-pdf" || tool.id === "image-to-pdf",
  });

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;

    // Check & Consume Guest Quota
    const allowed = consumeGuestQuota(isLoggedIn);
    if (!allowed) {
      onQuotaExceeded();
      return;
    }
    onRefreshQuota();

    setProcessing(true);
    setErrorMsg(null);

    try {
      if (tool.id === "merge-pdf") {
        if (files.length < 2) {
          throw new Error("Pilih minimal 2 file dokumen PDF untuk digabungkan.");
        }
        const blob = await mergePdfFiles(files);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setResultFileName("convertify_merged.pdf");
      } else if (tool.id === "split-pdf") {
        const blob = await splitPdfFile(files[0], splitStart, splitEnd);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setResultFileName(`convertify_split_${splitStart}_to_${splitEnd}.pdf`);
      } else if (tool.id === "rotate-pdf") {
        const blob = await rotatePdfFile(files[0], rotateAngle);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setResultFileName(`rotated_${files[0].name}`);
      } else if (tool.id === "delete-pdf-pages") {
        const blob = await deletePdfPage(files[0], pageToDelete);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setResultFileName(`modified_${files[0].name}`);
      } else if (tool.id === "watermark-pdf") {
        const blob = await watermarkPdfFile(files[0], watermarkText);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setResultFileName(`watermarked_${files[0].name}`);
      } else if (tool.id === "page-numbers") {
        const blob = await addPageNumbersPdf(files[0]);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setResultFileName(`numbered_${files[0].name}`);
      } else if (tool.id === "image-to-pdf") {
        const blob = await convertImagesToPdf(files);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setResultFileName("convertify_images.pdf");
      } else {
        const formData = new FormData();
        formData.append("file", files[0]);

        let endpoint = "";
        let expectedExt = ".pdf";

        if (tool.id === "pdf-to-docx") {
          endpoint = `${API_BASE_URL}/api/convert/pdf-to-docx?font=${encodeURIComponent(selectedFont)}`;
          expectedExt = ".docx";
          setResultFileName(files[0].name.replace(/\.[^/.]+$/, "") + ".docx");
        } else if (tool.id === "pdf-to-txt") {
          endpoint = `${API_BASE_URL}/api/convert/pdf-to-txt`;
          expectedExt = ".txt";
          setResultFileName(files[0].name.replace(/\.[^/.]+$/, "") + ".txt");
        } else if (tool.id === "pdf-to-jpg") {
          endpoint = `${API_BASE_URL}/api/convert/pdf-to-image?format=jpg`;
          expectedExt = ".jpg";
          setResultFileName(files[0].name.replace(/\.[^/.]+$/, "") + ".jpg");
        } else if (tool.id === "pdf-to-png") {
          endpoint = `${API_BASE_URL}/api/convert/pdf-to-image?format=png`;
          expectedExt = ".png";
          setResultFileName(files[0].name.replace(/\.[^/.]+$/, "") + ".png");
        } else if (tool.id === "docx-to-pdf") {
          endpoint = `${API_BASE_URL}/api/convert/docx-to-pdf`;
          setResultFileName(files[0].name.replace(/\.[^/.]+$/, "") + ".pdf");
        } else if (tool.id === "compress-pdf") {
          endpoint = `${API_BASE_URL}/api/optimize/compress?level=${compressLevel}`;
          setResultFileName("compressed_" + files[0].name);
        } else if (tool.id === "protect-pdf") {
          endpoint = `${API_BASE_URL}/api/security/protect?password=${encodeURIComponent(password)}`;
          setResultFileName("protected_" + files[0].name);
        } else if (tool.id === "unlock-pdf") {
          endpoint = `${API_BASE_URL}/api/security/unlock?password=${encodeURIComponent(password)}`;
          setResultFileName("unlocked_" + files[0].name);
        } else {
          // Universal safe transform endpoint
          endpoint = `${API_BASE_URL}/api/convert/universal-transform`;
          setResultFileName("convertify_" + files[0].name);
        }

        const res = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `Server status ${res.status}. Pastikan FastAPI aktif.`);
        }

        const resBlob = await res.blob();
        const url = URL.createObjectURL(resBlob);
        setDownloadUrl(url);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Gagal memproses dokumen.");
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setDownloadUrl(null);
    setErrorMsg(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10 sm:py-14">
      {/* Tombol kembali */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Katalog Alat</span>
        </button>
      </div>

      {/* Kontainer Utama */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm text-center">
        {/* Ikon badge pastel */}
        <div
          style={{ backgroundColor: tool.badgeBg, color: tool.badgeColor }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-xs shadow-2xs"
        >
          {tool.badgeLabel}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {tool.title}
        </h1>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          {tool.description}
        </p>

        {!downloadUrl ? (
          <div className="mt-8">
            {files.length === 0 ? (
              <div
                {...getRootProps()}
                className={`py-12 px-6 rounded-2xl border-2 border-dashed transition-all ${
                  isDragActive
                    ? "border-blue-600 bg-blue-50"
                    : "border-slate-200 hover:border-blue-400 bg-slate-50/50"
                }`}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center">
                  <button
                    type="button"
                    onClick={open}
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base rounded-2xl transition-all shadow-md shadow-blue-500/25 flex items-center gap-3 cursor-pointer"
                  >
                    <UploadCloud className="w-6 h-6" />
                    <span>Pilih Berkas Dokumen</span>
                  </button>
                  <p className="text-xs text-slate-400 mt-3 font-medium">
                    atau seret dan lepas berkas Anda di sini
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File list */}
                <div className="max-w-lg mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Berkas Terpilih ({files.length})
                    </span>
                    {(tool.id === "merge-pdf" || tool.id === "image-to-pdf") && (
                      <button
                        onClick={open}
                        className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah File
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-white border border-slate-200/80 rounded-xl text-left"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <FileCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-bold text-slate-800 truncate">{file.name}</p>
                            <p className="text-[11px] text-slate-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(idx)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Opsi */}
                {tool.id === "pdf-to-docx" && (
                  <div className="max-w-lg mx-auto p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                    <div className="flex items-center gap-2">
                      <Type className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Format Tipografi Word</p>
                        <p className="text-[11px] text-slate-500">Pilih font standar untuk hasil konversi</p>
                      </div>
                    </div>
                    <select
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
                      className="text-xs font-bold px-3 py-2 rounded-xl bg-white border border-blue-200 text-blue-900 focus:outline-none"
                    >
                      <option value="Times New Roman">Times New Roman (Skripsi & Resmi)</option>
                      <option value="Arial">Arial</option>
                      <option value="Calibri">Calibri</option>
                      <option value="Georgia">Georgia</option>
                    </select>
                  </div>
                )}

                {tool.id === "watermark-pdf" && (
                  <div className="max-w-lg mx-auto p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center gap-3 text-left">
                    <Stamp className="w-5 h-5 text-teal-600 flex-shrink-0" />
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="Teks Cap Air (Contoh: RAHASIA, DRAFT)..."
                      className="flex-1 text-xs px-3 py-2 rounded-xl border border-teal-200 bg-white text-slate-800 focus:outline-none"
                    />
                  </div>
                )}

                {tool.id === "rotate-pdf" && (
                  <div className="max-w-lg mx-auto p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between text-left">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Sudut Rotasi</p>
                      <p className="text-[11px] text-slate-500">Putar halaman dokumen</p>
                    </div>
                    <select
                      value={rotateAngle}
                      onChange={(e) => setRotateAngle(parseInt(e.target.value) || 90)}
                      className="text-xs font-bold px-3 py-2 rounded-xl bg-white border border-purple-200 text-purple-900 focus:outline-none"
                    >
                      <option value={90}>90° Searah Jarum Jam</option>
                      <option value={180}>180° Terbalik</option>
                      <option value={270}>270° Berlawanan Jarum Jam</option>
                    </select>
                  </div>
                )}

                {tool.id === "delete-pdf-pages" && (
                  <div className="max-w-lg mx-auto p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-between text-left">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Nomor Halaman</p>
                      <p className="text-[11px] text-slate-500">Halaman yang ingin dibuang</p>
                    </div>
                    <input
                      type="number"
                      min={1}
                      value={pageToDelete}
                      onChange={(e) => setPageToDelete(parseInt(e.target.value) || 1)}
                      className="w-16 px-2.5 py-1.5 rounded-lg border border-purple-200 bg-white text-center font-bold text-xs"
                    />
                  </div>
                )}

                {tool.id === "split-pdf" && (
                  <div className="max-w-lg mx-auto p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-center justify-center gap-3 text-xs">
                    <span className="font-bold text-slate-700">Rentang Lembar:</span>
                    <input
                      type="number"
                      min={1}
                      value={splitStart}
                      onChange={(e) => setSplitStart(parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1.5 rounded-lg border border-purple-200 bg-white text-center font-bold"
                    />
                    <span className="text-slate-400">sampai</span>
                    <input
                      type="number"
                      min={1}
                      value={splitEnd}
                      onChange={(e) => setSplitEnd(parseInt(e.target.value) || 1)}
                      className="w-16 px-2 py-1.5 rounded-lg border border-purple-200 bg-white text-center font-bold"
                    />
                  </div>
                )}

                {(tool.id === "protect-pdf" || tool.id === "unlock-pdf") && (
                  <div className="max-w-lg mx-auto p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <input
                      type="password"
                      placeholder="Masukkan kata sandi..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 rounded-xl border border-rose-200 bg-white text-slate-800 focus:outline-none"
                    />
                  </div>
                )}

                {tool.id === "compress-pdf" && (
                  <div className="max-w-lg mx-auto p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Tingkat Kompresi</p>
                      <p className="text-[11px] text-slate-500">Pilih rasio ukuran dokumen</p>
                    </div>
                    <select
                      value={compressLevel}
                      onChange={(e) => setCompressLevel(e.target.value as "extreme" | "recommended" | "low")}
                      className="text-xs font-bold px-3 py-2 rounded-xl bg-white border border-rose-200 text-rose-900 focus:outline-none"
                    >
                      <option value="recommended">Rekomendasi (Keseimbangan Bagus)</option>
                      <option value="extreme">Ekstrem (Ukuran Paling Kecil)</option>
                      <option value="low">Rendah (Sedikit Kompresi)</option>
                    </select>
                  </div>
                )}

                {/* Pesan Kesalahan */}
                {errorMsg && (
                  <div className="max-w-lg mx-auto p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Tombol Proses */}
                <div>
                  <button
                    onClick={handleProcess}
                    disabled={processing}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md shadow-blue-500/25 flex items-center gap-2 mx-auto disabled:opacity-50 cursor-pointer"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sedang Memproses...</span>
                      </>
                    ) : (
                      <span>Mulai {tool.title} →</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <FileCheck className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800">
              Dokumen Selesai Diproses!
            </h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Berkas Anda telah siap diunduh tanpa jejak log penyimpanan.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={downloadUrl}
                download={resultFileName}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-2xl transition-all shadow-md hover:shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh {resultFileName}</span>
              </a>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Proses Berkas Lain</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
