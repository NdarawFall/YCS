"use client";

import { useState } from "react";
import { Plus, Users, User, Clapperboard, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createVideo } from "@/app/workspace/actions";

export function CreateVideoDialog({ workspaceId }: { workspaceId: string }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"solo" | "equipe">("solo");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("workspaceId", workspaceId);
    formData.append("mode", mode);

    const res = await createVideo(formData);

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      setOpen(false);
      // Wait for dialog to close before redirect to prevent UI issues
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold shadow-lg shadow-red-600/30 rounded-xl border-0 transition-all hover:scale-105 active:scale-95">
          <Plus className="mr-1.5 h-4 w-4" />
          Nouvelle Vidéo
        </Button>
      } />

      <DialogContent className="sm:max-w-[480px] border-0 p-0 overflow-hidden"
        style={{
          background: 'rgba(10, 10, 20, 0.97)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), 0 0 60px rgba(255,0,0,0.05)',
        }}
      >
        {/* Header with gradient accent */}
        <div className="relative px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Top red accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

          <div className="flex items-center gap-4 mb-4">
            {/* Modern icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg shadow-red-600/30"
              style={{ background: 'linear-gradient(135deg, #ff0000, #880000)' }}
            >
              <Clapperboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold text-white tracking-tight">
                Nouvelle Vidéo
              </DialogTitle>
              <DialogDescription className="text-sm text-white/40 mt-0.5">
                Ajoutez une vidéo à votre pipeline de production
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-5">
            {/* Title input */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Titre du concept
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Ex: Comment j'ai automatisé ma chaîne en 30 jours..."
                className="h-11 rounded-xl text-white placeholder:text-white/25 font-medium"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  outline: 'none',
                }}
                required
              />
            </div>

            {/* Mode selection — custom cards instead of Select */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Mode de production
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Solo */}
                <button
                  type="button"
                  onClick={() => setMode("solo")}
                  className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                    mode === "solo"
                      ? "border-red-500/60 shadow-lg shadow-red-500/10"
                      : "border-white/8 hover:border-white/15"
                  }`}
                  style={{
                    background: mode === "solo"
                      ? 'linear-gradient(135deg, rgba(255,0,0,0.1), rgba(255,0,0,0.03))'
                      : 'rgba(255,255,255,0.03)',
                  }}
                >
                  {mode === "solo" && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
                  )}
                  <div className="p-2 rounded-lg bg-white/5">
                    <User className="h-4 w-4 text-white/70" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Solo</div>
                    <div className="text-xs text-white/40">Création autonome</div>
                  </div>
                </button>

                {/* Équipe */}
                <button
                  type="button"
                  onClick={() => setMode("equipe")}
                  className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border transition-all duration-200 text-left cursor-pointer ${
                    mode === "equipe"
                      ? "border-red-500/60 shadow-lg shadow-red-500/10"
                      : "border-white/8 hover:border-white/15"
                  }`}
                  style={{
                    background: mode === "equipe"
                      ? 'linear-gradient(135deg, rgba(255,0,0,0.1), rgba(255,0,0,0.03))'
                      : 'rgba(255,255,255,0.03)',
                  }}
                >
                  {mode === "equipe" && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
                  )}
                  <div className="p-2 rounded-lg bg-white/5">
                    <Users className="h-4 w-4 text-white/70" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Équipe</div>
                    <div className="text-xs text-white/40">Délégation & Collabs</div>
                  </div>
                </button>
              </div>
            </div>

            {mode === "equipe" && (
              <div className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,0,0,0.06)', border: '1px solid rgba(255,0,0,0.12)' }}
              >
                <Zap className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300 leading-relaxed">
                  En mode équipe, vous pourrez assigner vos collaborateurs (Monteur, Voix off, Miniamaker) à chaque phase de production.
                </p>
              </div>
            )}

            {error && (
              <div className="p-3 text-xs text-red-400 rounded-xl font-medium"
                style={{ background: 'rgba(255,0,0,0.08)', border: '1px solid rgba(255,0,0,0.15)' }}
              >
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl font-bold text-white border-0 text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              style={{
                background: isLoading
                  ? 'rgba(255,0,0,0.4)'
                  : 'linear-gradient(135deg, #ff0000, #cc0000)',
                boxShadow: '0 8px 30px rgba(255,0,0,0.3)',
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Création en cours...
                </span>
              ) : (
                "Lancer la production →"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
