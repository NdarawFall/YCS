import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/utils/supabase/server";
import { Check, LayoutGrid, Users, User, ArrowRight } from "lucide-react";

const STAGES = [
  "Idée",
  "Script",
  "Voix off",
  "Montage",
  "Musique",
  "Miniature",
  "SEO",
  "Publication",
];

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

const PLANS = [
  {
    name: "Gratuit",
    price: "0",
    tagline: "Pour structurer une première chaîne.",
    features: [
      "1 chaîne",
      "3 vidéos en production",
      "Pipeline complet en 8 étapes",
      "Mode solo",
    ],
    cta: "Créer un compte",
    highlight: false,
  },
  {
    name: "Créateur",
    price: "3",
    tagline: "Pour publier régulièrement, seul.",
    features: [
      "2 chaînes",
      "15 vidéos en production",
      "Calendrier éditorial",
      "Échéances et rappels",
      "Historique conservé",
    ],
    cta: "Choisir Créateur",
    highlight: true,
  },
  {
    name: "Team",
    price: "10",
    tagline: "Pour déléguer à une équipe.",
    features: [
      "5 chaînes",
      "40 vidéos en production",
      "5 collaborateurs",
      "Assignation par étape",
      "Validation et commentaires",
    ],
    cta: "Choisir Team",
    highlight: false,
  },
];

