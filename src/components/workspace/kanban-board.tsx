"use client";

import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, User as UserIcon } from "lucide-react";
import { VideoSheet } from "./video-sheet";

const STAGES = [
  { id: "idea", label: "Idées", validateKey: "idea_validated" },
  { id: "script", label: "Script", validateKey: "script_validated" },
  { id: "voiceover", label: "Voix off", validateKey: "voiceover_validated" },
  { id: "editing", label: "Montage", validateKey: "editing_validated" },
  { id: "music", label: "Musique", validateKey: "music_validated" },
  { id: "thumbnail", label: "Miniature", validateKey: "thumbnail_validated" },
  { id: "seo", label: "SEO", validateKey: "seo_validated" },
  { id: "upload", label: "Upload", validateKey: "upload_validated" },
];

function getActiveStage(video: any) {
  for (const stage of STAGES) {
    if (!video[stage.validateKey]) {
      return stage.id;
    }
  }
  return "upload"; // Si tout est validé, on le laisse dans Upload ou on crée une colonne Terminé
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
      <ScrollArea className="flex-1 w-full whitespace-nowrap rounded-md">
        <div className="flex h-full w-max gap-4 pb-4">
          {columns.map((col) => (
            <div key={col.id} className="flex flex-col w-80 shrink-0 h-[calc(100vh-10rem)] bg-muted/30 rounded-xl border border-border/40">
              <div className="p-3 border-b border-border/40 flex items-center justify-between bg-background/40 backdrop-blur-sm rounded-t-xl sticky top-0 z-10">
                <h3 className="font-semibold text-sm">{col.label}</h3>
                <Badge variant="secondary" className="px-1.5 min-w-[20px] justify-center">
                  {col.videos.length}
                </Badge>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-3 flex flex-col gap-3">
                  {col.videos.map((video) => (
                    <Card 
                      key={video.id} 
                      className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <CardContent className="p-3">
                        <h4 className="font-medium text-sm line-clamp-2 mb-2">{video.title}</h4>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {video.is_team_mode ? (
                              <Badge variant="outline" className="h-5 px-1 py-0 text-[10px] gap-1"><Users className="h-3 w-3" /> Équipe</Badge>
                            ) : (
                              <Badge variant="outline" className="h-5 px-1 py-0 text-[10px] gap-1"><UserIcon className="h-3 w-3" /> Solo</Badge>
                            )}
                          </div>
                          <Clock className="h-3 w-3" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {col.videos.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                      Aucune vidéo
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ))}
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
