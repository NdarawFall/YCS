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
  Film
} from "lucide-react";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  return (
    <div className="flex flex-col min-h-screen bg-[#080810] text-[#f0f0f5]">
      {/* Navbar */}
      <header className="px-6 lg:px-14 h-18 flex items-center border-b border-white/5 glass sticky top-0 z-50">
        <Logo size="md" />

        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium text-white/50 hover:text-white transition-colors" href="#features">
            Fonctionnalités
          </Link>
          <Link className="text-sm font-medium text-white/50 hover:text-white transition-colors" href="#pricing">
            Tarifs
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button size="sm" className="font-bold text-white border-0 rounded-xl transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)', boxShadow: '0 4px 20px rgba(255,0,0,0.3)' }}
              >
                <LayoutGrid className="mr-1.5 h-4 w-4" />
                Mon Espace
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex hover:bg-white/8 text-white/80 hover:text-white font-medium rounded-xl">
                  Se connecter
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="font-semibold text-white border-0 rounded-xl transition-all hover:scale-105"
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
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 flex flex-col items-center justify-center text-center px-4 md:px-6 relative overflow-hidden">
          <div className="relative z-10 max-w-[920px] space-y-8 flex flex-col items-center">
            
            {/* Avatars Pair Badge */}
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-2 pr-4 rounded-full backdrop-blur-md shadow-xl">
              <div className="flex -space-x-3">
                <div className="relative w-11 h-11 rounded-full border-2 border-red-600 overflow-hidden shadow-lg">
                  <Image
                    src="/avatar-boy.jpg"
                    alt="Créateur YouTube Male Avatar"
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="relative w-11 h-11 rounded-full border-2 border-white/40 overflow-hidden shadow-lg">
                  <Image
                    src="/avatar-team.jpg"
                    alt="Équipe YouTube Creators Avatar"
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="text-left text-xs font-semibold text-white/80">
                <span className="text-red-400 font-bold">Adopté par les créateurs</span> YouTube
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl md:text-7xl leading-tight">
              Pilotez vos chaînes YouTube <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-red-100 to-red-500 bg-clip-text text-transparent">
                sans aucun désordre
              </span>
            </h1>

            {/* Subtext */}
            <p className="mx-auto max-w-[680px] text-white/60 text-base md:text-xl leading-relaxed font-medium">
              Une plateforme claire et épurée pour orchestrer vos idées, vos scripts, vos enregistrements et vos montages vidéo.
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
            <div className="pt-8 grid grid-cols-3 gap-6 max-w-xl mx-auto border-t border-white/10 text-center w-full">
              <div>
                <div className="text-2xl font-black text-white">8 Étapes</div>
                <div className="text-xs text-white/40">Pipeline structuré</div>
              </div>
              <div>
                <div className="text-2xl font-black text-red-500">100%</div>
                <div className="text-xs text-white/40">Simple & Intuitif</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white">Stockage HD</div>
                <div className="text-xs text-white/40">Fichiers & Miniatures</div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Showcase Creators (featuring Solo Avatar & 3-People Team Avatar) */}
        <section className="w-full py-16 bg-[#0a0a14]/60 border-y border-white/5">
          <div className="container px-4 md:px-6 mx-auto max-w-5xl">
            <div className="text-center mb-12 space-y-3">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 tracking-wider uppercase">
                <Sparkles className="h-4 w-4" /> Conçu pour tous les formats
              </div>
              <h2 className="text-3xl font-extrabold text-white">Que vous soyez Solo ou en Équipe</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {/* Solo Creator Card */}
              <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
                <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden border-2 border-red-500/40 shadow-xl">
                  <Image
                    src="/avatar-boy.jpg"
                    alt="Créateur Solo"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                    <User className="h-3 w-3" /> Mode Solo
                  </div>
                  <h3 className="text-xl font-bold text-white">Le Créateur Autonome</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Gérez vos chaînes en solo sans perte de temps. Suivez l'avancement de chaque vidéo avec sérénité.
                  </p>
                </div>
              </div>

              {/* Team Creator Card (3 People Team Avatar) */}
              <div className="glass p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
                <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden border-2 border-purple-500/40 shadow-xl bg-slate-900">
                  <Image
                    src="/avatar-team.jpg"
                    alt="Équipe de 3 créateurs"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Users className="h-3 w-3" /> Mode Équipe
                  </div>
                  <h3 className="text-xl font-bold text-white">Le Studio Collaboratif</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Déléguez le montage, la voix off et les miniatures à vos collaborateurs avec des rôles et des validations claires.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Clear Value Proposition */}
        <section id="features" className="w-full py-20 md:py-28">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 tracking-wider uppercase">
                <Flame className="h-4 w-4" /> Organisation Limpide
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
                Tout ce dont votre chaîne a besoin
              </h2>
              <p className="max-w-[650px] text-white/50 md:text-lg">
                Rassemblez toute la production de vos vidéos dans un seul espace fluide.
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
                  <CardTitle className="text-xl text-white group-hover:text-red-400 transition-colors">Gestion d'Équipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Assignez précisément vos monteurs, voix off, copywriters et miniamakers pour faire avancer le projet sans friction.
                  </p>
                </CardContent>
              </Card>

              <Card className="glass border-white/5 shadow-2xl hover:border-red-600/50 transition-all duration-300 hover:-translate-y-2 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-colors duration-500" />
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/15 text-red-500 mb-2 ring-1 ring-red-500/20 group-hover:scale-110 transition-transform duration-300">
                    <Layers className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-white group-hover:text-red-400 transition-colors">Médias & Images HD</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Stockez et validez directement vos propositions de miniatures et visuels HD pour chaque projet vidéo.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="w-full py-20 md:py-28 bg-[#0a0a14]/60 border-t border-white/5">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 tracking-wider uppercase">
                <TrendingUp className="h-4 w-4" /> Tarification Transparente
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-white">
                Choisissez votre formule
              </h2>
              <p className="max-w-[650px] text-white/50 md:text-lg">
                Commencez gratuitement, passez au niveau supérieur quand votre chaîne grandit.
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
                    <li className="flex items-center text-white font-medium"><CheckCircle2 className="mr-3 h-4 w-4 text-red-500" /> Stockage d'images & Médias HD</li>
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
        <section className="w-full py-20 bg-gradient-to-b from-transparent to-red-950/20 border-t border-white/5">
          <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center text-center space-y-6 max-w-3xl">
            <Logo size="lg" withLink={false} />
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Prêt à propulser vos contenus YouTube ?
            </h2>
            <p className="text-white/50 text-base md:text-lg">
              Organisez le succès de vos prochaines vidéos dès aujourd'hui.
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
            <p className="text-xs">© {new Date().getFullYear()} YCS. Tous droits réservés.</p>
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
