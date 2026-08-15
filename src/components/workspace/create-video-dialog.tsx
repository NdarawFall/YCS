"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
      <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors">
        <Plus className="h-4 w-4" />
        Nouvelle Vidéo
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une vidéo</DialogTitle>
          <DialogDescription>
            Ajoutez une nouvelle vidéo au kanban de votre workspace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre ou concept (provisoire)</Label>
              <Input id="title" name="title" placeholder="Ex: Les 5 secrets de..." required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="mode">Mode de création</Label>
              <Select value={mode} onValueChange={(val: string | null) => { if (val) setMode(val as "solo" | "equipe"); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo (Je fais tout)</SelectItem>
                  <SelectItem value="equipe">Équipe (Délégation)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === "equipe" && (
              <div className="p-3 bg-muted/30 border rounded-md text-sm text-muted-foreground">
                <p>En mode équipe, vous pourrez assigner des collaborateurs (Copywriter, Monteur, etc.) aux différentes étapes de la vidéo.</p>
              </div>
            )}

            {error && (
              <div className="text-sm text-destructive font-medium">{error}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer la vidéo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
