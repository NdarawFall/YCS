"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogOut, LayoutGrid, ChevronDown, User as UserIcon } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";

interface UserNavProps {
  user: {
    email?: string;
    fullName?: string;
    avatarUrl?: string;
  };
}

export function UserNav({ user }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const fullName = user.fullName || user.email?.split("@")[0] || "Créateur";
  const initials = fullName.substring(0, 2).toUpperCase();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-3" ref={menuRef}>
      {/* Bouton de profil cliquable avec photo */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer border border-border/40 bg-[#141418]"
      >
        {/* Photo de profil Google ou Initiales */}
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={fullName}
            className="h-9 w-9 rounded-full object-cover border border-red-500/40 shadow-sm"
          />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FF0000] text-white font-bold text-xs shadow-sm">
            {initials}
          </div>
        )}

        <div className="hidden md:flex flex-col text-left pr-2">
          <span className="text-xs font-bold text-white line-clamp-1">{fullName}</span>
          <span className="text-[11px] text-muted-foreground line-clamp-1">{user.email}</span>
        </div>

        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 hidden md:block ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Menu déroulant fluide & sans erreur */}
      {isOpen && (
        <div className="absolute right-0 top-13 w-64 rounded-2xl bg-[#141418] border border-border/80 p-2 shadow-2xl shadow-black/80 z-50 animate-in fade-in-0 zoom-in-95 duration-150">
          {/* Header profil */}
          <div className="p-3 border-b border-border/50 mb-1">
            <p className="text-sm font-bold text-white line-clamp-1">{fullName}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{user.email}</p>
          </div>

          {/* Liens */}
          <div className="space-y-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-white hover:bg-white/10 rounded-xl transition-colors font-medium"
            >
              <LayoutGrid className="h-4 w-4 text-red-500" />
              <span>Mes Workspaces</span>
            </Link>
          </div>

          <div className="border-t border-border/50 mt-1 pt-1">
            <form action={logout}>
              <button
                type="submit"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-white hover:bg-red-600/20 rounded-xl transition-colors font-semibold text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                <span>Se déconnecter</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bouton direct Déconnexion rapide visible sur grand écran */}
      <form action={logout} className="hidden sm:block">
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="text-xs text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-xl gap-1.5 h-9"
          title="Se déconnecter"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden lg:inline">Déconnexion</span>
        </Button>
      </form>
    </div>
  );
}
