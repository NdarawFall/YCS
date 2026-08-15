import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Sparkles, Youtube, Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 md:p-8 relative bg-[#080810] text-[#f0f0f5] overflow-hidden">
      {/* Background glow ambiance */}
      <div className="fixed inset-0 pointer-events-none yt-glow z-0" />
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden glass border border-white/10 shadow-2xl shadow-black/90">
        
        {/* Left Side — Gradient Artwork Banner */}
        <div className="relative md:col-span-6 p-8 md:p-10 flex flex-col justify-between overflow-hidden min-h-[320px] md:min-h-[520px]">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/auth-banner.jpg"
              alt="YCS Studio Mesh"
              fill
              className="object-cover opacity-80 scale-105"
              priority
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090912] via-transparent to-[#090912]/50" />
          </div>

          {/* Top Logo */}
          <div className="relative z-10">
            <Logo size="md" />
          </div>

          {/* Bottom Callout Text */}
          <div className="relative z-10 space-y-3 pt-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Studio pour créateurs YouTube</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight">
              Pilotez la création de vos vidéos en un seul endroit.
            </h2>
            <p className="text-sm text-white/60 leading-relaxed font-medium">
              Centralisez vos idées, scripts, voix off, montages et miniatures avec une clarté absolue.
            </p>
          </div>
        </div>

        {/* Right Side — Auth Form */}
        <div className="md:col-span-6 p-8 md:p-12 flex flex-col justify-center bg-[#0d0d18]/90 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/5">
          {children}
        </div>

      </div>
    </div>
  );
}
