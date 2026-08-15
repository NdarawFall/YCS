import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YCS – YouTube Creator Studio",
  description: "Gérez votre chaîne YouTube comme un pro. Pipeline de production, gestion d'équipe, upload HD.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} dark antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-[#080810] text-[#f0f0f5] relative overflow-x-hidden">

        {/* Big top glow */}
        <div className="fixed inset-0 pointer-events-none yt-glow z-0" />

        {/* Dot grid pattern */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)',
          }}
        />

        {/* Subtle bottom glow */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
          style={{ background: 'radial-gradient(ellipse at bottom, rgba(120,0,0,0.08) 0%, transparent 70%)' }}
        />

        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
