"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function VoiceoverPanel({ video, onSave, saving }: any) {
  const [type, setType] = useState(video.voiceover_type || "IA");
  const [narrator, setNarrator] = useState(video.voiceover_narrator || "");
  const [links, setLinks] = useState(video.voiceover_links || "");
  const [notes, setNotes] = useState(video.voiceover_notes || "");
  const [validated, setValidated] = useState(video.voiceover_validated || false);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-bold text-white">Type de voix</Label>
          <div className="flex gap-2">
            {["IA", "Humain"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                  type === t
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-300"
                    : "bg-[#0f0f13] border-border/70 text-muted-foreground hover:text-white"
                }`}
              >
                {t === "IA" ? "🤖 IA" : "🎙️ Humain"}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-bold text-white">Narrateur / Voix</Label>
          <Input
            value={narrator}
            onChange={(e) => setNarrator(e.target.value)}
            placeholder="ElevenLabs 'Adam', Murf.ai, Prénom..."
            className="h-11 bg-[#0f0f13] border-border/80 text-white rounded-xl focus-visible:ring-purple-500/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Lien vers le fichier audio</Label>
        <Input
          value={links}
          onChange={(e) => setLinks(e.target.value)}
          placeholder="https://drive.google.com/... ou Dropbox..."
          className="h-11 bg-[#0f0f13] border-border/80 text-white rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Notes de direction</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Rythme, prononciation, émotions, moments de silence..."
          className="min-h-[120px] bg-[#0f0f13] border-border/80 text-white rounded-xl resize-none"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-[#0f0f13] border border-border/70 rounded-xl">
        <div className="flex items-center gap-3">
          <Checkbox
            id="vo-valid"
            checked={validated}
            onCheckedChange={(c) => setValidated(!!c)}
            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
          />
          <Label htmlFor="vo-valid" className="text-sm font-semibold text-white cursor-pointer">
            Voix Off validée — passer au Montage
          </Label>
        </div>
        <Button
          onClick={() => onSave({ voiceover_type: type, voiceover_narrator: narrator, voiceover_links: links, voiceover_notes: notes, voiceover_validated: validated })}
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
