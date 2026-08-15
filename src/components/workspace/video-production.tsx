"use client";

import { useState } from "react";
import {
  Lightbulb, FileText, Mic, Scissors, Music,
  Image as ImageIcon, Search, UploadCloud,
  CheckCircle2, Circle, ChevronRight, Save,
} from "lucide-react";
import { updateVideoStage } from "@/app/workspace/actions-video";
import { IdeaPanel } from "./panels/idea-panel";
import { ScriptPanel } from "./panels/script-panel";
import { VoiceoverPanel } from "./panels/voiceover-panel";
import { EditingPanel } from "./panels/editing-panel";
import { MusicPanel } from "./panels/music-panel";
import { ThumbnailPanel } from "./panels/thumbnail-panel";
import { SeoPanel } from "./panels/seo-panel";
import { UploadPanel } from "./panels/upload-panel";

export const STAGES = [
  { id: "idea", label: "Idée", icon: Lightbulb, validateKey: "idea_validated", color: "#F59E0B" },
  { id: "script", label: "Script", icon: FileText, validateKey: "script_validated", color: "#3B82F6" },
  { id: "voiceover", label: "Voix Off", icon: Mic, validateKey: "voiceover_validated", color: "#A855F7" },
  { id: "editing", label: "Montage", icon: Scissors, validateKey: "editing_validated", color: "#EF4444" },
  { id: "music", label: "Musique", icon: Music, validateKey: "music_validated", color: "#10B981" },
  { id: "thumbnail", label: "Miniature", icon: ImageIcon, validateKey: "thumbnail_validated", color: "#06B6D4" },
  { id: "seo", label: "SEO", icon: Search, validateKey: "seo_validated", color: "#F97316" },
  { id: "upload", label: "Publication", icon: UploadCloud, validateKey: "upload_validated", color: "#FF0000" },
] as const;

type StageId = typeof STAGES[number]["id"];

const PANELS: Record<StageId, React.ComponentType<any>> = {
  idea: IdeaPanel,
  script: ScriptPanel,
  voiceover: VoiceoverPanel,
  editing: EditingPanel,
  music: MusicPanel,
  thumbnail: ThumbnailPanel,
  seo: SeoPanel,
  upload: UploadPanel,
};

export function VideoProduction({ video, workspaceId }: { video: any; workspaceId: string }) {
  const [activeStage, setActiveStage] = useState<StageId>("idea");
  const [localVideo, setLocalVideo] = useState(video);
  const [saving, setSaving] = useState(false);
  const [savedStage, setSavedStage] = useState<string | null>(null);

  const validatedCount = STAGES.filter((s) => localVideo[s.validateKey]).length;
  const progress = Math.round((validatedCount / STAGES.length) * 100);

  const handleSave = async (stageId: StageId, updates: Record<string, unknown>) => {
    setSaving(true);
    const merged = { ...localVideo, ...updates };
    setLocalVideo(merged);
    await updateVideoStage(video.id, workspaceId, updates);
    setSaving(false);
    setSavedStage(stageId);
    setTimeout(() => setSavedStage(null), 2500);
  };

  const ActivePanel = PANELS[activeStage];
  const activeStageData = STAGES.find((s) => s.id === activeStage)!;

  return (
    <div className="flex-1 min-h-0 flex gap-6 overflow-hidden">
      {/* LEFT SIDEBAR — Stage Navigator */}
      <aside className="w-56 shrink-0 flex flex-col gap-1 overflow-y-auto custom-scrollbar pr-2">
        {/* Progress Summary */}
        <div className="mb-4 p-4 glass rounded-2xl border-border/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Progression</span>
            <span className="text-sm font-black text-white font-mono">{progress}%</span>
          </div>
          <div className="h-2 w-full bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(3, progress)}%` }}
            />
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {validatedCount} / {STAGES.length} étapes validées
          </div>
        </div>

        {/* Stage list */}
        {STAGES.map((stage, idx) => {
          const isValidated = localVideo[stage.validateKey];
          const isActive = activeStage === stage.id;
          const Icon = stage.icon;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(stage.id)}
              className={`group w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                isActive
                  ? "glass border-border/20 shadow-lg shadow-black/20 translate-x-1"
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              {/* Step number / check */}
              <div
                className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  isValidated
                    ? "bg-emerald-500/15 text-emerald-400"
                    : isActive
                    ? "text-white"
                    : "text-muted-foreground"
                }`}
                style={isActive && !isValidated ? { backgroundColor: `${stage.color}18`, color: stage.color } : {}}
              >
                {isValidated ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className={`text-sm font-semibold leading-tight truncate transition-colors ${
                  isActive ? "text-white" : isValidated ? "text-emerald-400" : "text-muted-foreground group-hover:text-white"
                }`}>
                  {stage.label}
                </div>
                <div className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">Étape {idx + 1}</div>
              </div>

              {isActive && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            </button>
          );
        })}
      </aside>

      {/* RIGHT — Active Panel */}
      <main className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden glass border-border/10 rounded-2xl shadow-2xl relative">
        {/* Panel Header */}
        <div className="shrink-0 flex items-center justify-between px-7 py-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${activeStageData.color}18` }}
            >
              <activeStageData.icon className="h-5 w-5" style={{ color: activeStageData.color }} />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-lg leading-tight">{activeStageData.label}</h2>
              <p className="text-xs text-muted-foreground">
                {localVideo[activeStageData.validateKey]
                  ? "✓ Étape validée"
                  : "En cours de production"}
              </p>
            </div>
          </div>

          {/* Save state indicator */}
          <div className="flex items-center gap-3">
            {saving && (
              <span className="text-xs text-muted-foreground animate-pulse">Enregistrement...</span>
            )}
            {savedStage === activeStage && !saving && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Enregistré
              </span>
            )}
          </div>
        </div>

        {/* Panel Content — Scrollable */}
        <div 
          key={activeStage} 
          className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-7 py-6 animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both"
        >
          <ActivePanel
            video={localVideo}
            onSave={(updates: Record<string, unknown>) => handleSave(activeStage, updates)}
            saving={saving}
          />
        </div>
      </main>
    </div>
  );
}
