"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  FileText,
  Upload,
  Download,
  RotateCcw,
  AlertTriangle,
  Loader2,
  Trash2,
  Lock,
} from "lucide-react";
import { ToolItem } from "@/data/tools";
import { mergePdfFiles, splitPdfFile } from "@/tools/pdfLibTools";
import { convertImagesToPdf } from "@/tools/imageTools";

interface Win98ToolWindowProps {
  tool: ToolItem;
  onClose: () => void;
}

export function Win98ToolWindow({ tool, onClose }: Win98ToolWindowProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [resultFileName, setResultFileName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Options
  const [splitStart, setSplitStart] = useState<number>(1);
  const [splitEnd, setSplitEnd] = useState<number>(1);
  const [password, setPassword] = useState<string>("");
  const [compressLevel, setCompressLevel] = useState<"extreme" | "recommended" | "low">("recommended");
  const [selectedFont, setSelectedFont] = useState<string>("Times New Roman");

  const onDrop = (acceptedFiles: File[]) => {
    setErrorMsg(null);
    setDownloadUrl(null);
    if (tool.id === "merge-pdf" || tool.id === "image-to-pdf") {
      setFiles((prev) => [...prev, ...acceptedFiles]);
    } else {
      setFiles(acceptedFiles.slice(0, 1));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
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
        setResultFileName("Merged_Document.pdf");
      } else if (tool.id === "split-pdf") {
        const blob = await splitPdfFile(files[0], splitStart, splitEnd);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setResultFileName(`Split_Pages_${splitStart}_to_${splitEnd}.pdf`);
      } else if (tool.id === "image-to-pdf") {
        const blob = await convertImagesToPdf(files);
        const url = URL.createObjectURL(blob);
        setDownloadUrl(url);
        setResultFileName("Images_Converted.pdf");
      } else {
        const formData = new FormData();
        formData.append("file", files[0]);

        let endpoint = "";
        if (tool.id === "pdf-to-docx") {
          endpoint = `http://localhost:8000/api/convert/pdf-to-docx?font=${encodeURIComponent(selectedFont)}`;
          setResultFileName(files[0].name.replace(/\.[^/.]+$/, "") + ".docx");
        } else if (tool.id === "docx-to-pdf") {
          endpoint = "http://localhost:8000/api/convert/docx-to-pdf";
          setResultFileName(files[0].name.replace(/\.[^/.]+$/, "") + ".pdf");
        } else if (tool.id === "compress-pdf") {
          endpoint = `http://localhost:8000/api/optimize/compress?level=${compressLevel}`;
          setResultFileName("Compressed_" + files[0].name);
        } else if (tool.id === "protect-pdf") {
          endpoint = `http://localhost:8000/api/security/protect?password=${encodeURIComponent(password)}`;
          setResultFileName("Protected_" + files[0].name);
        } else if (tool.id === "unlock-pdf") {
          endpoint = `http://localhost:8000/api/security/unlock?password=${encodeURIComponent(password)}`;
          setResultFileName("Unlocked_" + files[0].name);
        }

        const res = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || `Server status ${res.status}. Pastikan backend aktif.`);
        }

        const resBlob = await res.blob();
        const url = URL.createObjectURL(resBlob);
        setDownloadUrl(url);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg("Terjadi kegagalan pemrosesan.");
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
    <div className="win98-outset w-full max-w-3xl mx-auto my-4 overflow-hidden">
      {/* Title Bar */}
      <div className="win98-titlebar">
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-white" />
          <span>{tool.title}.exe - Convertify 98 Application</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="win98-titlebar-btn" title="Minimize">_</button>
          <button className="win98-titlebar-btn" title="Maximize">□</button>
          <button onClick={onClose} className="win98-titlebar-btn text-red-900 font-bold" title="Close">✕</button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="bg-[#c0c0c0] border-b border-gray-400 px-2 py-1 text-xs flex gap-3 text-black">
        <span className="hover:bg-blue-800 hover:text-white px-1.5 cursor-pointer"><u>F</u>ile</span>
        <span className="hover:bg-blue-800 hover:text-white px-1.5 cursor-pointer"><u>E</u>dit</span>
        <span className="hover:bg-blue-800 hover:text-white px-1.5 cursor-pointer"><u>V</u>iew</span>
        <span className="hover:bg-blue-800 hover:text-white px-1.5 cursor-pointer"><u>O</u>ptions</span>
        <span className="hover:bg-blue-800 hover:text-white px-1.5 cursor-pointer"><u>H</u>elp</span>
      </div>

      {/* Main Window Content */}
      <div className="p-4 bg-[#c0c0c0] space-y-4">
        {/* Description Banner */}
        <div className="win98-inset-gray p-2 text-xs flex items-center justify-between">
          <span>{tool.description}</span>
          <span className="font-mono text-[10px] text-gray-700 bg-white px-1 border border-gray-500">
            {tool.execution === "client" ? "LOCAL_RAM" : "FASTAPI_WORKER"}
          </span>
        </div>

        {!downloadUrl ? (
          <div>
            {/* Retro Dropzone */}
            <div
              {...getRootProps()}
              className={`win98-inset p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? "bg-blue-50" : "bg-white"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 text-blue-900 mx-auto mb-2" />
              <p className="text-xs font-bold text-black">
                {isDragActive
                  ? "Lepaskan berkas ke dalam folder ini..."
                  : "Klik 'Browse' atau drag & drop file ke area ini"}
              </p>
              <p className="text-[10px] text-gray-500 font-mono mt-1">
                Format: {tool.id === "image-to-pdf" ? "*.JPG, *.PNG" : tool.id === "docx-to-pdf" ? "*.DOCX" : "*.PDF"}
              </p>
            </div>

            {/* Selected File List / Data Grid */}
            {files.length > 0 && (
              <div className="mt-3">
                <span className="text-xs font-bold block mb-1">Daftar Dokumen Antrean:</span>
                <div className="win98-inset bg-white max-h-36 overflow-y-auto font-mono text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-[#dfdfdf] border-b border-gray-400 text-[10px]">
                      <tr>
                        <th className="p-1">Nama File</th>
                        <th className="p-1">Ukuran</th>
                        <th className="p-1 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file, idx) => (
                        <tr key={idx} className="border-b border-gray-200 hover:bg-blue-800 hover:text-white">
                          <td className="p-1 truncate max-w-[200px]">{file.name}</td>
                          <td className="p-1">{(file.size / 1024).toFixed(1)} KB</td>
                          <td className="p-1 text-right">
                            <button
                              onClick={() => removeFile(idx)}
                              className="text-red-700 hover:text-white font-bold px-1"
                            >
                              [X]
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Options Panel (Windows 98 Group Box) */}
            <div className="mt-4 border border-gray-400 p-3 relative pt-4">
              <span className="absolute -top-2 left-3 bg-[#c0c0c0] px-1 text-xs font-bold text-gray-800">
                Pengaturan Parameter
              </span>

              {tool.id === "pdf-to-docx" && (
                <div className="flex items-center gap-2 text-xs">
                  <label htmlFor="fontSelect">Standar Tipografi Dokumen:</label>
                  <select
                    id="fontSelect"
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="win98-inset bg-white px-2 py-0.5 text-xs font-mono"
                  >
                    <option value="Times New Roman">Times New Roman (Skripsi & Standar Kantor)</option>
                    <option value="Arial">Arial (Sans-Serif)</option>
                    <option value="Calibri">Calibri</option>
                  </select>
                </div>
              )}

              {tool.id === "split-pdf" && (
                <div className="flex items-center gap-3 text-xs">
                  <span>Potong Halaman:</span>
                  <label>Dari:</label>
                  <input
                    type="number"
                    min={1}
                    value={splitStart}
                    onChange={(e) => setSplitStart(parseInt(e.target.value) || 1)}
                    className="win98-inset bg-white w-14 px-1 py-0.5 text-center font-mono text-xs"
                  />
                  <label>Sampai:</label>
                  <input
                    type="number"
                    min={1}
                    value={splitEnd}
                    onChange={(e) => setSplitEnd(parseInt(e.target.value) || 1)}
                    className="win98-inset bg-white w-14 px-1 py-0.5 text-center font-mono text-xs"
                  />
                </div>
              )}

              {tool.id === "compress-pdf" && (
                <div className="flex items-center gap-2 text-xs">
                  <label>Level Kompresi:</label>
                  <select
                    value={compressLevel}
                    onChange={(e) => setCompressLevel(e.target.value as "extreme" | "recommended" | "low")}
                    className="win98-inset bg-white px-2 py-0.5 text-xs font-mono"
                  >
                    <option value="recommended">Recommended (Optimal kualitas & rasio)</option>
                    <option value="extreme">Extreme (Ukuran terkecil)</option>
                    <option value="low">Low (Metadata only)</option>
                  </select>
                </div>
              )}

              {(tool.id === "protect-pdf" || tool.id === "unlock-pdf") && (
                <div className="flex items-center gap-2 text-xs">
                  <label>Password:</label>
                  <input
                    type="password"
                    placeholder="Ketik password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="win98-inset bg-white px-2 py-0.5 flex-1 text-xs font-mono"
                  />
                </div>
              )}
            </div>

            {/* Error Message Dialog */}
            {errorMsg && (
              <div className="mt-3 win98-outset bg-[#ffffe1] p-2 flex items-center gap-2 text-xs text-red-900 border-red-800">
                <AlertTriangle className="w-4 h-4 text-red-700 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Dialog Buttons */}
            <div className="mt-4 flex justify-end gap-2 border-t border-gray-400 pt-3">
              <button
                onClick={onClose}
                className="win98-button"
              >
                Batal
              </button>
              <button
                onClick={handleProcess}
                disabled={processing || files.length === 0}
                className="win98-button font-bold text-blue-900 disabled:opacity-50"
              >
                {processing ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Memproses...
                  </span>
                ) : (
                  <span>Eksekusi...</span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Process Completed Screen */
          <div className="win98-inset bg-white p-6 text-center space-y-3">
            <div className="w-10 h-10 mx-auto bg-green-100 border border-green-800 flex items-center justify-center text-green-800 font-bold text-lg font-mono">
              OK
            </div>
            <h3 className="text-sm font-bold text-black font-sans">
              Operasi Berhasil Diselesaikan!
            </h3>
            <p className="text-xs text-gray-600 font-mono">
              Berkas: {resultFileName}
            </p>

            <div className="pt-3 flex justify-center gap-3">
              <a
                href={downloadUrl}
                download={resultFileName}
                className="win98-button bg-[#d4d0c8] font-bold text-blue-900"
              >
                <Download className="w-3.5 h-3.5 mr-1 inline" />
                Simpan Berkas (Download)...
              </a>
              <button
                onClick={handleReset}
                className="win98-button"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1 inline" />
                Proses Berkas Baru
              </button>
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="win98-inset-gray px-2 py-0.5 text-[10px] font-mono text-gray-700 flex justify-between">
          <span>Status: {processing ? "RUNNING..." : downloadUrl ? "COMPLETED" : "READY"}</span>
          <span>100% Zero Knowledge Storage</span>
        </div>
      </div>
    </div>
  );
}
