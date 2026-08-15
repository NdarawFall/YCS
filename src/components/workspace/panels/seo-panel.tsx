"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function SeoPanel({ video, onSave, saving }: any) {
  const [title, setTitle] = useState(video.seo_title || "");
  const [desc, setDesc] = useState(video.seo_description || "");
  const [notes, setNotes] = useState(video.seo_notes || "");
  const [validated, setValidated] = useState(video.seo_validated || false);

  const titleLen = title.length;
  const titleOk = titleLen >= 40 && titleLen <= 70;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold text-white">Titre YouTube définitif</Label>
          <span className={`text-xs font-mono px-2 py-0.5 rounded ${titleOk ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
            {titleLen} / 100 {titleOk ? "✓ Optimal" : "(40-70 idéal)"}
          </span>
        </div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="5 Habitudes Qui m'ont rendu Millionnaire à 25 Ans"
          className="h-12 bg-[#0f0f13] border-border/80 text-white text-base font-semibold rounded-xl focus-visible:ring-orange-500/50"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Description YouTube</Label>
        <Textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder={`Dans cette vidéo, je te révèle...\n\n⏱ CHAPITRES\n00:00 Introduction\n02:30 Habitude 1...\n\n🔗 LIENS\nInstagram: ...\nNewsletter: ...`}
          className="min-h-[220px] bg-[#0f0f13] border-border/80 text-white rounded-xl text-sm font-mono leading-relaxed resize-none focus-visible:ring-orange-500/50"
        />
        <p className="text-xs text-muted-foreground">{desc.length} caractères (max 5000)</p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Tags & Mots-clés</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="finance personnelle, investissement, liberté financière, argent, gagner de l'argent..."
          className="min-h-[80px] bg-[#0f0f13] border-border/80 text-white rounded-xl resize-none"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-[#0f0f13] border border-border/70 rounded-xl">
        <div className="flex items-center gap-3">
          <Checkbox
            id="seo-valid"
            checked={validated}
            onCheckedChange={(c) => setValidated(!!c)}
            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
          />
          <Label htmlFor="seo-valid" className="text-sm font-semibold text-white cursor-pointer">
            SEO validé — passer à la Publication
          </Label>
        </div>
        <Button
          onClick={() => onSave({ seo_title: title, seo_description: desc, seo_notes: notes, seo_validated: validated })}
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
