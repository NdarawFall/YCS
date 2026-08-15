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
import { createWorkspace } from "@/app/dashboard/actions";

export function CreateWorkspaceDialog() {
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
      <DialogTrigger className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors">
        <Plus className="h-4 w-4" />
        Nouveau Workspace
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer un Workspace</DialogTitle>
          <DialogDescription>
            Un workspace correspond à une chaîne YouTube. Vous pourrez y gérer toutes vos vidéos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom de la chaîne</Label>
              <Input id="name" name="name" placeholder="Ma Super Chaîne" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="niche">Niche / Thématique</Label>
              <Input id="niche" name="niche" placeholder="Finance, Gaming, Histoire..." required />
            </div>
            {error && (
              <div className="text-sm text-destructive font-medium">{error}</div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Création..." : "Créer le workspace"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
