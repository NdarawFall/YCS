import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, ArrowRight, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/landing-nav";
import { createClient } from "@/utils/supabase/server";

export default async function BlogPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="flex min-h-screen flex-col bg-[#08080c] text-[#ececf1] overflow-hidden">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(100%_100%_at_50%_0%,rgba(230,0,0,0.12),transparent_60%)] blur-3xl" />
      <div className="pointer-events-none absolute -left-40 top-1/2 -z-10 h-[600px] w-[600px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(230,0,0,0.03),transparent_60%)] blur-3xl" />

      <LandingNav isLoggedIn={isLoggedIn} />

      <main className="flex-1 pt-32 pb-24 flex items-center justify-center">
        <div className="mx-auto max-w-2xl px-5 sm:px-8 text-center">
          {/* Breadcrumb / Back button */}
          <div className="mb-8 flex justify-center md:justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors p-2 -ml-2 rounded-xl hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4 text-red-500" />
              <span>{"Retour à l'accueil"}</span>
            </Link>
          </div>

          {/* Under Construction Container */}
          <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative">
            {/* Glowing accent corner */}
            <div className="absolute top-0 right-0 h-24 w-24 bg-red-600/10 rounded-bl-full blur-xl" />
            
            {/* Main Icon */}
            <div className="mx-auto h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6 relative">
              <BookOpen className="h-8 w-8" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            </div>

            {/* Header text */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[11px] font-medium text-red-400 mb-4">
              <Clock className="h-3 w-3" />
              {"En cours de rédaction"}
            </span>
            
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl tracking-[-0.02em]">
              {"Le Blog Marvid arrive bientôt"}
            </h1>
            
            <p className="mt-4 text-sm text-white/55 leading-relaxed max-w-lg mx-auto">
              {"Nous préparons une série d'articles exclusifs pour vous aider à propulser votre chaîne. Au programme : techniques de script pour capter l'attention, secrets de montage dynamiques, optimisation SEO de l'algorithme YouTube et conseils d'organisation d'équipe."}
            </p>

            {/* Divider */}
            <div className="my-8 border-t border-white/[0.06]" />

            {/* Newsletter Sign Up Mockup */}
            <div className="space-y-4 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white/80">
                <Sparkles className="h-3.5 w-3.5 text-red-400" />
                <span>{"Soyez prévenu dès la sortie du premier article"}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 h-11 px-4 rounded-full text-sm text-white placeholder:text-white/25 bg-white/5 border border-white/10 focus:outline-none focus:border-red-500 font-medium"
                />
                <Button className="h-11 rounded-full border-0 bg-[#e60000] px-6 text-xs font-semibold text-white shadow-md hover:bg-[#c20000] transition-colors whitespace-nowrap">
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  {"M'abonner"}
                </Button>
              </div>
              <p className="text-[10px] text-white/30">
                {"Pas de spam. Vous recevrez uniquement une notification et nos meilleurs conseils de production."}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
              <span>{"Retourner à l'accueil pour explorer le pipeline"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer minimaliste */}
      <footer className="border-t border-white/[0.06] py-8 text-center text-xs text-white/30 bg-[#06060a]">
        <div className="mx-auto max-w-4xl px-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Marvid. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">{"Mentions Légales"}</Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">{"Confidentialité"}</Link>
            <Link href="/contact" className="hover:text-white transition-colors">{"Contact"}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}