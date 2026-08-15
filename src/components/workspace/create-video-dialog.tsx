"use client";

import { useState } from "react";
import { Plus, Video, Film, Users, User } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold shadow-md shadow-red-600/30 rounded-xl border-0">
          <Plus className="mr-1.5 h-4 w-4" />
          Nouvelle Vidéo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[460px] bg-[#141418] border-border/80 text-foreground">
        <DialogHeader>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/15 text-red-500 mb-2">
            <Film className="h-5 w-5" />
          </div>
          <DialogTitle className="text-xl font-bold text-white">Ajouter une nouvelle vidéo</DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            La vidéo sera ajoutée à l'étape "Idées" de votre tableau Kanban.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-sm font-medium text-white">Titre du concept / Idée</Label>
              <Input 
                id="title" 
                name="title" 
                placeholder="Ex: Comment j'ai automatisé ma chaîne en 30 jours..." 
                className="bg-[#1b1b22] border-border focus-visible:ring-red-500 text-white rounded-xl"
                required 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="mode" className="text-sm font-medium text-white">Mode de production</Label>
              <Select value={mode} onValueChange={(val: string | null) => { if (val) setMode(val as "solo" | "equipe"); }}>
                <SelectTrigger className="bg-[#1b1b22] border-border focus:ring-red-500 text-white rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1b1b22] border-border text-white">
                  <SelectItem value="solo" className="focus:bg-white/10">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-red-500" />
                      <span>Mode Solo (Création autonome)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="equipe" className="focus:bg-white/10">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-red-500" />
                      <span>Mode Équipe (Délégation & Collaborateurs)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === "equipe" && (
              <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-xl text-xs text-red-300">
                <p>💡 En mode équipe, vous pourrez assigner vos collaborateurs (Monteur, Voix off, Miniamaker) à chaque phase.</p>
              </div>
            )}

            {error && (
              <div className="p-3 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg font-medium">
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
              {isLoading ? "Ajout au Kanban..." : "Ajouter la vidéo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
