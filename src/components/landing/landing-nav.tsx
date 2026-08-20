"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

export function LandingNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 sm:px-6"
    >
      <nav
        className={cn(
          "mt-4 flex w-full max-w-5xl items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 transition-all duration-300 sm:px-5",
          scrolled
            ? "border-white/[0.08] bg-[#0a0a12]/75 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            : "border-white/[0.06] bg-[#0a0a12]/35 backdrop-blur-md"
        )}
      >
        <Logo size="md" />

        <div className="hidden items-center gap-1 md:flex">
          <a
            href="#produit"
            className="rounded-lg px-3 py-2 text-sm text-white/55 transition-colors hover:text-white"
          >
            Produit
          </a>
          <a
            href="#equipe"
            className="rounded-lg px-3 py-2 text-sm text-white/55 transition-colors hover:text-white"
          >
            Équipe
          </a>
          <a
            href="#tarifs"
            className="rounded-lg px-3 py-2 text-sm text-white/55 transition-colors hover:text-white"
          >
            Tarifs
          </a>
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button
                size="sm"
                className="rounded-lg border-0 bg-[#e60000] font-medium text-white hover:bg-[#c20000]"
              >
                <LayoutGrid className="mr-1.5 h-4 w-4" />
                Mon espace
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-lg font-medium text-white/70 hover:bg-white/[0.06] hover:text-white"
                >
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="rounded-lg border-0 bg-[#e60000] font-medium text-white hover:bg-[#c20000]"
                >
                  Commencer
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
