"use client";

import { useState } from "react";
import { Plus, Tv, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  buttonText = "Nouveau Workspace",
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
      <DialogTrigger asChild>
        {variant === "hero" ? (
          <Button size="lg" className="h-12 px-6 bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold shadow-lg shadow-red-600/30 rounded-xl transition-transform hover:scale-105 border-0">
            <Plus className="mr-2 h-5 w-5" />
            {buttonText}
          </Button>
        ) : (
          <Button className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-semibold shadow-md shadow-red-600/25 rounded-xl border-0">
            <Plus className="mr-1.5 h-4 w-4" />
            {buttonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-[#141418] border-border/80 text-foreground">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/15 text-red-500 mb-2">
            <Tv className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold text-white">Créer une Chaîne / Workspace</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Un workspace regroupe la production de toutes les vidéos d'une chaîne YouTube spécifique.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium text-white">Nom de la chaîne YouTube</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Ex: Mindset Millionnaire, Tech Découverte..." 
                className="bg-[#1b1b22] border-border focus-visible:ring-red-500 text-white"
                required 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="niche" className="text-sm font-medium text-white">Niche / Thématique</Label>
              <Input 
                id="niche" 
                name="niche" 
                placeholder="Ex: Finance, IA & Outils, Storytelling..." 
                className="bg-[#1b1b22] border-border focus-visible:ring-red-500 text-white"
                required 
              />
            </div>
            {error && (
              <div className="p-3 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-md font-medium">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl shadow-lg shadow-red-600/25 border-0"
            >
              {isLoading ? "Création de la chaîne..." : "Créer le workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
