"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ImageUploader } from "@/components/ui/image-uploader";

export function EditingPanel({ video, onSave, saving }: any) {
  const [notes, setNotes] = useState(video.editing_notes || "");
  const [resources, setResources] = useState<string[]>(
    Array.isArray(video.editing_resources) ? video.editing_resources : []
  );
  const [validated, setValidated] = useState(video.editing_validated || false);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Ressources & Assets Visuels</Label>
        <p className="text-xs text-muted-foreground">Logos, images de référence, footage B-Roll, graphiques à intégrer.</p>
        <ImageUploader images={resources} onChange={setResources} maxImages={8} label="Glissez vos assets visuels ici" />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Instructions de montage</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Style de coupes, transitions, sous-titres, effets, graphiques animés, charte graphique..."
          className="min-h-[160px] bg-[#0f0f13] border-border/80 text-white rounded-xl resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0f0f13] border border-border/70 rounded-xl">
        <div className="flex items-center gap-3">
          <Checkbox
            id="edit-valid"
            checked={validated}
            onCheckedChange={(c) => setValidated(!!c)}
            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
          />
          <Label htmlFor="edit-valid" className="text-sm font-semibold text-white cursor-pointer">
            Montage validé — passer à la Musique
          </Label>
        </div>
        <Button
          onClick={() => onSave({ editing_notes: notes, editing_resources: resources, editing_validated: validated })}
          disabled={saving}
          className="w-full sm:w-auto bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl px-5"
        >
          <Save className="mr-1.5 h-4 w-4" />
          {saving ? "..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
