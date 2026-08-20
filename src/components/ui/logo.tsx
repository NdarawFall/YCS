import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg";

interface LogoProps {
  className?: string;
  size?: LogoSize;
  withLink?: boolean;
}

const SIZES = {
  sm: { box: "h-7 w-7 rounded-lg", mark: "text-base", text: "text-lg", badge: "text-[9px] px-1 py-0" },
  md: { box: "h-9 w-9 rounded-xl", mark: "text-xl", text: "text-xl", badge: "text-[10px] px-1.5 py-0.5" },
  lg: { box: "h-12 w-12 rounded-2xl", mark: "text-3xl", text: "text-2xl", badge: "text-xs px-2 py-0.5" },
} as const;

/**
 * Le monogramme seul, sans le texte de marque.
 *
 * Sert aussi dans les emplacements étroits (en-tête du workspace), pour que le
 * dégradé et la lettre ne soient définis qu'une seule fois.
 */
export function LogoMark({
  size = "md",
  className,
}: {
  size?: LogoSize;
  className?: string;
}) {
  const sizeClasses = SIZES[size];

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border border-red-500/30 text-white shadow-lg shadow-red-600/30",
        sizeClasses.box,
        className
      )}
      style={{ background: "linear-gradient(135deg, #ff0000 0%, #a80000 100%)" }}
    >
      {/* `leading-none` après la taille : tailwind-merge fait écraser leading-* par text-* */}
      <span className={cn("font-black tracking-tighter", sizeClasses.mark, "leading-none")}>M</span>
      {/* Reflet discret en haut à droite */}
      <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-white/40 blur-[1px]" />
    </div>
  );
}

export function Logo({ className, size = "md", withLink = true }: LogoProps) {
  const sizeClasses = SIZES[size];

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 select-none group cursor-pointer", className)}>
      <LogoMark size={size} className="transition-transform duration-300 group-hover:scale-105" />

      {/* Brand Text */}
      <div className="flex items-center gap-1.5">
        <span className={cn("font-extrabold tracking-tight text-white flex items-center", sizeClasses.text)}>
          Marvid
        </span>
        <span
          className={cn(
            "font-bold uppercase tracking-wider rounded-md bg-red-600/20 text-red-400 border border-red-500/30 font-mono",
            sizeClasses.badge
          )}
        >
          Studio
        </span>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg inline-block">
        {content}
      </Link>
    );
  }

  return content;
}