export default async function LandingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="flex min-h-screen flex-col bg-[#08080c] text-[#ececf1]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#08080c]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Logo size="md" />

          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              className="hidden rounded-md px-3 py-2 text-sm text-white/55 transition-colors hover:text-white md:inline-flex"
              href="#produit"
            >
              Produit
            </Link>
            <Link
              className="hidden rounded-md px-3 py-2 text-sm text-white/55 transition-colors hover:text-white md:inline-flex"
              href="#tarifs"
            >
              Tarifs
            </Link>

            {isLoggedIn ? (
              <Link href="/dashboard" className="ml-2">
                <Button size="sm" className="rounded-lg border-0 bg-[#e60000] font-medium text-white hover:bg-[#c20000]">
                  <LayoutGrid className="mr-1.5 h-4 w-4" />
                  Mon espace
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-lg font-medium text-white/70 hover:bg-white/[0.06] hover:text-white"
                  >
                    Se connecter
                  </Button>
                </Link>
                <Link href="/auth/signup" className="ml-1 hidden sm:inline-flex">
                  <Button size="sm" className="rounded-lg border-0 bg-[#e60000] font-medium text-white hover:bg-[#c20000]">
                    Commencer
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-white/[0.06]">
          <div className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-8 md:grid-cols-12 md:py-24">
            <div className="md:col-span-7">
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl lg:text-[3.5rem]">
                La production de vos vidéos YouTube, du script à la publication
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/55">
                Marvid remplace les listes éparpillées et les messages perdus par un
                suivi unique. Vous savez toujours où en est chaque vidéo et qui doit
                intervenir ensuite.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href={isLoggedIn ? "/dashboard" : "/auth/signup"}>
                  <Button
                    size="lg"
                    className="h-12 w-full rounded-lg border-0 bg-[#e60000] px-7 text-[15px] font-medium text-white hover:bg-[#c20000] sm:w-auto"
                  >
                    {isLoggedIn ? "Accéder à mon espace" : "Commencer gratuitement"}
                  </Button>
                </Link>
                <Link href="#produit">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 w-full rounded-lg border-white/[0.12] bg-transparent px-7 text-[15px] font-medium text-white/75 hover:bg-white/[0.04] hover:text-white sm:w-auto"
                  >
                    Voir comment ça marche
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <p className="mt-5 text-sm text-white/35">
                Gratuit pour une chaîne. Aucune carte bancaire demandée.
              </p>
            </div>

            {/* Aperçu du pipeline — contenu produit réel, pas de décor */}
            <div className="md:col-span-5">
              <div className="rounded-xl border border-white/[0.08] bg-[#0d0d13] p-5">
                <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-4">
                  <span className="text-sm font-medium text-white">
                    Comment j'ai relancé ma chaîne
                  </span>
                  <span className="font-mono text-xs text-white/40">5/8</span>
                </div>

                <ol className="mt-4 space-y-1">
                  {STAGES.map((stage, i) => {
                    const done = i < 5;
                    const current = i === 5;

                    return (
                      <li
                        key={stage}
                        className={`flex items-center gap-3 rounded-md px-2 py-2 text-sm ${
                          current ? "bg-white/[0.04]" : ""
                        }`}
                      >
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                            done
                              ? "border-transparent bg-[#e60000] text-white"
                              : current
                                ? "border-white/40 text-white/70"
                                : "border-white/[0.12] text-white/25"
                          }`}
                        >
                          {done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                        </span>
                        <span className={done ? "text-white/45" : current ? "text-white" : "text-white/30"}>
                          {stage}
                        </span>
                        {current && (
                          <span className="ml-auto text-xs text-white/40">en cours</span>
                        )}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* Produit */}
        <section id="produit" className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-[-0.015em] text-white sm:text-4xl">
                Un endroit unique pour suivre chaque vidéo
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/55">
                Huit étapes, un responsable par étape, une validation avant mise en
                ligne. Rien de plus.
              </p>
            </div>

            <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.06] md:grid-cols-3">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="bg-[#0d0d13] p-7">
                  <h3 className="text-base font-medium text-white">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/50">{feature.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solo / Équipe */}
        <section className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-white/[0.08] bg-[#0d0d13] p-7">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                    <Image src="/avatar-boy.jpg" alt="" fill className="object-cover" />
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
                  Le pipeline vous sert de mémoire. Vous reprenez une vidéo trois
                  semaines plus tard et vous retrouvez exactement où vous l'aviez
                  laissée.
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-[#0d0d13] p-7">
                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-black/40">
                    <Image src="/avatar-team.jpg" alt="" fill className="object-cover" />
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
                  Monteur, voix off, graphiste : chacun reçoit ses étapes et rien
                  d'autre. Vous suivez l'avancement sans avoir à relancer par message.
                </p>
              </div>
            </div>

            <p className="mt-10 text-sm text-white/35">
              Marvid s'utilise sur ordinateur. Le site reste consultable sur mobile
              pour vous inscrire, mais la production se fait sur grand écran.
            </p>
          </div>
        </section>

        {/* Tarifs */}
        <section id="tarifs" className="border-b border-white/[0.06]">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-[-0.015em] text-white sm:text-4xl">
                Tarifs
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/55">
                Commencez gratuitement. Changez de formule quand vos chaînes grandissent.
              </p>
            </div>

            <div className="mt-14 grid gap-5 md:grid-cols-3">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className={`flex flex-col rounded-xl border bg-[#0d0d13] p-7 ${
                    plan.highlight ? "border-[#e60000]/60" : "border-white/[0.08]"
                  }`}
                >
                  <div className="flex h-6 items-center justify-between">
                    <h3 className="text-base font-medium text-white">{plan.name}</h3>
                    {plan.highlight && (
                      <span className="text-xs text-[#ff4d4d]">Le plus choisi</span>
                    )}
                  </div>

                  <div className="mt-5 flex items-baseline gap-1.5">
                    <span className="text-4xl font-semibold tracking-tight text-white">
                      {plan.price}&nbsp;€
                    </span>
                    <span className="text-sm text-white/40">/ mois</span>
                  </div>

                  <p className="mt-3 text-sm text-white/45">{plan.tagline}</p>

                  <ul className="mt-7 flex-1 space-y-3 border-t border-white/[0.06] pt-7">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2.5 text-sm text-white/65">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-white/30" strokeWidth={2.5} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href="/auth/signup" className="mt-8">
                    <Button
                      className={
                        plan.highlight
                          ? "h-11 w-full rounded-lg border-0 bg-[#e60000] font-medium text-white hover:bg-[#c20000]"
                          : "h-11 w-full rounded-lg border border-white/[0.12] bg-transparent font-medium text-white/80 hover:bg-white/[0.05] hover:text-white"
                      }
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section>
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <div className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-[-0.015em] text-white sm:text-3xl">
                  Prêt à organiser votre chaîne ?
                </h2>
                <p className="mt-2.5 text-white/50">
                  Créez votre premier espace de production en moins d'une minute.
                </p>
              </div>
              <Link href="/auth/signup" className="shrink-0">
                <Button
                  size="lg"
                  className="h-12 rounded-lg border-0 bg-[#e60000] px-8 text-[15px] font-medium text-white hover:bg-[#c20000]"
                >
                  Commencer gratuitement
                </Button>
              </Link>
            </div>
          </div>
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
