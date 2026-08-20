import Link from "next/link";
import { ArrowLeft, Users, Shield, Lightbulb, ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/landing-nav";
import { createClient } from "@/utils/supabase/server";

export default async function AProposPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="flex min-h-screen flex-col bg-[#08080c] text-[#ececf1] overflow-hidden">
      {/* Background glow effects */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[500px] bg-[radial-gradient(100%_100%_at_50%_0%,rgba(230,0,0,0.12),transparent_60%)] blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-1/3 -z-10 h-[600px] w-[600px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(230,0,0,0.04),transparent_60%)] blur-3xl" />

      <LandingNav isLoggedIn={isLoggedIn} />

      <main className="flex-1 pt-32 pb-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {/* Breadcrumb / Back button */}
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors p-2 -ml-2 rounded-xl hover:bg-white/5"
            >
              <ArrowLeft className="h-4 w-4 text-red-500" />
              <span>{"Retour à l'accueil"}</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center md:text-left mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3.5 py-1 text-xs font-medium text-red-400">
              <PlayCircle className="h-3.5 w-3.5" />
              {"À propos de Marvid"}
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl leading-[1.1]">
              {"Libérer la créativité des "}
              <span className="gradient-x bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                {"créateurs de contenu"}
              </span>
            </h1>
            <p className="mt-5 text-lg text-white/55 leading-relaxed">
              {"Nous concevons des outils simples et intuitifs pour aider les YouTubeurs et leurs équipes à structurer leur flux de production, de l'idée initiale à la mise en ligne finale."}
            </p>
          </div>

          {/* Grid Section - Story & Mission */}
          <div className="grid gap-8 md:grid-cols-12 mb-16">
            <div className="glass p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl md:col-span-7 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">{"Notre Histoire"}</h2>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  {"Créer du contenu sur YouTube est un métier formidable, mais la production d'une seule vidéo de 10 minutes cache souvent un véritable enfer logistique. Entre les scripts écrits dans des fichiers épars, les fichiers voix-off envoyés par messagerie, les miniatures en attente de validation et les deadlines manquées, la frustration s'installe vite."}
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  {"C'est pour résoudre ce problème que nous avons créé Marvid. Notre objectif est de regrouper tout le processus de création au même endroit, en remplaçant le désordre par un pipeline fluide et intuitif en 8 étapes clés."}
                </p>
              </div>
            </div>

            <div className="glass p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl md:col-span-5 flex flex-col justify-between bg-gradient-to-br from-red-950/20 to-transparent">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">{"Notre Mission"}</h2>
                <p className="text-white/60 text-sm leading-relaxed">
                  {"Permettre aux créateurs de se concentrer sur ce qu'ils font de mieux : créer du contenu exceptionnel. Nous pensons que la logistique et l'organisation ne devraient jamais être un frein à la créativité. Avec une structure claire, chaque membre de l'équipe sait exactement ce qu'il a à faire."}
                </p>
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3">
                <div className="flex -space-x-2">
                  <span className="h-8 w-8 rounded-full border border-black bg-zinc-800 text-[10px] flex items-center justify-center font-bold">{"M"}</span>
                  <span className="h-8 w-8 rounded-full border border-black bg-red-600 text-[10px] flex items-center justify-center font-bold">{"V"}</span>
                  <span className="h-8 w-8 rounded-full border border-black bg-zinc-700 text-[10px] flex items-center justify-center font-bold">{"D"}</span>
                </div>
                <span className="text-xs text-white/40">{"Utilisé par des créateurs passionnés"}</span>
              </div>
            </div>
          </div>

          {/* Three Values */}
          <div className="mb-20">
            <h2 className="text-2xl font-semibold text-white text-center mb-10">{"Nos Principes Fondateurs"}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="glass p-6 rounded-2xl border border-white/5">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{"Simplicité radicale"}</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  {"Pas de tableaux de bord complexes ou de configurations interminables. Marvid est pensé pour l'efficacité immédiate de votre studio."}
                </p>
              </div>

              <div className="glass p-6 rounded-2xl border border-white/5">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{"Esprit d'équipe"}</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  {"Faciliter l'attribution des tâches et la communication entre monteurs, script-writers, graphistes et le créateur principal."}
                </p>
              </div>

              <div className="glass p-6 rounded-2xl border border-white/5">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{"Qualité & Contrôle"}</h3>
                <p className="text-white/50 text-xs leading-relaxed">
                  {"Garantir que rien n'est publié sans validation. Un contrôle qualité rigoureux sur la miniature, le script et l'optimisation SEO."}
                </p>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-red-950/20 via-[#0f0f1a] to-red-950/10 p-8 md:p-12 text-center shadow-2xl">
            <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-60 w-60 bg-[radial-gradient(circle_at_center,rgba(230,0,0,0.15),transparent_70%)] blur-2xl" />
            
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{"Prêt à transformer votre production ?"}</h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-white/50 leading-relaxed">
              {"Rejoignez les créateurs qui ont choisi de structurer leur chaîne YouTube avec Marvid pour produire plus, mieux, et sans stress."}
            </p>
            
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href={isLoggedIn ? "/dashboard" : "/auth/signup"}>
                <Button className="h-11 rounded-full border-0 bg-[#e60000] px-8 text-sm font-medium text-white shadow-lg hover:bg-[#c20000] transition-colors">
                  {isLoggedIn ? "Accéder à mon espace" : "Créer mon compte gratuit"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="ghost" className="h-11 rounded-full border border-white/10 bg-white/5 px-8 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">
                  {"Contacter l'équipe"}
                </Button>
              </Link>
            </div>
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