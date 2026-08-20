"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";

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

export function StageMarquee() {
  const reduce = useReducedMotion();
  const items = [...STAGES, ...STAGES];

  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-white/[0.02] py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#08080c] to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#08080c] to-transparent sm:w-40" />

      <motion.div
        className="flex w-max items-center gap-4"
        {...(reduce
          ? {}
          : {
              animate: { x: ["0%", "-50%"] },
              transition: { duration: 28, ease: "linear", repeat: Infinity },
            })}
      >
        {items.map((stage, i) => (
          <div key={i} className="flex items-center gap-4">
            <span className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.03] px-4 py-1.5 text-sm text-white/45">
              <Check className="h-3.5 w-3.5 text-red-400/70" />
              {stage}
            </span>
            <span className="h-1 w-1 rounded-full bg-white/20" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
