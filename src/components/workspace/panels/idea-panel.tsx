"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function IdeaPanel({ video, onSave, saving }: any) {
  const [description, setDescription] = useState(video.idea_description || "");
  const [notes, setNotes] = useState(video.idea_notes || "");
  const [validated, setValidated] = useState(video.idea_validated || false);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Concept & Angle</Label>
        <p className="text-xs text-muted-foreground">L'idée centrale, l'accroche, la promesse et le public cible.</p>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Comment j'ai automatisé 80% de ma chaîne YouTube avec l'IA — angle : productivité créateur, cible : YouTubeurs débutants..."
          className="min-h-[160px] bg-[#0f0f13] border-border/80 text-white rounded-xl text-sm leading-relaxed focus-visible:ring-amber-500/50 resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Recherches, Liens d'inspiration & Concurrents</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Collez ici des liens YouTube, articles, remarques de recherche..."
          className="min-h-[120px] bg-[#0f0f13] border-border/80 text-white rounded-xl text-sm focus-visible:ring-amber-500/50 resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0f0f13] border border-border/70 rounded-xl">
        <div className="flex items-center gap-3">
          <Checkbox
            id="idea-valid"
            checked={validated}
            onCheckedChange={(c) => setValidated(!!c)}
            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
          />
          <Label htmlFor="idea-valid" className="text-sm font-semibold text-white cursor-pointer">
            Idée validée — passer à l'étape Script
          </Label>
        </div>
        <Button
          onClick={() => onSave({ idea_description: description, idea_notes: notes, idea_validated: validated })}
          disabled={saving}
          className="w-full sm:w-auto bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl px-5 shadow-md shadow-red-600/20"
        >
          <Save className="mr-1.5 h-4 w-4" />
          {saving ? "..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
