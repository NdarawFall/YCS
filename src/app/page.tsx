import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/utils/supabase/server";
import { User, Users, ArrowRight } from "lucide-react";
import { LandingNav } from "@/components/landing/landing-nav";
import { Hero } from "@/components/landing/hero";
import { StageMarquee } from "@/components/landing/stage-marquee";
import { Reveal } from "@/components/landing/reveal";
import { SpotlightCard } from "@/components/landing/spotlight-card";
import { PricingCards } from "@/components/landing/pricing-cards";
import { FadeInWrapper } from "@/components/ui/fade-in-wrapper";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const FEATURES = [
  {
    title: "Un pipeline en huit étapes",
    body:
      "Chaque vidéo avance de l'idée à la publication. Vous voyez en un coup d'œil où elle est bloquée et ce qui reste à faire.",
  },
  {
    title: "Un responsable par étape",
    body:
      "Assignez le script, le montage ou la miniature à un collaborateur. Chacun sait ce qu'il a à livrer, vous savez qui attend quoi.",
  },
  {
    title: "Validation avant publication",
    body:
      "Les miniatures et les métadonnées passent par une relecture. Rien ne part sur la chaîne sans votre accord.",
  },
];

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-red-400/80">
      {children}
    </p>
  );
}

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="flex min-h-screen flex-col bg-[#08080c] text-[#ececf1] relative">
      <BackgroundGradient />
      <LandingNav isLoggedIn={isLoggedIn} />

      <main className="flex-1">
        <Hero isLoggedIn={isLoggedIn} />

        <FadeInWrapper>
          <StageMarquee />
        </FadeInWrapper>

        {/* Produit */}
        <section id="produit" className="border-b border-white/[0.06]">
          <FadeInWrapper className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
            <Reveal>
              <div className="max-w-2xl">
                <Eyebrow>Produit</Eyebrow>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.015em] text-white sm:text-4xl">
                  Un endroit unique pour suivre chaque vidéo
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-white/55">
                  Huit étapes, un responsable par étape, une validation avant
                  mise en ligne. Rien de plus.
                </p>
              </div>
            </Reveal>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {FEATURES.map((feature, i) => (
                <Reveal key={feature.title} delay={i * 0.12}>
                  <SpotlightCard className="p-7">
                    <h3 className="text-base font-medium text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/50">
                      {feature.body}
                    </p>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </FadeInWrapper>
        </section>

        {/* Solo / Équipe */}
        <section id="equipe" className="border-b border-white/[0.06]">
          <FadeInWrapper className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
            <Reveal>
              <div className="max-w-2xl">
                <Eyebrow>Équipe</Eyebrow>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.015em] text-white sm:text-4xl">
                  Seul ou en équipe, à votre rythme
                </h2>
              </div>
            </Reveal>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <Reveal>
                <SpotlightCard className="h-full p-7">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
                      <Image
                        src="/avatar-boy.jpg"
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <User className="h-3.5 w-3.5" />
                        Solo
                      </div>
                      <h3 className="mt-0.5 text-base font-medium text-white">
                        Vous produisez seul
                      </h3>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-white/50">
                    Le pipeline vous sert de mémoire. Vous reprenez une vidéo
                    trois semaines plus tard et vous retrouvez exactement où
                    vous l'aviez laissée.
                  </p>
                </SpotlightCard>
              </Reveal>

              <Reveal delay={0.12}>
                <SpotlightCard className="h-full p-7">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
                      <Image
                        src="/avatar-team.jpg"
                        alt=""
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-white/40">
                        <Users className="h-3.5 w-3.5" />
                        Équipe
                      </div>
                      <h3 className="mt-0.5 text-base font-medium text-white">
                        Vous déléguez
                      </h3>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-relaxed text-white/50">
                    Monteur, voix off, graphiste : chacun reçoit ses étapes et
                    rien d'autre. Vous suivez l'avancement sans avoir à relancer
                    par message.
                  </p>
                </SpotlightCard>
              </Reveal>
            </div>

            <Reveal>
              <p className="mt-10 text-sm text-white/35">
                Marvid s'utilise sur ordinateur. Le site reste consultable sur
                mobile pour vous inscrire, mais la production se fait sur grand
                écran.
              </p>
            </Reveal>
          </FadeInWrapper>
        </section>

        {/* Tarifs */}
        <section id="tarifs" className="border-b border-white/[0.06]">
          <FadeInWrapper className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
            <Reveal>
              <div className="max-w-2xl">
                <Eyebrow>Tarifs</Eyebrow>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.015em] text-white sm:text-4xl">
                  Tarifs
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-white/55">
                  Commencez gratuitement. Changez de formule quand vos chaînes
                  grandissent.
                </p>
              </div>
            </Reveal>

            <PricingCards />
          </FadeInWrapper>
        </section>

        {/* CTA final */}
        <section>
          <FadeInWrapper className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-24">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d0d13]/80 px-8 py-16 text-center backdrop-blur-xl sm:px-16">
                <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(230,0,0,0.25),transparent)] blur-2xl" />
                <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />

                <div className="relative">
                  <Eyebrow>Commencer</Eyebrow>
                  <h2 className="mx-auto mt-3 max-w-2xl text-balance text-3xl font-semibold tracking-[-0.015em] text-white sm:text-4xl">
                    Prêt à organiser votre chaîne ?
                  </h2>
                  <p className="mt-3 text-white/50">
                    Créez votre premier espace de production en moins d'une
                    minute.
                  </p>
                  <Link href="/auth/signup" className="mt-9 inline-block">
                    <Button
                      size="lg"
                      className="h-12 rounded-full border-0 bg-[#e60000] px-8 text-[15px] font-medium text-white shadow-[0_8px_32px_rgba(230,0,0,0.35)] hover:bg-[#c20000]"
                    >
                      Commencer gratuitement
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Reveal>
          </FadeInWrapper>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#06060a]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 px-5 py-9 sm:flex-row sm:px-8">
          <div className="flex items-center gap-3">
            <Logo size="sm" withLink={false} />
            <span className="text-xs text-white/30">
              © {new Date().getFullYear()} Marvid
            </span>
          </div>
          <div className="flex gap-6 text-xs text-white/40">
            <Link href="/mentions-legales" className="transition-colors hover:text-white">
              Mentions légales
            </Link>
            <Link href="/confidentialite" className="transition-colors hover:text-white">
              Confidentialité
            </Link>
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
