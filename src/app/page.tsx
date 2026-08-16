import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/ui/logo";
import { createClient } from "@/utils/supabase/server";
import {
  CheckCircle2,
  Users,
  Sparkles,
  Play,
  Flame,
  Layers,
  ArrowRight,
  TrendingUp,
  LayoutGrid,
  Video,
  User,
  Zap,
  Film,
  Monitor,
  Laptop
} from "lucide-react";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="flex flex-col min-h-screen bg-[#080810] text-[#f0f0f5]">
      {/* Navbar */}
      <header className="px-4 sm:px-6 lg:px-14 h-16 flex items-center justify-between border-b border-white/5 glass sticky top-0 z-50">
        <Logo size="md" />

        <nav className="flex gap-2 sm:gap-4 items-center">
          <Link className="hidden md:inline-flex text-sm font-medium text-white/50 hover:text-white transition-colors" href="#features">
            Fonctionnalités
          </Link>
          <Link className="hidden md:inline-flex text-sm font-medium text-white/50 hover:text-white transition-colors" href="#pricing">
            Tarifs
          </Link>
          <div className="h-4 w-px bg-white/10 hidden md:block" />
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="sm" className="font-bold text-white border-0 rounded-xl text-xs sm:text-sm transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)', boxShadow: '0 4px 20px rgba(255,0,0,0.3)' }}
              >
                <LayoutGrid className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Mon Espace
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hover:bg-white/8 text-white/80 hover:text-white font-medium rounded-xl text-xs sm:text-sm px-2.5 sm:px-3">
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="font-semibold text-white border-0 rounded-xl text-xs sm:text-sm px-3 sm:px-4 transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)', boxShadow: '0 4px 20px rgba(255,0,0,0.25)' }}
                >
                  Commencer
                </Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section — Tight Padding, High Impact */}
        <section className="w-full pt-8 pb-14 md:pt-14 md:pb-20 flex flex-col items-center justify-center text-center px-4 md:px-6 relative overflow-hidden">
          <div className="relative z-10 max-w-[900px] space-y-6 flex flex-col items-center">
            
            {/* YouTube Creator Studio Main Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-950/40 px-4 py-1.5 text-xs font-bold text-red-400 backdrop-blur-md shadow-lg shadow-red-500/10">
              <Sparkles className="h-3.5 w-3.5 text-red-500 animate-pulse" />
              <span>YouTube Creator Studio (YCS)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl md:text-7xl leading-[1.1]">
              Gérez l'ensemble de vos <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-red-100 to-red-500 bg-clip-text text-transparent">
                chaînes & vidéos YouTube
              </span>
            </h1>

            {/* Subtext */}
            <p className="mx-auto max-w-[660px] text-white/60 text-base md:text-lg leading-relaxed font-medium">
              Une plateforme moderne conçue pour les créateurs. Suivez la production de vos vidéos de l'idée initiale jusqu'à la publication officielle.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 w-full max-w-md sm:max-w-none">
              {isLoggedIn ? (
                <>
                  <Link href="/dashboard">
                    <Button size="lg" className="h-13 px-8 text-base font-bold text-white border-0 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)', boxShadow: '0 12px 40px rgba(255,0,0,0.35)' }}
                    >
                      <LayoutGrid className="mr-2 h-5 w-5" />
                      Accéder à mon espace
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="lg" className="h-13 px-8 text-base font-medium rounded-xl"
                      style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)' }}
                    >
                      Voir les fonctionnalités
                      <ArrowRight className="ml-2 h-4 w-4 text-red-500" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signup">
                    <Button size="lg" className="h-13 px-8 text-base font-bold text-white border-0 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)', boxShadow: '0 12px 40px rgba(255,0,0,0.35)' }}
                    >
                      <Play className="mr-2 h-4 w-4 fill-current" />
                      Créer mon Studio Gratuit
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button variant="outline" size="lg" className="h-13 px-8 text-base font-medium rounded-xl"
                      style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)' }}
                    >
                      Découvrir l'outil
                      <ArrowRight className="ml-2 h-4 w-4 text-red-500" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Stats / Trust Badges */}
            <div className="pt-6 grid grid-cols-3 gap-6 max-w-lg mx-auto border-t border-white/10 text-center w-full">
              <div>
                <div className="text-xl font-black text-white">8 Étapes</div>
                <div className="text-xs text-white/40">Workflow guidé</div>
              </div>
              <div>
                <div className="text-xl font-black text-red-500">100%</div>
                <div className="text-xs text-white/40">Organisation claire</div>
              </div>
              <div>
                <div className="text-xl font-black text-white">Solo & Équipe</div>
                <div className="text-xs text-white/40">Pour tous les formats</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Showcase Creators (Solo + 3-People Team Avatar) */}
        <section className="w-full py-14 bg-[#0a0a14]/60 border-y border-white/5">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <div className="text-center mb-10 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 tracking-wider uppercase">
                <Sparkles className="h-4 w-4" /> YouTube Creator Studio
              </div>
              <h2 className="text-3xl font-extrabold text-white">Une organisation sur-mesure</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Solo Creator Card */}
              <div className="glass p-7 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
                <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 border-red-500/40 shadow-xl">
                  <Image
                    src="/avatar-boy.jpg"
                    alt="Créateur Solo YouTube"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    <User className="h-3 w-3" /> Mode Solo
                  </div>
                  <h3 className="text-lg font-bold text-white">Créateur Autonome</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Organisez vos projets vidéo de manière autonome, validez vos idées et avancez à votre propre rythme.
                  </p>
                </div>
              </div>

              {/* Team Creator Card (3 People Team Avatar) */}
              <div className="glass p-7 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
                <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-xl bg-slate-900">
                  <Image
                    src="/avatar-team.jpg"
                    alt="Équipe de créateurs YouTube"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Users className="h-3 w-3" /> Mode Équipe
                  </div>
                  <h3 className="text-lg font-bold text-white">Studio Collaboratif</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Distribuez le travail entre monteurs, voix off et miniamakers avec un suivi précis à chaque étape.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-14">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 tracking-wider uppercase">
                <Flame className="h-4 w-4" /> Fonctionnalités Clés
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Tout pour gérer vos chaînes YouTube
              </h2>
              <p className="max-w-[600px] text-white/50 text-base">
                Un espace unifié pour concevoir, valider et publier vos vidéos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <Card className="glass border-white/5 shadow-2xl hover:border-red-600/50 transition-all duration-300 hover:-translate-y-2 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-colors duration-500" />
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/15 text-red-500 mb-2 ring-1 ring-red-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Video className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-red-400 transition-colors">Pipeline 8 Étapes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Idée, Script, Voix off, Montage, Musique, Miniature, SEO et Publication. Validez chaque phase étape par étape.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass border-white/5 shadow-2xl hover:border-red-600/50 transition-all duration-300 hover:-translate-y-2 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-colors duration-500" />
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/15 text-red-500 mb-2 ring-1 ring-red-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-red-400 transition-colors">Attribution des Rôles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Assignez des collaborateurs précis (Monteur, Voix off, Miniamaker) à chaque étape de votre projet vidéo.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass border-white/5 shadow-2xl hover:border-red-600/50 transition-all duration-300 hover:-translate-y-2 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-colors duration-500" />
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/15 text-red-500 mb-2 ring-1 ring-red-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Layers className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-red-400 transition-colors">Validation des Visuels</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Prévisualisez et validez les propositions de miniatures directement depuis la fiche de chaque vidéo.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Section Grand Écran / Ordinateur */}
        <section className="w-full py-16 bg-gradient-to-b from-[#0a0a14]/80 to-[#080810] border-t border-white/5">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-24 -right-24 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
                <div className="md:col-span-7 space-y-4 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3.5 py-1 text-xs font-bold text-red-400">
                    <Monitor className="h-3.5 w-3.5 text-red-500" />
                    <span>Expérience Studio Optimisée</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                    Une interface pensée pour <br className="hidden sm:inline" />
                    <span className="bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">les grands écrans & ordinateurs</span>
                  </h2>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed">
                    Pour vous offrir une expérience optimale et un confort de production maximal, YouTube Creator Studio est conçu pour être utilisé sur PC ou Mac.
                  </p>
                  <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3 text-xs font-semibold text-white/80">
                    <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                      <CheckCircle2 className="h-4 w-4 text-red-500" /> Ordinateur (PC / Mac)
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                      <CheckCircle2 className="h-4 w-4 text-red-500" /> Productivité Maximale
                    </span>
                  </div>
                </div>

                <div className="md:col-span-5 flex justify-center">
                  <div className="p-6 rounded-2xl bg-[#0f0f18] border border-white/10 text-center space-y-3 shadow-2xl max-w-sm w-full">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600/15 text-red-500 mx-auto border border-red-500/20">
                      <Laptop className="h-7 w-7 text-red-500" />
                    </div>
                    <div className="font-bold text-white text-base">Utilisation recommandée</div>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Découvrez le site sur mobile pour vous informer et vous inscrire, puis connectez-vous sur votre ordinateur pour produire vos vidéos.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="w-full py-16 md:py-24 bg-[#0a0a14]/60 border-t border-white/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-3 text-center mb-14">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 tracking-wider uppercase">
                <TrendingUp className="h-4 w-4" /> Tarification Transparente
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
                Formules d'abonnement
              </h2>
              <p className="max-w-[600px] text-white/50 text-base">
                Commencez gratuitement, adaptez votre plan au fil de la croissance de vos chaînes.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              {/* Gratuit */}
              <Card className="flex flex-col relative overflow-hidden glass border-white/10 rounded-3xl p-2">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-white">Débutant (Gratuit)</CardTitle>
                  <div className="mt-4 flex items-baseline justify-center text-5xl font-black text-white">
                    0€
                    <span className="ml-1 text-lg font-medium text-white/40">/mois</span>
                  </div>
                  <CardDescription className="mt-3 text-white/50">Pour structurer et lancer sa première chaîne YouTube.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 px-6">
                  <ul className="space-y-4 text-sm text-white/70">
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="mr-3 h-4 w-4 text-red-500" /> 1 Chaîne (Workspace)</li>
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="mr-3 h-4 w-4 text-red-500" /> 3 Vidéos au total</li>
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="mr-3 h-4 w-4 text-red-500" /> Mode Solo complet</li>
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="mr-3 h-4 w-4 text-red-500" /> Pipeline 8 étapes</li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Link href="/auth/signup" className="w-full">
                    <Button variant="outline" className="w-full h-12 rounded-xl font-semibold border-white/10 hover:bg-white/5 text-white">
                      Commencer gratuitement
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              {/* Premium */}
              <Card className="flex flex-col relative overflow-hidden glass border-2 border-red-600 shadow-2xl shadow-red-600/20 rounded-3xl p-2">
                <div className="absolute top-0 right-0 bg-[#FF0000] text-white px-4 py-1 text-xs font-extrabold rounded-bl-xl uppercase tracking-wider">
                  Recommandé
                </div>
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-red-500 flex items-center justify-center gap-2">
                    <Sparkles className="h-5 w-5" /> Créateur Premium
                  </CardTitle>
                  <div className="mt-4 flex items-baseline justify-center text-5xl font-black text-white">
                    1,15€
                    <span className="ml-1 text-lg font-medium text-white/40">/mois</span>
                  </div>
                  <CardDescription className="mt-3 text-white/50">Pour les créateurs ambitieux et les équipes de production.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 px-6">
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="mr-3 h-4 w-4 text-red-500" /> Jusqu'à 7 Chaînes (Workspaces)</li>
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="mr-3 h-4 w-4 text-red-500" /> Jusqu'à 10 Vidéos au total</li>
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="mr-3 h-4 w-4 text-red-500" /> Mode Équipe (Monteurs, Voix off)</li>
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="mr-3 h-4 w-4 text-red-500" /> Validation de miniatures HD</li>
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Link href="/auth/signup" className="w-full">
                    <Button className="w-full h-12 rounded-xl font-bold text-white border-0"
                      style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)', boxShadow: '0 8px 30px rgba(255,0,0,0.3)' }}
                    >
                      Rejoindre le Premium
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="w-full py-16 bg-gradient-to-b from-transparent to-red-950/20 border-t border-white/5">
          <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center text-center space-y-6 max-w-3xl">
            <Logo size="lg" withLink={false} />
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Propulsez vos vidéos avec YouTube Creator Studio
            </h2>
            <p className="text-white/50 text-base">
              Rejoignez les créateurs qui organisent leur succès dès aujourd'hui.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="h-13 px-10 text-base font-bold text-white border-0 rounded-xl shadow-xl transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)', boxShadow: '0 12px 40px rgba(255,0,0,0.35)' }}
              >
                Créer mon compte maintenant
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-sm text-white/40 bg-[#06060c]">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Logo size="sm" withLink={false} />
            <p className="text-xs">© {new Date().getFullYear()} YCS Studio. Tous droits réservés.</p>
          </div>
          <div className="flex gap-6 text-xs">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
