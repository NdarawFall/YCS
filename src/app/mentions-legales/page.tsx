import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[#080810] text-[#f0f0f5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 glass p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors p-2 -ml-2 rounded-xl hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4 text-red-500" />
          <span>Retour à l'accueil</span>
        </Link>

        <div className="border-b border-white/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 text-red-400 text-xs font-bold mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Document Officiel</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Mentions Légales</h1>
          <p className="text-white/50 text-sm mt-1">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="space-y-6 text-sm text-white/70 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Éditeur de la Plateforme</h2>
            <p>
              Le site web et l'application <strong>YCS (YouTube Creator Studio)</strong> sont édités à des fins d'organisation et de gestion de workflows vidéo pour les créateurs de contenu YouTube.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Hébergement</h2>
            <p>
              La plateforme est hébergée sur les infrastructures cloud de :
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li><strong>Vercel Inc.</strong> – 440 N Barranca Ave #4133 Covina, CA 91723 (Déploiement Frontend & Edge Server)</li>
              <li><strong>Supabase Inc.</strong> – Base de données sécurisée & Authentification OAuth</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Propriété Intellectuelle</h2>
            <p>
              L'ensemble des contenus (textes, visuels, logos, interfaces, code source) de la plateforme YCS est protégé par les lois relatives à la propriété intellectuelle. Toute reproduction non autorisée est strictement interdite.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Contact</h2>
            <p>
              Pour toute question concernant l'utilisation de la plateforme, vous pouvez nous contacter via notre page de contact ou par e-mail à l'adresse support de YCS Studio.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
