import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Users, User } from "lucide-react";
import { VideoProduction } from "@/components/workspace/video-production";
import { DeleteVideoButton } from "@/components/workspace/delete-video-button";

export default async function VideoPage({
  params,
}: {
  params: Promise<{ id: string; videoId: string }>;
}) {
  const { id: workspaceId, videoId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: video } = await supabase
    .from("videos")
    .select("*")
    .eq("id", videoId)
    .single();

  if (!video) redirect(`/workspace/${workspaceId}`);

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("name, niche")
    .eq("id", workspaceId)
    .single();

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Page Header */}
      <div className="shrink-0 flex items-center justify-between gap-4 pb-5 border-b border-border/50 mb-6">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            href={`/workspace/${workspaceId}`}
            className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-white hover:bg-white/8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-muted-foreground font-medium truncate">{workspace?.name}</span>
              <span className="text-muted-foreground/40 text-xs">›</span>
              <span className="text-xs text-muted-foreground font-medium">Vidéos</span>
            </div>
            <h1 className="text-xl font-extrabold text-white leading-tight truncate">{video.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {video.is_team_mode ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Users className="h-3.5 w-3.5" /> Équipe
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-border text-muted-foreground">
              <User className="h-3.5 w-3.5" /> Solo
            </span>
          )}
          <DeleteVideoButton videoId={videoId} workspaceId={workspaceId} />
        </div>
      </div>

      {/* Main Production Interface */}
      <VideoProduction video={video} workspaceId={workspaceId} />
    </div>
  );
}
