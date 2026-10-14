"use client";

import React, { useState, useEffect } from "react";
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
  onLoginSuccess?: (name: string) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
  onLoginSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signedInUser, setSignedInUser] = useState<string | null>(null);

  // Reset seluruh form dan status sesi lokal modal setiap kali modal dibuka atau ditutup
  useEffect(() => {
    if (isOpen) {
      setSignedInUser(null);
      setEmail("");
      setPassword("");
      setName("");
      setMode(initialMode);
    } else {
      setSignedInUser(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const displayName = mode === "signup" && name.trim() ? name.trim() : email.split("@")[0];
    localStorage.setItem("convertify_user", JSON.stringify({ email, name: displayName }));
    setSignedInUser(displayName);

    if (onLoginSuccess) {
      onLoginSuccess(displayName);
    }

    setTimeout(() => {
      setSignedInUser(null);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setSignedInUser(null);
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {signedInUser ? (
          <div className="py-6 text-center space-y-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Selamat datang, {signedInUser}!
            </h3>
            <p className="text-xs text-slate-500">
              Akun Anda siap digunakan untuk memproses dokumen tanpa batas.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BrandLogo size={32} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              {mode === "signin" ? "Masuk ke Akun" : "Daftar Akun Gratis"}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Akses kuota tanpa batas dan simpan riwayat berkas Anda.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              {mode === "signup" && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nama Lengkap
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      placeholder="Nama Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Alamat Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-slate-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-1.5 mt-3 cursor-pointer"
              >
                <span>{mode === "signin" ? "Masuk Sekarang" : "Daftar Akun"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                Data Aman
              </span>
              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="font-bold text-blue-600 hover:underline cursor-pointer"
              >
                {mode === "signin" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
