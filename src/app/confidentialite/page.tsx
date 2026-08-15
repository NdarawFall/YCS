import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";

export default function ConfidentialitePage() {
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
            <Lock className="h-3.5 w-3.5" />
            <span>Protection des Données</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Politique de Confidentialité</h1>
          <p className="text-white/50 text-sm mt-1">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <div className="space-y-6 text-sm text-white/70 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Collecte des Données</h2>
            <p>
              Nous collectons uniquement les informations nécessaires au bon fonctionnement de votre espace créateur :
            </p>
            <ul className="list-disc list-inside space-y-1 text-white/60">
              <li>Votre nom et adresse e-mail (fournis lors de la connexion sécurisée Google Auth).</li>
              <li>Les données de vos projets vidéos et configurations de chaînes (titres, étapes, notes).</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Utilisation des Données</h2>
            <p>
              Vos données sont exclusivement utilisées pour afficher votre tableau de bord personnel et vous fournir le service d'organisation de vidéos. <strong>Vos données ne sont ni vendues, ni partagées avec des tiers commercialement.</strong>
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Sécurité</h2>
            <p>
              Toutes les données sont stockées sur des bases de données hautement sécurisées bénéficiant d'un chiffrement de pointe et de règles de sécurité strictes (RLS).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Vos Droits (RGPD)</h2>
            <p>
              Conformément à la réglementation sur la protection des données, vous disposez d'un droit d'accès, de rectification et de suppression totale de votre compte et de vos données à tout moment.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
