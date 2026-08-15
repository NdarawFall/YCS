import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, LayoutDashboard, Users, Video, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="px-6 lg:px-14 h-16 flex items-center border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <Link className="flex items-center justify-center gap-2" href="#">
          <Video className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl tracking-tight">YCS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Fonctionnalités
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">
            Tarifs
          </Link>
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Se connecter</Button>
          </Link>
          <Link href="/auth/signup">
            <Button size="sm">Commencer</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center justify-center text-center px-4 md:px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:30px_30px]" />
          <div className="absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          
          <div className="relative z-10 max-w-[800px] space-y-8">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
              ✨ Le studio ultime pour les créateurs faceless
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Gérez votre chaîne YouTube <span className="text-primary">sans dispersion</span>
            </h1>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl leading-relaxed">
              Fini les allers-retours entre Notion, Google Docs et WhatsApp. YCS centralise, organise et suit tout le processus de création de vos vidéos YouTube faceless au même endroit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/auth/signup">
                <Button size="lg" className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/20 transition-all hover:scale-105">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold">
                  Comment ça marche ?
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features / Problems solved */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30 border-y border-border/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Conçu pour les créateurs exigeants</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Une structure claire pour transformer vos idées en vidéos publiées, sans friction.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                <CardHeader>
                  <LayoutDashboard className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl">Kanban Structuré</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Suivez chaque vidéo étape par étape : Idée, Script, Voix off, Montage, Musique, Miniature, SEO, jusqu'à l'Upload.</p>
                </CardContent>
              </Card>
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                <CardHeader>
                  <Users className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl">Solo ou en Équipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Commencez seul, puis invitez des collaborateurs (Copywriter, Monteur, Voix off, Miniamaker) quand votre chaîne grandit.</p>
                </CardContent>
              </Card>
              <Card className="bg-background/50 backdrop-blur-sm border-primary/10 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
                <CardHeader>
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <CardTitle className="text-xl">Validation Intégrée</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Fini les erreurs de communication. Chaque étape dispose de ses propres notes, ressources et case de validation.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Tarifs simples et transparents</h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl">
                Commencez gratuitement, passez à la vitesse supérieure quand vous êtes prêt.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Gratuit */}
              <Card className="flex flex-col relative overflow-hidden border-border/50">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold">Gratuit</CardTitle>
                  <div className="mt-4 flex items-baseline justify-center text-5xl font-extrabold">
                    0€
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/mois</span>
                  </div>
                  <CardDescription className="mt-4">Idéal pour se lancer et structurer sa première chaîne.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4 text-sm text-muted-foreground">
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> 1 Workspace (Chaîne)</li>
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Vidéos illimitées</li>
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Mode Solo uniquement</li>
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Kanban complet (8 étapes)</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/auth/signup" className="w-full">
                    <Button variant="outline" className="w-full">Commencer gratuitement</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              {/* Pro */}
              <Card className="flex flex-col relative overflow-hidden border-primary/50 shadow-lg shadow-primary/10">
                <div className="absolute top-0 right-0 -mr-8 mt-4 w-32 rotate-45 bg-primary px-3 py-1 text-center text-xs font-bold text-primary-foreground">
                  POPULAIRE
                </div>
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-primary">Pro</CardTitle>
                  <div className="mt-4 flex items-baseline justify-center text-5xl font-extrabold">
                    1,15€
                    <span className="ml-1 text-xl font-medium text-muted-foreground">/mois</span>
                  </div>
                  <CardDescription className="mt-4">Pour les créateurs qui délèguent et gèrent plusieurs chaînes.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-4 text-sm text-muted-foreground">
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Workspaces illimités</li>
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Mode Équipe (invitations)</li>
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Rôles personnalisés (Monteur, Voix off...)</li>
                    <li className="flex items-center"><CheckCircle2 className="mr-2 h-4 w-4 text-primary" /> Upload d'images (Miniatures, Réf)</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/auth/signup" className="w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Passer Pro</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full py-20 bg-primary/5 border-t border-primary/10">
          <div className="container px-4 md:px-6 mx-auto flex flex-col items-center justify-center text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Prêt à professionnaliser votre création ?</h2>
            <p className="max-w-[600px] text-muted-foreground text-lg">
              Rejoignez YCS aujourd'hui et reprenez le contrôle de votre processus de création YouTube.
            </p>
            <Link href="/auth/signup">
              <Button size="lg" className="h-12 px-10 text-base font-semibold shadow-lg shadow-primary/20 transition-transform hover:scale-105">
                Créer mon compte gratuit
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} YCS - Youtube Creator Studio. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">Mentions légales</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Confidentialité</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
