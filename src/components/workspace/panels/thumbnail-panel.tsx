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

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Propositions de miniature (A/B test conseillé)</Label>
        <p className="text-xs text-muted-foreground">Uploadez jusqu'à 3 variantes pour tester celle qui génère le plus de clics.</p>
        <ImageUploader images={thumbnails} onChange={setThumbnails} maxImages={3} label="Uploader vos miniatures (1280×720px)" />
      </div>

      {thumbnails.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {thumbnails.map((url, i) => (
            <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-border/60 bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Miniature ${i + 1}`} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 text-[10px] font-bold bg-black/70 text-white px-1.5 py-0.5 rounded">
                Option {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Instructions pour le designer</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Texte max 3 mots, couleurs vives (rouge/jaune), visage expressif, contraste fort, format 1280×720..."
          className="min-h-[120px] bg-[#0f0f13] border-border/80 text-white rounded-xl resize-none"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-[#0f0f13] border border-border/70 rounded-xl">
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
          onClick={() => onSave({ thumbnail_images: thumbnails, thumbnail_notes: notes, thumbnail_validated: validated })}
          disabled={saving}
          className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl px-5"
        >
          <Save className="mr-1.5 h-4 w-4" />
          {saving ? "..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
