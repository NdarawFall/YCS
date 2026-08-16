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
      {/* Page Header — Compact Single Line */}
      <div className="shrink-0 flex items-center justify-between gap-3 pb-3 border-b border-border/50 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <Link
            href={`/workspace/${workspaceId}`}
            className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:text-white hover:bg-white/8 transition-colors"
            title="Retour à la liste des vidéos"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex items-center gap-2 min-w-0 text-sm">
            <span className="text-muted-foreground font-medium truncate max-w-[120px] sm:max-w-[200px]">{workspace?.name}</span>
            <span className="text-muted-foreground/40 text-xs shrink-0">›</span>
            <span className="text-muted-foreground font-medium shrink-0 hidden sm:inline">Vidéos</span>
            <span className="text-muted-foreground/40 text-xs shrink-0 hidden sm:inline">›</span>
            <h1 className="font-extrabold text-white text-base sm:text-lg leading-tight truncate">{video.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {video.is_team_mode ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Users className="h-3.5 w-3.5" /> Équipe
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-border text-muted-foreground">
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
