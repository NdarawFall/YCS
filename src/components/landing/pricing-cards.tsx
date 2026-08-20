"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function PricingCards() {
  const reduce = useReducedMotion();

  return (
    <div className="mt-14 grid gap-5 md:grid-cols-3">
      {PLANS.map((plan, i) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: reduce ? 0 : 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.7,
            delay: i * 0.12,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={reduce ? undefined : { y: -6 }}
          className="h-full"
        >
          {plan.highlight ? (
            <div className="h-full rounded-2xl bg-gradient-to-b from-red-500/70 via-red-500/25 to-transparent p-px shadow-[0_0_50px_rgba(230,0,0,0.22)]">
              <div className="flex h-full flex-col rounded-[calc(1rem-1px)] bg-[#0d0d13]/95 p-7 backdrop-blur-xl">
                <PlanBody plan={plan} />
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col rounded-2xl border border-white/[0.08] bg-[#0d0d13]/80 p-7 backdrop-blur-xl">
              <PlanBody plan={plan} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function PlanBody({ plan }: { plan: (typeof PLANS)[number] }) {
  return (
    <>
      <div className="flex h-6 items-center justify-between">
        <h3 className="text-base font-medium text-white">{plan.name}</h3>
        {plan.highlight && (
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 text-xs text-red-400">
            Le plus choisi
          </span>
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
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-white/30"
              strokeWidth={2.5}
            />
            {feature}
          </li>
        ))}
      </ul>

      <Link href="/auth/signup" className="mt-8">
        <Button
          className={cn(
            "h-11 w-full rounded-lg font-medium",
            plan.highlight
              ? "border-0 bg-[#e60000] text-white hover:bg-[#c20000]"
              : "border border-white/[0.12] bg-transparent text-white/80 hover:bg-white/[0.05] hover:text-white"
          )}
        >
          {plan.cta}
        </Button>
      </Link>
    </>
  );
}
