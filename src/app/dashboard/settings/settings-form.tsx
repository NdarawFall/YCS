"use client";

import { useState } from "react";
import { updateUsername } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Crown, Sparkles } from "lucide-react";

export function SettingsForm({ initialFullName, currentPlan }: { initialFullName: string, currentPlan: string }) {
  const [fullName, setFullName] = useState(initialFullName);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    const formData = new FormData();
    formData.append("fullName", fullName);

    const res = await updateUsername(formData);

    setIsSaving(false);
    if (res.error) {
      setSaveMessage({ type: 'error', text: res.error });
    } else {
      setSaveMessage({ type: 'success', text: "Profil mis à jour avec succès." });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  const plans = [
    {
      id: "free",
      name: "Débutant (Gratuit)",
      description: "Pour commencer à structurer vos vidéos.",
      price: "0€",
      features: ["3 vidéos simultanées", "Tableau de bord basique", "Mode solo uniquement"],
      color: "border-border/60 bg-[#141418]",
      badge: null
    },
    {
      id: "pro",
      name: "Créateur Pro",
      description: "Pour les chaînes en pleine croissance.",
      price: "19€ / mois",
      features: ["Vidéos illimitées", "Mode Équipe (collaborateurs)", "Support prioritaire"],
      color: "border-red-500/50 bg-red-500/5 shadow-lg shadow-red-500/10",
      badge: <span className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-red-600 to-red-400 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-md shadow-red-600/30"><Sparkles className="h-3 w-3" /> RECOMMANDÉ</span>
    },
    {
      id: "agency",
      name: "Agence / MCN",
      description: "Pour les professionnels gérant plusieurs chaînes.",
      price: "49€ / mois",
      features: ["Workspaces illimités", "Rôles avancés (Admin, Éditeur)", "Accès API"],
      color: "border-purple-500/50 bg-purple-500/5 shadow-lg shadow-purple-500/10",
      badge: <span className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-400 text-white text-[10px] font-bold rounded-full flex items-center gap-1 shadow-md shadow-purple-600/30"><Crown className="h-3 w-3" /> PREMIUM</span>
    }
  ];

  return (
    <div className="space-y-8">
      {/* Profile Section */}
      <Card className="bg-[#141418] border-border/80 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-[#17171e]">
          <CardTitle className="text-xl text-white">Profil public</CardTitle>
          <CardDescription>Modifiez comment les autres voient votre nom.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white font-medium">Nom complet ou Pseudo</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-[#0f0f13] border-border/80 text-white h-11 rounded-xl focus-visible:ring-red-500/50"
                placeholder="Votre nom de créateur..."
              />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Button 
                type="submit" 
                disabled={isSaving || fullName === initialFullName}
                className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl px-6"
              >
                {isSaving ? "Enregistrement..." : "Enregistrer"}
              </Button>
              {saveMessage && (
                <span className={`text-sm font-medium flex items-center gap-1.5 ${saveMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {saveMessage.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
                  {saveMessage.text}
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Subscription Plans Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Abonnement & Facturation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            return (
              <div key={plan.id} className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 ${plan.color} ${isCurrent ? 'ring-2 ring-red-500/80 ring-offset-2 ring-offset-[#0b0b0d]' : ''}`}>
                {plan.badge}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground h-8">{plan.description}</p>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-white">{plan.price}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  disabled={isCurrent}
                  variant={isCurrent ? "outline" : "default"}
                  className={`w-full rounded-xl font-bold ${
                    isCurrent 
                      ? 'bg-transparent border-red-500/30 text-red-400 hover:bg-transparent hover:text-red-400 opacity-80 cursor-default' 
                      : 'bg-white text-black hover:bg-neutral-200 shadow-md shadow-white/10 cursor-not-allowed'
                  }`}
                  title={isCurrent ? "Votre plan actuel" : "Prochainement disponible"}
                >
                  {isCurrent ? "Plan actuel" : "Mettre à niveau"}
                </Button>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">
          La facturation sera bientôt disponible. Profitez de toutes les fonctionnalités gratuitement pour l'instant !
        </p>
      </div>
    </div>
  );
}
