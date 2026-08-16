"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { ImageUploader } from "@/components/ui/image-uploader";

export function ThumbnailPanel({ video, onSave, saving }: any) {
  const [thumbnails, setThumbnails] = useState<string[]>(
    Array.isArray(video.thumbnail_images) ? video.thumbnail_images : []
  );
  const [notes, setNotes] = useState(video.thumbnail_notes || "");
  const [validated, setValidated] = useState(video.thumbnail_validated || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      thumbnail_images: thumbnails, 
      thumbnail_notes: notes, 
      thumbnail_validated: validated 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Propositions de miniature (A/B test conseillé)</Label>
        <p className="text-xs text-muted-foreground">Uploadez jusqu'à 3 variantes pour tester celle qui génère le plus de clics.</p>
        <ImageUploader images={thumbnails} onChange={setThumbnails} maxImages={3} label="Uploader vos miniatures (1280×720px)" />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Instructions pour le designer</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Texte max 3 mots, couleurs vives (rouge/jaune), visage expressif, contraste fort, format 1280×720..."
          className="min-h-[120px] bg-[#0f0f13] border-border/80 text-white rounded-xl resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0f0f13] border border-border/70 rounded-xl">
        <div className="flex items-center gap-3">
          <Checkbox
            id="thumb-valid"
            checked={validated}
            onCheckedChange={(c) => setValidated(!!c)}
            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
          />
          <Label htmlFor="thumb-valid" className="text-sm font-semibold text-white cursor-pointer">
            Miniature validée — passer au SEO
          </Label>
        </div>
        <Button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl px-5"
        >
          <Save className="mr-1.5 h-4 w-4" />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
