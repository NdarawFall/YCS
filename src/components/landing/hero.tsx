"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative flex flex-col items-center justify-center pt-32 pb-24 text-center overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(230,0,0,0.15),transparent_70%)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl px-5"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-xs font-semibold text-red-400">
          <Sparkles className="h-3.5 w-3.5" />
          Le moteur de votre succès YouTube
        </span>
        
        <h1 className="mt-8 text-5xl md:text-7xl font-bold tracking-tighter text-white leading-[1.1]">
          Produisez vos vidéos <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">comme des pros</span>
        </h1>
        
        <p className="mt-8 text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          Marvid structure votre pipeline de production de A à Z. <br className="hidden md:block" /> 
          Ne perdez plus jamais une idée, ni le contrôle de votre équipe.
        </p>
        
        <div className="mt-12 flex items-center justify-center gap-4">
          <Link href={isLoggedIn ? "/dashboard" : "/auth/signup"}>
            <Button size="lg" className="h-14 px-10 text-base font-semibold bg-red-600 hover:bg-red-700 shadow-xl shadow-red-950/20 rounded-full">
              {isLoggedIn ? "Accéder au dashboard" : "Commencer gratuitement"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

