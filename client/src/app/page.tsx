"use client";

import React, { useState, useEffect } from "react";
import { Search, Sparkles, FileText, ArrowRight, LayoutGrid, List } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { ToolCard } from "@/components/ToolCard";
import { MegaCatalog } from "@/components/MegaCatalog";
import { SignatureHeroBento } from "@/components/SignatureHeroBento";
import { Footer } from "@/components/Footer";
import { FloatingAIWidget } from "@/components/FloatingAIWidget";
import { ToolWorkspace } from "@/components/ToolWorkspace";
import { AuthModal } from "@/components/AuthModal";
import { TOOLS, ToolCategory, ToolItem } from "@/data/tools";
import { getGuestQuota } from "@/utils/quota";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>("all");
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [viewMode, setViewMode] = useState<"catalog" | "grid">("catalog");

  // Auth modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Quota state
  const [guestQuota, setGuestQuota] = useState<{ remaining: number; total: number; isLoggedIn: boolean }>({
    remaining: 4,
    total: 4,
    isLoggedIn: false,
  });

  // AI Copilot widget state
  const [aiWidgetOpen, setAiWidgetOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("convertify_user");
      let user = null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.name) {
          user = parsed.name;
          setCurrentUser(parsed.name);
        }
      }
      setGuestQuota(getGuestQuota(!!user));
    } catch {
      // pass
    }
  }, []);

  const refreshQuota = () => {
    setGuestQuota(getGuestQuota(!!currentUser));
  };

  const handleOpenAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSignOut = () => {
    localStorage.removeItem("convertify_user");
    setCurrentUser(null);
    setGuestQuota(getGuestQuota(false));
  };

  const handleLoginSuccess = (name: string) => {
    setCurrentUser(name);
    setGuestQuota(getGuestQuota(true));
  };

  const categories: { label: string; value: ToolCategory }[] = [
    { label: "Semua", value: "all" },
    { label: "Office & Dokumen", value: "office" },
    { label: "Organisir Lembar", value: "organize" },
    { label: "Optimasi & OCR", value: "optimize" },
    { label: "Edit & Anotasi", value: "edit" },
    { label: "Keamanan Sandi", value: "security" },
    { label: "AI Dokumen", value: "ai" },
  ];

  const filteredTools = TOOLS.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;
    const matchesQuery =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.badgeLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Navbar
        onOpenAuth={handleOpenAuth}
        onOpenAI={() => setAiWidgetOpen(true)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        guestQuota={guestQuota}
      />

      <main className="flex-1">
        {activeTool ? (
          <ToolWorkspace
            tool={activeTool}
            onBack={() => setActiveTool(null)}
            isLoggedIn={!!currentUser}
            onQuotaExceeded={() => handleOpenAuth("signup")}
            onRefreshQuota={refreshQuota}
          />
        ) : (
          <>
            {/* HERO SECTION DENGAN BENTO UNGGULAN CONVERTIFY */}
            <section className="pt-12 pb-12 sm:pt-16 sm:pb-14 bg-white border-b border-slate-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="max-w-3xl mx-auto space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span>Convertify All-in-One Studio</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                    Ekosistem Dokumen & PDF{" "}
                    <span className="text-blue-600">Terlengkap & Presisi</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-medium">
                    Nikmati konversi Word berstandar resmi Times New Roman, asisten AI in-house, dan 30+ modul pengolah dokumen tanpa jejak log penyimpanan.
                  </p>
                </div>

                {/* SIGNATURE HERO BENTO (Times New Roman & AI Copilot Cards) */}
                {!searchQuery && selectedCategory === "all" && (
                  <SignatureHeroBento
                    onSelectTool={(t) => {
                      if (t.id === "ai-chat-pdf") {
                        setAiWidgetOpen(true);
                      } else {
                        setActiveTool(t);
                      }
                    }}
                  />
                )}

                {/* Search & Kategori Navigasi */}
                <div className="mt-12 max-w-3xl mx-auto space-y-4">
                  {/* Category Pills */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {categories.map((cat) => {
                      const isActive = selectedCategory === cat.value;
                      return (
                        <button
                          key={cat.value}
                          onClick={() => {
                            setSelectedCategory(cat.value);
                            if (cat.value !== "all") setViewMode("grid");
                          }}
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                            isActive
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105"
                              : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                          }`}
                        >
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar & Switcher */}
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <div className="relative w-full max-w-md">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari dari 30+ alat (Word, Excel, Kompres, OCR)..."
                        className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full border border-slate-200 bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-slate-800 placeholder-slate-400 shadow-2xs"
                      />
                    </div>

                    {!searchQuery && selectedCategory === "all" && (
                      <div className="flex items-center p-1 bg-slate-100 rounded-full border border-slate-200/80">
                        <button
                          onClick={() => setViewMode("catalog")}
                          title="Tampilan Kolom Kategori"
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                            viewMode === "catalog"
                              ? "bg-white text-blue-600 shadow-2xs font-bold"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <List className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setViewMode("grid")}
                          title="Tampilan Grid Kartu"
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                            viewMode === "grid"
                              ? "bg-white text-blue-600 shadow-2xs font-bold"
                              : "text-slate-500 hover:text-slate-800"
                          }`}
                        >
                          <LayoutGrid className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* KATALOG UTAMA (30+ MODUL DENGAN SOFT PASTEL BADGES) */}
            <section id="katalog-alat" className="py-12 sm:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {!searchQuery && selectedCategory === "all" && viewMode === "catalog" ? (
                  <MegaCatalog
                    onSelectTool={(t) => {
                      if (t.id === "ai-chat-pdf") {
                        setAiWidgetOpen(true);
                      } else {
                        setActiveTool(t);
                      }
                    }}
                  />
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Menampilkan {filteredTools.length} Alat
                      </span>
                      {selectedCategory === "all" && !searchQuery && (
                        <button
                          onClick={() => setViewMode("catalog")}
                          className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                        >
                          Beralih ke Tampilan Kolom Kategori
                        </button>
                      )}
                    </div>

                    {filteredTools.length === 0 ? (
                      <div className="py-16 text-center bg-white rounded-3xl border border-slate-200">
                        <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-slate-700">Tidak ada modul yang cocok</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Coba gunakan kata kunci pencarian lain.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filteredTools.map((tool) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            onSelect={(t) => {
                              if (t.id === "ai-chat-pdf") {
                                setAiWidgetOpen(true);
                              } else {
                                setActiveTool(t);
                              }
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>

            {/* FOOTER CALLOUT COPILOT */}
            <section className="py-10 bg-white border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-blue-500/20">
                  <div className="max-w-xl space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      Convertify AI Suite
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                      Butuh Bantuan Memproses Dokumen?
                    </h2>
                    <p className="text-xs sm:text-sm text-blue-50 leading-relaxed font-medium">
                      Tanyakan langsung kepada AI seputar format font Times New Roman, ringkasan berkas, atau rekomendasi modul yang tepat.
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => setAiWidgetOpen(true)}
                      className="px-6 py-3 bg-white hover:bg-blue-50 text-blue-700 font-extrabold text-xs rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-md hover:scale-105"
                    >
                      <span>Buka Asisten AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />

      {/* Floating AI Widget */}
      <FloatingAIWidget
        isOpen={aiWidgetOpen}
        onOpen={() => setAiWidgetOpen(true)}
        onClose={() => setAiWidgetOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
