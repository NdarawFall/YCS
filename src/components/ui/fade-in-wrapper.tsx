"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function FadeInWrapper({
  children,
  className,
  delay = 0,
  duration = 0.5,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("h-full", className)}
    >
      {children}
    </motion.div>
  );
}
