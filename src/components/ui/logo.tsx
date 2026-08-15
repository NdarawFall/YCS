import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withLink?: boolean;
}

export function Logo({ className, size = "md", withLink = true }: LogoProps) {
  const sizeClasses = {
    sm: {
      box: "h-7 w-9 rounded-md",
      play: "w-3 h-3 translate-x-0.5",
      text: "text-lg",
      badge: "text-[9px] px-1 py-0",
    },
    md: {
      box: "h-8 w-11 rounded-lg",
      play: "w-3.5 h-3.5 translate-x-0.5",
      text: "text-xl",
      badge: "text-[10px] px-1.5 py-0.2",
    },
    lg: {
      box: "h-11 w-15 rounded-xl",
      play: "w-5 h-5 translate-x-0.5",
      text: "text-2xl",
      badge: "text-xs px-2 py-0.5",
    },
  }[size];

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 select-none group", className)}>
      {/* YouTube Play Icon Box */}
      <div
        className={cn(
          "relative flex items-center justify-center bg-[#FF0000] text-white shadow-md shadow-red-600/30 group-hover:scale-105 transition-transform duration-200",
          sizeClasses.box
        )}
      >
        {/* Play Triangle */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={cn("text-white fill-current drop-shadow-xs", sizeClasses.play)}
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex items-center gap-1.5">
        <span className={cn("font-extrabold tracking-tighter text-foreground flex items-center", sizeClasses.text)}>
          YCS
        </span>
        <span
          className={cn(
            "font-semibold uppercase tracking-wider rounded bg-red-600/15 text-red-500 border border-red-600/20 font-mono",
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
      <Link href="/" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
