"use client";

import { useState } from "react";
import { Plus, Radio } from "lucide-react";
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
import { createWorkspace } from "@/app/dashboard/actions";

interface CreateWorkspaceDialogProps {
  buttonText?: string;
  variant?: "default" | "hero";
}

export function CreateWorkspaceDialog({
  buttonText = "Nouvelle Chaîne",
  variant = "default"
}: CreateWorkspaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await createWorkspace(formData);

    if (res?.error) {
      setError(res.error);
      setIsLoading(false);
    } else {
      setOpen(false);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        variant === "hero" ? (
          <Button size="lg" className="h-12 px-8 text-white font-bold border-0 transition-all hover:scale-105 active:scale-95 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)', boxShadow: '0 8px 30px rgba(255,0,0,0.35)' }}
          >
            <Plus className="mr-2 h-5 w-5" />
            {buttonText}
          </Button>
        ) : (
          <Button className="text-white font-semibold border-0 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #ff0000, #cc0000)', boxShadow: '0 4px 20px rgba(255,0,0,0.3)' }}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            {buttonText}
          </Button>
        )
      } />

      <DialogContent className="sm:max-w-[480px] border-0 p-0 overflow-hidden"
        style={{
          background: 'rgba(10, 10, 20, 0.97)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 25px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06), 0 0 60px rgba(255,0,0,0.05)',
        }}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg shadow-red-600/30"
              style={{ background: 'linear-gradient(135deg, #ff0000, #880000)' }}
            >
              <Radio className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-extrabold text-white tracking-tight">
                Nouvelle Chaîne
              </DialogTitle>
              <DialogDescription className="text-sm text-white/40 mt-0.5">
                Créez un workspace dédié à votre chaîne YouTube
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Nom de la chaîne YouTube
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: Mindset Millionnaire, Tech Découverte..."
                className="h-11 rounded-xl text-white placeholder:text-white/25 font-medium"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="niche" className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                Niche / Thématique
              </Label>
              <Input
                id="niche"
                name="niche"
                placeholder="Ex: Finance, IA & Outils, Storytelling..."
                className="h-11 rounded-xl text-white placeholder:text-white/25 font-medium"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                required
              />
            </div>

            {error && (
              <div className="p-3 text-xs text-red-400 rounded-xl font-medium"
                style={{ background: 'rgba(255,0,0,0.08)', border: '1px solid rgba(255,0,0,0.15)' }}
              >
                {error}
              </div>
            )}
          </div>

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
                "Créer la chaîne →"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
