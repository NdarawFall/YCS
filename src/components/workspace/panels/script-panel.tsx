"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function ScriptPanel({ video, onSave, saving }: any) {
  const [content, setContent] = useState(video.script_content || "");
  const [notes, setNotes] = useState(video.script_notes || "");
  const [validated, setValidated] = useState(video.script_validated || false);

  const words = content.trim() === "" ? 0 : content.trim().split(/\s+/).filter((w: string) => w.length > 0).length;

  // 130 wpm = comfortable narration pace (YouTube standard ~120-140 wpm)
  const totalSeconds = Math.round((words / 130) * 60);
  const durationLabel = words === 0
    ? "--"
    : totalSeconds < 60
    ? `~${totalSeconds}s`
    : totalSeconds % 60 === 0
    ? `~${Math.floor(totalSeconds / 60)}mn`
    : `~${Math.floor(totalSeconds / 60)}mn${totalSeconds % 60}s`;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex gap-4">
        {[
          { label: "Mots", value: words, color: "text-white" },
          { label: "Durée estimée", value: durationLabel, color: "text-blue-400" },
          { label: "Caractères", value: content.length, color: "text-muted-foreground" },
        ].map((stat) => (
          <div key={stat.label} className="flex-1 p-4 bg-[#0f0f13] border border-border/70 rounded-xl">
            <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
            <div className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Texte du script</Label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez votre script complet ici. [INTRO] Bonjour et bienvenue sur..."
          className="min-h-[280px] bg-[#0f0f13] border-border/80 text-white rounded-xl text-sm font-mono leading-relaxed focus-visible:ring-blue-500/50 resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Notes pour la voix off & le monteur</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Ex: Ton énergique en intro, pause dramatique à 1:30, insérer b-roll 'bureau setup' à 2:00..."
          className="min-h-[100px] bg-[#0f0f13] border-border/80 text-white rounded-xl text-sm focus-visible:ring-blue-500/50 resize-none"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-[#0f0f13] border border-border/70 rounded-xl">
        <div className="flex items-center gap-3">
          <Checkbox
            id="script-valid"
            checked={validated}
            onCheckedChange={(c) => setValidated(!!c)}
            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
          />
          <Label htmlFor="script-valid" className="text-sm font-semibold text-white cursor-pointer">
            Script validé — passer à la Voix Off
          </Label>
        </div>
        <Button
          onClick={() => onSave({ script_content: content, script_notes: notes, script_validated: validated })}
          disabled={saving}
          className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl px-5 shadow-md shadow-red-600/20"
        >
          <Save className="mr-1.5 h-4 w-4" />
          {saving ? "..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
