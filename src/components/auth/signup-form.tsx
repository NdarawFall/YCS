"use client";

import { signInWithGoogle } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function SignupForm() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/15 border border-red-500/20 text-red-500 mb-4">
          <Sparkles className="h-5 w-5 text-red-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Rejoindre YCS Studio
        </h1>
        <p className="text-sm text-white/50 leading-relaxed">
          Créez votre espace créateur en 1 clic avec votre compte Google.
        </p>
      </div>

      {/* Google Auth Form */}
      <div className="pt-2">
        <form action={signInWithGoogle}>
          <Button 
            type="submit" 
            className="w-full h-13 rounded-2xl bg-white hover:bg-neutral-100 text-black font-bold text-base shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 border-0 cursor-pointer"
            style={{ boxShadow: '0 8px 30px rgba(255,255,255,0.12)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            S'inscrire avec Google
          </Button>
        </form>
      </div>

      {/* Trust message */}
      <div className="flex items-center gap-2 pt-2 text-xs text-white/40 justify-center">
        <ShieldCheck className="h-4 w-4 text-red-500/80 shrink-0" />
        <span>Accès instantané et 100% sécurisé via Google</span>
      </div>

      {/* Navigation link to login */}
      <div className="pt-2 text-center border-t border-white/5">
        <p className="text-xs text-white/50">
          Vous avez déjà un compte ?{" "}
          <Link href="/auth/login" className="text-red-400 font-bold hover:text-red-300 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
