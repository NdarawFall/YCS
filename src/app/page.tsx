import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, Zap, Users, ShieldCheck, LayoutDashboard } from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { FadeInWrapper } from "@/components/ui/fade-in-wrapper";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const FEATURES = [
  {
    title: "Pipeline en 8 étapes",
    body: "Suivez chaque vidéo de l'idée à la publication avec précision.",
    icon: Zap,
    className: "md:col-span-2",
  },
  {
    title: "Collaboration Équipe",
    body: "Assignez des tâches claires à vos monteurs et graphistes.",
    icon: Users,
    className: "md:col-span-1",
  },
  {
    title: "Contrôle Qualité",
    body: "Validation obligatoire avant chaque mise en ligne.",
    icon: ShieldCheck,
    className: "md:col-span-1",
  },
  {
    title: "Tableau de Bord",
    body: "Vue d'ensemble totale sur vos chaînes.",
    icon: LayoutDashboard,
    className: "md:col-span-2",
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-[#08080c] text-white">
      <BackgroundGradient />
      <LandingNav isLoggedIn={isLoggedIn} />

      <main className="relative z-10">
        <Hero isLoggedIn={isLoggedIn} />

        {/* Features Bento Grid */}
        <section className="py-24 px-5 max-w-6xl mx-auto">
          <FadeInWrapper>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURES.map((feature, i) => (
                <div 
                  key={feature.title} 
                  className={`group p-8 rounded-3xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 ${feature.className}`}
                >
                  <feature.icon className="h-10 w-10 text-red-500 mb-6" />
                  <h3 className="text-2xl font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-white/60 text-base">{feature.body}</p>
                </div>
              ))}
            </div>
          </FadeInWrapper>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-5">
          <FadeInWrapper>
            <div className="max-w-4xl mx-auto p-16 rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-950/20 to-black text-center">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Prêt à dominer YouTube ?</h2>
              <p className="mt-6 text-xl text-white/60">Rejoignez Marvid et simplifiez enfin votre production.</p>
              <Link href={isLoggedIn ? "/dashboard" : "/auth/signup"}>
                <Button size="lg" className="mt-10 h-14 px-10 text-base bg-white text-black hover:bg-white/90 rounded-full">
                  {isLoggedIn ? "Accéder à mon espace" : "Créer mon compte"}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </FadeInWrapper>
        </section>
      </main>

      <footer className="py-12 text-center text-sm text-white/40">
        © {new Date().getFullYear()} Marvid. Tous droits réservés.
      </footer>
    </div>
  );
}
