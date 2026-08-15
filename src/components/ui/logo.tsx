import Link from "next/link";
import { cn } from "@/lib/utils";
import { Play, Sparkles } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  withLink?: boolean;
}

export function Logo({ className, size = "md", withLink = true }: LogoProps) {
  const sizeClasses = {
    sm: {
      box: "h-7 w-7 rounded-lg",
      icon: "w-3.5 h-3.5",
      text: "text-lg",
      badge: "text-[9px] px-1 py-0",
    },
    md: {
      box: "h-9 w-9 rounded-xl",
      icon: "w-4 h-4",
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
    <div className={cn("inline-flex items-center gap-2.5 select-none group cursor-pointer", className)}>
      {/* Modern Studio Icon: Glowing Play Button */}
      <div
        className={cn(
          "relative flex items-center justify-center text-white shadow-lg shadow-red-600/30 group-hover:scale-105 transition-all duration-300 border border-red-500/30 overflow-hidden",
          sizeClasses.box
        )}
        style={{
          background: 'linear-gradient(135deg, #ff0000 0%, #a80000 100%)',
        }}
      >
        <Play className={cn("fill-current ml-0.5 text-white transition-transform group-hover:scale-110", sizeClasses.icon)} />
        <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-white/40 blur-[1px]" />
      </div>

      {/* Brand Text */}
      <div className="flex items-center gap-1.5">
        <span className={cn("font-extrabold tracking-tight text-white flex items-center", sizeClasses.text)}>
          YCS
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
