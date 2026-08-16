"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, ExternalLink, CheckCircle2 } from "lucide-react";

export function UploadPanel({ video, onSave, saving }: any) {
  const [status, setStatus] = useState(video.upload_status || "Pas encore");
  const [url, setUrl] = useState(video.upload_url || "");
  const [notes, setNotes] = useState(video.upload_notes || "");
  const [validated, setValidated] = useState(video.upload_validated || false);

  const statusConfig = {
    "Pas encore": { label: "En production", color: "bg-amber-500/10 border-amber-500/30 text-amber-400" },
    "Programmé": { label: "Programmé", color: "bg-blue-500/10 border-blue-500/30 text-blue-400" },
    "Publié": { label: "Publié ✓", color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" },
  } as const;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Status Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Statut de publication</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {(Object.keys(statusConfig) as Array<keyof typeof statusConfig>).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`py-2.5 px-3 sm:py-3 sm:px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                status === s ? statusConfig[s].color : "bg-[#0f0f13] border-border/70 text-muted-foreground hover:text-white"
              }`}
            >
              {statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* YouTube URL */}
      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">URL de la vidéo YouTube</Label>
        <div className="flex gap-2">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://youtu.be/xxxxxxxxxxx"
            className="flex-1 h-12 bg-[#0f0f13] border-border/80 text-white rounded-xl text-xs sm:text-sm"
          />
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 border border-red-600/20 text-red-400 hover:bg-red-600/20 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Notes post-publication</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Premier commentaire épinglé, carte à ajouter, playlists, partage sur les réseaux..."
          className="min-h-[120px] bg-[#0f0f13] border-border/80 text-white rounded-xl resize-none"
        />
      </div>

      {/* Final validation — most prominent CTA */}
      {!validated ? (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600/10 to-red-600/5 border border-red-600/30 rounded-2xl space-y-3">
          <p className="text-sm text-white font-semibold">🎉 Dernière étape — Marquer comme terminée</p>
          <p className="text-xs text-muted-foreground">Cochez uniquement quand la vidéo est live sur YouTube et tout le post-pub est fait.</p>
          <div className="flex items-center gap-3 pt-1">
            <Checkbox
              id="up-valid"
              checked={validated}
              onCheckedChange={(c) => setValidated(!!c)}
              className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
            />
            <Label htmlFor="up-valid" className="text-sm font-semibold text-white cursor-pointer">
              Vidéo publiée et terminée
            </Label>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
          <div>
            <p className="text-sm font-bold text-emerald-400">Vidéo terminée & publiée !</p>
            <p className="text-xs text-muted-foreground mt-0.5">Cette vidéo est complète dans votre pipeline.</p>
          </div>
          <button
            type="button"
            onClick={() => setValidated(false)}
            className="ml-auto text-xs text-muted-foreground hover:text-white underline cursor-pointer"
          >
            Annuler
          </button>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => onSave({ upload_status: status, upload_url: url, upload_notes: notes, upload_validated: validated })}
          disabled={saving}
          className="w-full sm:w-auto bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-xl px-6 py-2.5 shadow-md shadow-red-600/20"
        >
          <Save className="mr-1.5 h-4 w-4" />
          {saving ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
}
