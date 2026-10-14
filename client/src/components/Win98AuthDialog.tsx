"use client";

import React, { useState } from "react";
import { X, Lock, Mail, User, ShieldCheck } from "lucide-react";

interface Win98AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (name: string) => void;
}

export function Win98AuthDialog({ isOpen, onClose, onSuccess }: Win98AuthDialogProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    const displayName = mode === "signup" && name ? name : email.split("@")[0];
    localStorage.setItem("convertify_user", JSON.stringify({ email, name: displayName }));
    onSuccess(displayName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-none">
      <div className="win98-outset w-full max-w-sm shadow-2xl overflow-hidden select-none">
        {/* Title bar */}
        <div className="win98-titlebar">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-white" />
            <span>Windows 98 Security - {mode === "signin" ? "Login" : "Register"}</span>
          </div>
          <button onClick={onClose} className="win98-titlebar-btn font-bold text-red-900">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 bg-[#c0c0c0] space-y-3">
          <p className="text-xs text-black">
            Masukkan kredensial pengguna untuk mengakses sesi kerja Convertify:
          </p>

          <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
            {mode === "signup" && (
              <div>
                <label className="block mb-1 font-bold">Nama Pengguna:</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ketik nama..."
                  className="win98-inset bg-white px-2 py-1 w-full font-mono text-xs focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block mb-1 font-bold">Alamat Email:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="win98-inset bg-white px-2 py-1 w-full font-mono text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-bold">Kata Sandi:</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="win98-inset bg-white px-2 py-1 w-full font-mono text-xs focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-gray-400">
              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-[11px] text-blue-900 underline hover:font-bold"
              >
                {mode === "signin" ? "Daftar Akun Baru" : "Sudah punya akun? Masuk"}
              </button>

              <div className="flex gap-1.5">
                <button type="button" onClick={onClose} className="win98-button text-xs">
                  Batal
                </button>
                <button type="submit" className="win98-button text-xs font-bold text-blue-900">
                  OK
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
