"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function BackgroundGradient({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      <motion.div
        animate={{
          x: ["0%", "5%", "-5%", "0%"],
          y: ["0%", "5%", "-5%", "0%"],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-[10%] -left-[10%] h-[60%] w-[60%] rounded-full bg-red-950/30 blur-[120px]"
      />
      <motion.div
        animate={{
          x: ["0%", "-5%", "5%", "0%"],
          y: ["0%", "-5%", "5%", "0%"],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-[20%] -right-[10%] h-[50%] w-[50%] rounded-full bg-red-950/20 blur-[100px]"
      />
    </div>
  );
}
