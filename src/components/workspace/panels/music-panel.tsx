"use client";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Plus, X } from "lucide-react";

interface Track { title: string; source: string }

export function MusicPanel({ video, onSave, saving }: any) {
  const [tracks, setTracks] = useState<Track[]>(
    Array.isArray(video.music_tracks) && video.music_tracks.length > 0
      ? video.music_tracks
      : []
  );
  const [notes, setNotes] = useState(video.music_notes || "");
  const [validated, setValidated] = useState(video.music_validated || false);

  const addTrack = () => setTracks([...tracks, { title: "", source: "" }]);
  const removeTrack = (i: number) => setTracks(tracks.filter((_, idx) => idx !== i));
  const updateTrack = (i: number, field: keyof Track, value: string) => {
    const updated = [...tracks];
    updated[i] = { ...updated[i], [field]: value };
    setTracks(updated);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold text-white">Pistes musicales</Label>
          <Button type="button" variant="outline" size="sm" onClick={addTrack} className="rounded-xl border-border/80 text-xs gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Ajouter une piste
          </Button>
        </div>

        {tracks.length === 0 && (
          <div className="py-8 text-center border border-dashed border-border/60 rounded-xl text-muted-foreground text-sm">
            Aucune piste ajoutée. Cliquez sur "Ajouter une piste".
          </div>
        )}

        {tracks.map((track, i) => (
          <div key={i} className="p-4 bg-[#0f0f13] border border-border/70 rounded-xl space-y-3 relative">
            <button
              type="button"
              onClick={() => removeTrack(i)}
              className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Titre de la piste</Label>
                <Input
                  value={track.title}
                  onChange={(e) => updateTrack(i, "title", e.target.value)}
                  placeholder="Epic Intro Music"
                  className="h-10 bg-[#141418] border-border text-white rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Source / Lien</Label>
                <Input
                  value={track.source}
                  onChange={(e) => updateTrack(i, "source", e.target.value)}
                  placeholder="Epidemic Sound, Artlist, YouTube..."
                  className="h-10 bg-[#141418] border-border text-white rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold text-white">Ambiance sonore souhaitée</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Énergie, genre musical, moments clés où changer de musique..."
          className="min-h-[100px] bg-[#0f0f13] border-border/80 text-white rounded-xl resize-none"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#0f0f13] border border-border/70 rounded-xl">
        <div className="flex items-center gap-3">
          <Checkbox
            id="music-valid"
            checked={validated}
            onCheckedChange={(c) => setValidated(!!c)}
            className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
          />
          <Label htmlFor="music-valid" className="text-sm font-semibold text-white cursor-pointer">
            Musique validée — passer à la Miniature
          </Label>
        </div>
        <Button
          onClick={() => onSave({ music_tracks: tracks, music_notes: notes, music_validated: validated })}
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
