import Link from "next/link";
import { cn } from "@/lib/utils";
import { LayoutGrid } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withLink?: boolean;
}

export function Logo({ className, size = "md", withLink = true }: LogoProps) {
  const sizeClasses = {
    sm: {
      box: "h-7 w-7 rounded-lg",
      icon: "w-4 h-4",
      text: "text-lg",
      badge: "text-[9px] px-1 py-0",
    },
    md: {
      box: "h-9 w-9 rounded-xl",
      icon: "w-5 h-5",
      text: "text-xl",
      badge: "text-[10px] px-1.5 py-0.5",
    },
    lg: {
      box: "h-12 w-12 rounded-2xl",
      icon: "w-6 h-6",
      text: "text-2xl",
      badge: "text-xs px-2 py-0.5",
    },
  }[size];

  const content = (
    <div className={cn("inline-flex items-center gap-3 select-none group cursor-pointer", className)}>
      {/* Icône de Menu 4 Cases rouge YouTube */}
      <div
        className={cn(
          "relative flex items-center justify-center bg-[#FF0000] text-white shadow-lg shadow-red-600/30 group-hover:scale-105 group-hover:bg-[#E60000] transition-all duration-200",
          sizeClasses.box
        )}
      >
        {/* Grille 4 cases (2x2) */}
        <div className="grid grid-cols-2 gap-1 p-1">
          <div className="w-1.5 h-1.5 bg-white rounded-xs" />
          <div className="w-1.5 h-1.5 bg-white rounded-xs" />
          <div className="w-1.5 h-1.5 bg-white rounded-xs" />
          <div className="w-1.5 h-1.5 bg-white rounded-xs" />
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex items-center gap-1.5">
        <span className={cn("font-extrabold tracking-tight text-white flex items-center", sizeClasses.text)}>
          YCS
        </span>
        <span
          className={cn(
            "font-bold uppercase tracking-wider rounded-md bg-red-600/20 text-red-500 border border-red-600/30 font-mono",
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
