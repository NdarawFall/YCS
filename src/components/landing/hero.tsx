"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function Chip({
  className,
  delay = 0,
  children,
}: {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "float-animation flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#101018]/80 px-4 py-2 text-xs font-medium text-white/75 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl",
        className
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function PipelineCard() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const gx = useMotionValue(-999);
  const gy = useMotionValue(-999);

  const rotateX = useSpring(useTransform(my, [0, 1], [5, -5]), {
    stiffness: 160,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), {
    stiffness: 160,
    damping: 18,
  });
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${gx}px ${gy}px, rgba(255,0,0,0.14), transparent 60%)`;

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
    gx.set(e.clientX - rect.left);
    gy.set(e.clientY - rect.top);
  }

  function onMouseLeave() {
    gx.set(-999);
    gy.set(-999);
  }

  const entrance = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] as const },
  };

  const inner = (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0c14]/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:p-7">
      <motion.div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ background: spotlight }}
      />
      <div className="relative">
        <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-4">
          <span className="text-sm font-medium text-white">
            Comment j'ai relancé ma chaîne
          </span>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-0.5 font-mono text-xs text-white/50">
            5/8
          </span>
        </div>

        <ol className="mt-4 space-y-1">
          {STAGES.map((stage, i) => {
            const done = i < 5;
            const current = i === 5;

            return (
              <li
                key={stage}
                className={cn(
                  "flex items-center gap-3 rounded-md px-2 py-2 text-sm",
                  current && "bg-white/[0.04]"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]",
                    done
                      ? "border-transparent bg-[#e60000] text-white"
                      : current
                        ? "border-white/40 text-white/70"
                        : "border-white/[0.12] text-white/25"
                  )}
                >
                  {done ? <Check className="h-3 w-3" strokeWidth={3} /> : i + 1}
                </span>
                <span
                  className={cn(
                    done
                      ? "text-white/45"
                      : current
                        ? "text-white"
                        : "text-white/30"
                  )}
                >
                  {stage}
                </span>
                {current && (
                  <span className="ml-auto text-xs text-white/40">en cours</span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );

  return (
    <motion.div {...entrance} className="relative">
      {reduce ? (
        inner
      ) : (
        <motion.div
          ref={ref}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        >
          {inner}
        </motion.div>
      )}

      <Chip className="absolute -top-5 -right-4 hidden lg:flex" delay={0.5}>
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20">
          <Check className="h-2.5 w-2.5 text-emerald-400" strokeWidth={3} />
        </span>
        Script approuvé
      </Chip>

      <Chip className="absolute -bottom-5 -left-4 hidden lg:flex" delay={1.1}>
        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e60000]" />
        </span>
        Miniature en relecture
      </Chip>
    </motion.div>
  );
}

export function Hero({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <section className="relative overflow-hidden pt-24 pb-12 sm:pt-28 md:pb-16 lg:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={item}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-red-400" />
              Studio de production YouTube
              <span className="h-3 w-px bg-white/10" />
              <span className="text-red-400">Nouveau · Mode Équipe</span>
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-5 max-w-4xl text-balance text-4xl font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
          >
            La production de vos vidéos YouTube,{" "}
            <span className="gradient-x bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
              du script à la publication
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/55 sm:text-lg"
          >
            Marvid remplace les listes éparpillées et les messages perdus par un
            suivi unique en 8 étapes. Vous savez toujours où en est chaque vidéo
            et qui doit intervenir ensuite.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-6 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Link href={isLoggedIn ? "/dashboard" : "/auth/signup"}>
              <Button
                size="lg"
                className="h-12 rounded-full border-0 bg-[#e60000] px-8 text-[15px] font-medium text-white shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(230,0,0,0.35)] transition-all hover:bg-[#c20000] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_12px_48px_rgba(230,0,0,0.5)]"
              >
                {isLoggedIn ? "Accéder à mon espace" : "Commencer gratuitement"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#produit">
              <Button
                variant="ghost"
                size="lg"
                className="h-12 rounded-full border border-white/[0.1] bg-white/[0.04] px-8 text-[15px] font-medium text-white/75 backdrop-blur-md hover:bg-white/[0.08] hover:text-white"
              >
                Voir comment ça marche
              </Button>
            </Link>
          </motion.div>

          <motion.p variants={item} className="mt-3.5 text-sm text-white/35">
            Gratuit pour une chaîne. Aucune carte bancaire demandée.
          </motion.p>
        </motion.div>

        <div className="relative mx-auto mt-12 max-w-3xl sm:mt-16">
          <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(230,0,0,0.16),transparent_70%)] blur-2xl" />
          <PipelineCard />
        </div>
      </div>
    </section>
  );
}
