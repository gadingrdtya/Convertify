"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Menu, X, UserCircle, LogOut } from "lucide-react";
import { BrandLogo } from "./BrandLogo";

interface NavbarProps {
  onOpenAuth: (mode: "signin" | "signup") => void;
  onOpenAI: () => void;
  currentUser?: string | null;
  onSignOut?: () => void;
  guestQuota?: { remaining: number; total: number; isLoggedIn: boolean };
}

export function Navbar({
  onOpenAuth,
  onOpenAI,
  currentUser,
  onSignOut,
  guestQuota,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="hover:opacity-95 transition-opacity">
          <BrandLogo size={36} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <a href="#katalog-alat" className="hover:text-blue-600 transition-colors">
            Katalog 30+ Alat
          </a>
          <button
            onClick={onOpenAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI Copilot</span>
          </button>
        </nav>

        {/* Auth CTA & Guest Quota Badge */}
        <div className="hidden md:flex items-center gap-3">
          {/* Guest Quota Badge */}
          {!currentUser && guestQuota && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-600">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  guestQuota.remaining > 0 ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span>
                Kuota Tamu:{" "}
                <strong className="text-slate-900">
                  {guestQuota.remaining}/{guestQuota.total}
                </strong>
              </span>
            </div>
          )}

          {currentUser ? (
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-blue-900">
              <UserCircle className="w-4 h-4 text-blue-600" />
              <span>{currentUser}</span>
              {onSignOut && (
                <button
                  onClick={onSignOut}
                  title="Keluar"
                  className="p-1 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => onOpenAuth("signin")}
                className="text-xs font-bold text-slate-700 hover:text-blue-600 px-3.5 py-2 cursor-pointer transition-colors"
              >
                Masuk
              </button>
              <button
                onClick={() => onOpenAuth("signup")}
                className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full transition-colors cursor-pointer shadow-sm hover:shadow-md"
              >
                Daftar Gratis
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-blue-600 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-5 py-4 space-y-3">
          <a
            href="#katalog-alat"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800"
          >
            Katalog 30+ Alat
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAI();
            }}
            className="w-full text-left py-2 text-sm font-bold text-blue-600 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Asisten PDF</span>
          </button>

          {!currentUser && guestQuota && (
            <div className="p-2 bg-slate-50 rounded-xl text-xs text-slate-600 font-semibold flex items-center justify-between">
              <span>Sisa Kuota Tamu Hari Ini:</span>
              <span className="font-bold text-blue-700">
                {guestQuota.remaining} dari {guestQuota.total}
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg text-xs font-bold text-blue-900">
                <span className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-blue-600" />
                  {currentUser}
                </span>
                {onSignOut && (
                  <button onClick={onSignOut} className="text-rose-600">
                    Keluar
                  </button>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("signin");
                  }}
                  className="w-full text-center py-2.5 text-xs font-bold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Masuk
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth("signup");
                  }}
                  className="w-full text-center py-2.5 text-xs font-bold text-white bg-blue-600 rounded-xl shadow-sm"
                >
                  Daftar Akun Baru
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
