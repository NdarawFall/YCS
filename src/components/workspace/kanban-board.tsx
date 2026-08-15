"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Lightbulb, 
  FileText, 
  Mic, 
  Scissors, 
  Music, 
  Image as ImageIcon, 
  Search, 
  UploadCloud,
  CheckCircle2,
  Trash2,
  ArrowRight,
  MoreVertical,
  ChevronRight,
  Users,
  User as UserIcon,
  PlayCircle
} from "lucide-react";
import { VideoSheet } from "./video-sheet";
import { deleteVideo, moveVideoToStage } from "@/app/workspace/actions-video";
import { Button } from "@/components/ui/button";

export const STAGES = [
  { id: "idea", num: "1", label: "Idée", icon: Lightbulb, color: "text-amber-400", bg: "bg-amber-400/10", validateKey: "idea_validated" },
  { id: "script", num: "2", label: "Script", icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10", validateKey: "script_validated" },
  { id: "voiceover", num: "3", label: "Voix Off", icon: Mic, color: "text-purple-400", bg: "bg-purple-400/10", validateKey: "voiceover_validated" },
  { id: "editing", num: "4", label: "Montage", icon: Scissors, color: "text-rose-400", bg: "bg-rose-400/10", validateKey: "editing_validated" },
  { id: "music", num: "5", label: "Musique", icon: Music, color: "text-emerald-400", bg: "bg-emerald-400/10", validateKey: "music_validated" },
  { id: "thumbnail", num: "6", label: "Miniature", icon: ImageIcon, color: "text-cyan-400", bg: "bg-cyan-400/10", validateKey: "thumbnail_validated" },
  { id: "seo", num: "7", label: "SEO", icon: Search, color: "text-orange-400", bg: "bg-orange-400/10", validateKey: "seo_validated" },
  { id: "upload", num: "8", label: "Publication", icon: UploadCloud, color: "text-red-500", bg: "bg-red-500/10", validateKey: "upload_validated" },
];

export function getActiveStage(video: any) {
  for (const stage of STAGES) {
    if (!video[stage.validateKey]) {
      return stage.id;
    }
  }
  return "upload";
}

export function getStageProgress(video: any) {
  let validatedCount = 0;
  for (const stage of STAGES) {
    if (video[stage.validateKey]) {
      validatedCount++;
    }
  }
  const percentage = Math.round((validatedCount / STAGES.length) * 100);
  return { validatedCount, total: STAGES.length, percentage };
}

export function KanbanBoard({ videos, workspaceId }: { videos: any[]; workspaceId: string }) {
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);

  // Group videos by active stage
  const columns = STAGES.map((stage) => {
    const stageVideos = videos.filter((v) => getActiveStage(v) === stage.id);
    return { ...stage, videos: stageVideos };
  });

  const handleDelete = async (e: React.MouseEvent, videoId: string) => {
    e.stopPropagation();
    if (!confirm("Voulez-vous vraiment supprimer cette vidéo ?")) return;
    setDeletingId(videoId);
    await deleteVideo(videoId, workspaceId);
    setDeletingId(null);
    if (selectedVideo?.id === videoId) setSelectedVideo(null);
  };

  const handleMove = async (e: React.MouseEvent, videoId: string, targetStageId: string) => {
    e.stopPropagation();
    setMovingId(videoId);
    await moveVideoToStage(videoId, targetStageId);
    setMovingId(null);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      {/* Kanban Board Horizontal Scrolling Canvas */}
      <div className="flex-1 min-h-0 flex gap-4 overflow-x-auto overflow-y-hidden pb-2 select-none">
        {columns.map((col, colIdx) => {
          const Icon = col.icon;
          const hasVideos = col.videos.length > 0;

          return (
            <div 
              key={col.id} 
              className="h-full min-h-0 flex flex-col w-[310px] shrink-0 bg-[#121217] rounded-2xl border border-border/60 shadow-md shadow-black/30 overflow-hidden"
            >
              {/* Column Header */}
              <div className="px-4 py-3 border-b border-border/50 bg-[#17171e] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${col.bg} ${col.color} font-bold text-xs shadow-xs`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white leading-tight flex items-center gap-1.5">
                      <span>{col.label}</span>
                      <span className="text-[11px] font-mono text-muted-foreground font-normal">#{col.num}</span>
                    </h3>
                  </div>
                </div>

                <span className={`inline-flex items-center justify-center h-5 min-w-[22px] px-1.5 rounded-full text-xs font-bold ${hasVideos ? "bg-red-600 text-white" : "bg-muted/80 text-muted-foreground"}`}>
                  {col.videos.length}
                </span>
              </div>
              
              {/* Column Content Scrollable Area */}
              <div className="flex-1 min-h-0 overflow-y-auto p-3 flex flex-col gap-3 custom-scrollbar">
                {col.videos.map((video) => {
                  const { percentage, validatedCount, total } = getStageProgress(video);
                  const isDeleting = deletingId === video.id;
                  const isMoving = movingId === video.id;

                  return (
                    <Card 
                      key={video.id} 
                      className={`group relative cursor-pointer bg-[#181820] hover:bg-[#1c1c26] border-border/80 hover:border-red-600/70 transition-all duration-150 hover:shadow-lg hover:shadow-red-600/10 rounded-xl overflow-hidden ${isDeleting || isMoving ? "opacity-50 pointer-events-none" : ""}`}
                      onClick={() => setSelectedVideo(video)}
                    >
                      <CardContent className="p-3.5 space-y-3">
                        {/* Thumbnail if uploaded */}
                        {video.thumbnail_images && video.thumbnail_images.length > 0 && (
                          <div className="aspect-video w-full rounded-lg overflow-hidden border border-border/40 bg-black/50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                              src={video.thumbnail_images[0]} 
                              alt={video.title} 
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                            />
                          </div>
                        )}

                        {/* Video Title */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-sm text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                            {video.title}
                          </h4>

                          {/* Quick Delete Button */}
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, video.id)}
                            className="text-muted-foreground hover:text-red-400 p-1 rounded-md hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                            title="Supprimer la vidéo"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                            <span>Progression</span>
                            <span className="text-white font-mono">{percentage}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-300"
                              style={{ width: `${Math.max(5, percentage)}%` }}
                            />
                          </div>
                        </div>

                        {/* Stage Mover Selector & Footer */}
                        <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
                          {/* Mode Badge */}
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                            {video.is_team_mode ? (
                              <span className="flex items-center gap-1 text-purple-400 font-medium">
                                <Users className="h-3 w-3" /> Équipe
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <UserIcon className="h-3 w-3" /> Solo
                              </span>
                            )}
                          </span>

                          {/* Fast Stage Shift Arrow */}
                          {colIdx < STAGES.length - 1 ? (
                            <button
                              type="button"
                              onClick={(e) => handleMove(e, video.id, STAGES[colIdx + 1].id)}
                              className="inline-flex items-center gap-1 px-2 py-0.8 rounded-lg bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white text-[11px] font-bold transition-colors cursor-pointer"
                              title={`Passer à l'étape suivante : ${STAGES[colIdx + 1].label}`}
                            >
                              <span>{STAGES[colIdx + 1].label}</span>
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          ) : (
                            <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Prêt
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {!hasVideos && (
                  <div className="h-28 border-2 border-dashed border-border/40 rounded-xl flex flex-col items-center justify-center text-xs text-muted-foreground/60 p-4 text-center">
                    <p className="font-medium">Aucune vidéo ici</p>
                    <p className="text-[10px] mt-1 text-muted-foreground/40">Faites glisser ou validez les étapes pour l'avancer</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Details Sheet Modal */}
      <VideoSheet 
        video={selectedVideo} 
        open={!!selectedVideo} 
        onOpenChange={(open: boolean) => !open && setSelectedVideo(null)} 
        workspaceId={workspaceId}
      />
    </div>
  );
}
