"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Lightbulb, FileText, Mic, Scissors, Music,
  Image as ImageIcon, Search, UploadCloud,
  CheckCircle2, ChevronRight, ArrowLeft, Users, User
} from "lucide-react";
import { updateVideoStage } from "@/app/workspace/actions-video";
import { DeleteVideoButton } from "@/components/workspace/delete-video-button";
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

export function VideoProduction({
  video,
  workspaceId,
  workspaceName,
  initialStage,
}: {
  video: any;
  workspaceId: string;
  workspaceName: string;
  initialStage?: string;
}) {
  const [activeStage, setActiveStageState] = useState<StageId>(() => {
    if (initialStage && STAGES.some((s) => s.id === initialStage)) {
      return initialStage as StageId;
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const stageParam = params.get("stage") as StageId | null;
      if (stageParam && STAGES.some((s) => s.id === stageParam)) {
        return stageParam;
      }
    }
    return "idea";
  });

  const setActiveStage = (stageId: StageId) => {
    setActiveStageState(stageId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("stage", stageId);
      window.history.replaceState(null, "", url.toString());
    }
  };
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
  const ActiveStageIcon = activeStageData.icon;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* UNIFIED TOP HEADER BAR
          Left: ← workspaceName › Vidéos › video.title
          Middle: Active Stage Icon + Name Badge (Script, Miniature, etc.)
          Right: Solo / Team Badge + Delete Button
      */}
      <div className="shrink-0 flex items-center justify-between gap-3 pb-3 border-b border-border/50 mb-3">
        {/* Left: Breadcrumbs & Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href={`/workspace/${workspaceId}`}
            className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-white hover:bg-white/8 transition-colors"
            title="Retour à la liste des vidéos"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2 min-w-0 text-sm">
            <span className="text-muted-foreground font-medium truncate max-w-[100px] sm:max-w-[180px]">{workspaceName}</span>
            <span className="text-muted-foreground/40 text-xs shrink-0">›</span>
            <span className="text-muted-foreground font-medium shrink-0 hidden sm:inline">Vidéos</span>
            <span className="text-muted-foreground/40 text-xs shrink-0 hidden sm:inline">›</span>
            <h1 className="font-extrabold text-white text-sm sm:text-base leading-tight truncate max-w-[120px] sm:max-w-[220px]">{localVideo.title}</h1>
          </div>
        </div>

        {/* Center: ACTIVE STAGE BADGE (Middle) */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-bold transition-all shadow-sm"
            style={{
              backgroundColor: `${activeStageData.color}18`,
              borderColor: `${activeStageData.color}40`,
              color: activeStageData.color,
            }}
          >
            <ActiveStageIcon className="h-3.5 w-3.5" />
            <span>{activeStageData.label}</span>
            {localVideo[activeStageData.validateKey] && (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-md font-semibold">
                ✓
              </span>
            )}
          </div>

          {saving && (
            <span className="text-xs text-muted-foreground animate-pulse hidden sm:inline">Enregistrement...</span>
          )}
          {savedStage === activeStage && !saving && (
            <span className="text-xs text-emerald-400 font-semibold hidden sm:inline-flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> Enregistré
            </span>
          )}
        </div>

        {/* Right: Mode & Delete */}
        <div className="flex items-center gap-2 shrink-0">
          {localVideo.is_team_mode ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Users className="h-3.5 w-3.5" /> Équipe
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-border text-muted-foreground">
              <User className="h-3.5 w-3.5" /> Solo
            </span>
          )}
          <DeleteVideoButton videoId={localVideo.id} workspaceId={workspaceId} />
        </div>
      </div>

      {/* WORKSPACE CONTENT AREA */}
      <div className="flex-1 min-h-0 flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden">
        {/* MOBILE ONLY — Top Horizontal Stage Bar */}
        <div className="md:hidden shrink-0 flex flex-col gap-2 glass p-3 rounded-2xl border-border/10">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Progression : {progress}%</span>
            <span className="text-[10px] text-emerald-400 font-semibold">{validatedCount}/{STAGES.length} validées</span>
          </div>
          <div className="h-1.5 w-full bg-white/8 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(3, progress)}%` }}
            />
          </div>
          {/* Horizontal Scrollable Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pt-1 pb-1">
            {STAGES.map((stage) => {
              const isValidated = localVideo[stage.validateKey];
              const isActive = activeStage === stage.id;
              const Icon = stage.icon;

              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => setActiveStage(stage.id)}
                  className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-red-600 text-white shadow-md shadow-red-600/30"
                      : isValidated
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                      : "bg-white/5 border border-white/8 text-muted-foreground hover:text-white"
                  }`}
                >
                  {isValidated ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Icon className="h-3.5 w-3.5" />}
                  <span>{stage.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* DESKTOP ONLY SIDEBAR — Stage Navigator */}
        <aside className="hidden md:flex md:w-44 shrink-0 flex-col gap-0 overflow-hidden">
          {/* Progress Summary — STICKY, never scrolls */}
          <div className="shrink-0 mb-3 p-3.5 glass rounded-2xl border-border/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider">Progression</span>
              <span className="text-sm font-black text-white font-mono">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(3, progress)}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] text-muted-foreground">
              {validatedCount} / {STAGES.length} étapes validées
            </div>
          </div>

          {/* Stage list — only this scrolls */}
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar flex flex-col gap-0.5 pr-1">
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
          </div>
        </aside>

        {/* RIGHT — Active Panel — FULL VERTICAL HEIGHT, NO TOP HEADER INSIDE */}
        <main className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden glass border-border/10 rounded-2xl shadow-2xl relative">
          <div 
            key={activeStage} 
            className="flex-1 min-h-0 overflow-y-auto custom-scrollbar px-4 py-4 sm:px-7 sm:py-6 animate-in fade-in duration-150"
          >
            <ActivePanel
              video={localVideo}
              onSave={(updates: Record<string, unknown>) => handleSave(activeStage, updates)}
              saving={saving}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
