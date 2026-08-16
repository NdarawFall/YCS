"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Monitor, Laptop, ArrowLeft, Copy, Check, Sparkles } from "lucide-react";
import { useState } from "react";

export default function DesktopOnlyPage() {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f5] flex flex-col items-center justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Background ambiance glow */}
      <div className="fixed inset-0 pointer-events-none yt-glow z-0" />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top Header */}
      <header className="w-full max-w-xl flex items-center justify-between relative z-10 py-2">
        <Logo size="md" />
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-white/60 hover:text-white rounded-xl text-xs">
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Accueil
          </Button>
        </Link>
      </header>

      {/* Main Message Card */}
      <main className="w-full max-w-md my-auto relative z-10 py-6">
        <div className="glass p-7 sm:p-9 rounded-3xl border border-white/10 shadow-2xl text-center space-y-6 relative overflow-hidden">
          {/* Top glowing ambient circle */}
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Monitor Graphic */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-600/15 border border-red-500/30 text-red-500 shadow-xl shadow-red-600/20">
            <Monitor className="h-10 w-10 text-red-500 animate-pulse" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-950/60 border border-red-500/40 text-red-400 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-red-500" />
            <span>YouTube Creator Studio</span>
          </div>

          {/* Title & Explanation */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Conçu pour Grand Écran
            </h1>
            <p className="text-sm text-white/60 leading-relaxed font-medium">
              Pour une expérience optimale et un confort de production maximal, YouTube Creator Studio est conçu pour être utilisé sur ordinateur (<strong className="text-white font-semibold">PC ou Mac</strong>).
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col gap-3">
            <Button
              onClick={copyLink}
              variant="outline"
              className="w-full h-12 rounded-xl border-white/10 hover:bg-white/8 text-white font-semibold text-sm"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-emerald-400" /> Lien copié !
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4 text-red-500" /> Copier le lien pour PC
                </>
              )}
            </Button>
            <Link href="/" className="w-full">
              <Button className="w-full h-12 rounded-xl font-bold text-white border-0 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-600/25">
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center text-xs text-white/30 relative z-10 py-2 font-mono">
        © {new Date().getFullYear()} YouTube Creator Studio – Grand écran recommandé
      </footer>
    </div>
  );
}
