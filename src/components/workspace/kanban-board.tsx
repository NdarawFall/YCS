"use client";

import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  Users, 
  User as UserIcon, 
  Lightbulb, 
  FileText, 
  Mic, 
  Scissors, 
  Music, 
  Image as ImageIcon, 
  Search, 
  UploadCloud,
  CheckCircle2
} from "lucide-react";
import { VideoSheet } from "./video-sheet";

const STAGES = [
  { id: "idea", label: "Idées", icon: Lightbulb, validateKey: "idea_validated" },
  { id: "script", label: "Script", icon: FileText, validateKey: "script_validated" },
  { id: "voiceover", label: "Voix off", icon: Mic, validateKey: "voiceover_validated" },
  { id: "editing", label: "Montage", icon: Scissors, validateKey: "editing_validated" },
  { id: "music", label: "Musique", icon: Music, validateKey: "music_validated" },
  { id: "thumbnail", label: "Miniature", icon: ImageIcon, validateKey: "thumbnail_validated" },
  { id: "seo", label: "SEO", icon: Search, validateKey: "seo_validated" },
  { id: "upload", label: "Upload", icon: UploadCloud, validateKey: "upload_validated" },
];

function getActiveStage(video: any) {
  for (const stage of STAGES) {
    if (!video[stage.validateKey]) {
      return stage.id;
    }
  }
  return "upload";
}

export function KanbanBoard({ videos, workspaceId }: { videos: any[]; workspaceId: string }) {
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);

  // Group videos by active stage
  const columns = STAGES.map((stage) => {
    const stageVideos = videos.filter((v) => getActiveStage(v) === stage.id);
    return { ...stage, videos: stageVideos };
  });

  return (
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 w-full whitespace-nowrap rounded-2xl">
        <div className="flex h-full w-max gap-4 pb-4">
          {columns.map((col) => {
            const Icon = col.icon;
            const hasVideos = col.videos.length > 0;

            return (
              <div 
                key={col.id} 
                className="flex flex-col w-80 shrink-0 h-[calc(100vh-8.5rem)] bg-[#141418]/80 rounded-2xl border border-border/60 shadow-lg shadow-black/20"
              >
                {/* Column Header */}
                <div className="p-3.5 border-b border-border/50 flex items-center justify-between bg-[#18181f]/90 backdrop-blur-md rounded-t-2xl sticky top-0 z-10">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-600/15 text-red-500">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-bold text-sm text-white">{col.label}</h3>
                  </div>

                  <span className={`inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full text-xs font-bold ${hasVideos ? "bg-red-600 text-white" : "bg-muted text-muted-foreground"}`}>
                    {col.videos.length}
                  </span>
                </div>
                
                {/* Column Cards Body */}
                <ScrollArea className="flex-1">
                  <div className="p-3 flex flex-col gap-3">
                    {col.videos.map((video) => (
                      <Card 
                        key={video.id} 
                        className="cursor-pointer bg-[#1a1a22] border-border/70 hover:border-red-600/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-600/10 rounded-xl group"
                        onClick={() => setSelectedVideo(video)}
                      >
                        <CardContent className="p-3.5">
                          {/* Thumbnail preview if any */}
                          {video.thumbnail_images && video.thumbnail_images.length > 0 && (
                            <div className="aspect-video w-full rounded-lg overflow-hidden mb-2.5 border border-border/40 bg-black/40">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img 
                                src={video.thumbnail_images[0]} 
                                alt={video.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                          )}

                          <h4 className="font-bold text-sm text-white line-clamp-2 mb-3 leading-snug group-hover:text-red-400 transition-colors">
                            {video.title}
                          </h4>

                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
                            <div className="flex items-center gap-1.5">
                              {video.is_team_mode ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground border border-border/60 text-[11px] font-medium">
                                  <Users className="h-3 w-3 text-red-500" /> Équipe
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground border border-border/60 text-[11px] font-medium">
                                  <UserIcon className="h-3 w-3 text-white" /> Solo
                                </span>
                              )}
                            </div>

                            {/* Completed Status Check */}
                            {video.upload_validated ? (
                              <span className="text-emerald-400 flex items-center gap-1 text-[11px] font-semibold">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Publié
                              </span>
                            ) : (
                              <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                                <Clock className="h-3 w-3 text-red-500" /> En cours
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {!hasVideos && (
                      <div className="h-24 border border-dashed border-border/40 rounded-xl flex items-center justify-center text-xs text-muted-foreground/60">
                        Aucune vidéo à cette étape
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <VideoSheet 
        video={selectedVideo} 
        open={!!selectedVideo} 
        onOpenChange={(open: boolean) => !open && setSelectedVideo(null)} 
        workspaceId={workspaceId}
      />
    </div>
  );
}
