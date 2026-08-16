import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { VideoProduction } from "@/components/workspace/video-production";

export default async function VideoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; videoId: string }>;
  searchParams: Promise<{ stage?: string }>;
}) {
  const { id: workspaceId, videoId } = await params;
  const { stage } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: video } = await supabase
    .from("videos")
    .select("id, title, idea_validated, script_validated, voiceover_validated, editing_validated, music_validated, thumbnail_validated, seo_validated, upload_validated, is_team_mode, thumbnail_images, thumbnail_notes")
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
      {/* Main Production Interface with Unified Top Header */}
      <VideoProduction
        video={video}
        workspaceId={workspaceId}
        workspaceName={workspace?.name || "Workspace"}
        initialStage={stage}
      />
    </div>
  );
}
