import Image from "next/image";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Sparkles, ArrowLeft } from "lucide-react";

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
        
        {/* Left Side — Full Bleed Red & White Fluid Artwork Banner */}
        <div className="relative md:col-span-6 p-8 md:p-10 flex flex-col justify-between overflow-hidden min-h-[340px] md:min-h-[540px]">
          {/* Background image full frame v2 */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/auth-banner-v2.jpg"
              alt="Marvid Red Fluid Artwork"
              fill
              className="object-cover scale-105"
              priority
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/90 via-black/20 to-black/40" />
          </div>

          {/* Top Header: Logo */}
          <div className="relative z-10">
            <Logo size="md" />
          </div>

          {/* Bottom Callout Text */}
          <div className="relative z-10 space-y-3 pt-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/40 border border-red-500/50 text-white text-xs font-bold backdrop-blur-md shadow-md">
              <Sparkles className="h-3.5 w-3.5 text-red-400" />
              <span>Studio pour créateurs YouTube</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
              Pilotez la création de vos vidéos en un seul endroit.
            </h2>
            <p className="text-sm text-white/80 leading-relaxed font-medium drop-shadow">
              Centralisez vos idées, scripts, voix off, montages et miniatures avec une clarté absolue.
            </p>
          </div>
        </div>

        {/* Right Side — Auth Form + Back Link */}
        <div className="md:col-span-6 p-8 md:p-12 flex flex-col justify-between bg-[#0a0a14]/95 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/5">
          {/* Top: Back to Home Link */}
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors p-2 -ml-2 rounded-xl hover:bg-white/5 mb-6"
            >
              <ArrowLeft className="h-4 w-4 text-red-500" />
              <span>Retour à l'accueil</span>
            </Link>
          </div>

          {/* Center: Auth Children */}
          <div className="my-auto">
            {children}
          </div>

          {/* Bottom spacing balance */}
          <div className="h-4" />
        </div>

      </div>
    </div>
  );
}
