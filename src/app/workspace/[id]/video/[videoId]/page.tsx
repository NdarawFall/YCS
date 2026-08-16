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
    .select(`
      id, title, is_team_mode, 
      idea_description, idea_notes, idea_validated,
      script_content, script_notes, script_validated,
      voiceover_type, voiceover_settings, voiceover_narrator, voiceover_links, voiceover_notes, voiceover_validated,
      editing_notes, editing_resources, editing_validated,
      music_tracks, music_notes, music_validated,
      thumbnail_images, thumbnail_notes, thumbnail_validated,
      seo_title, seo_variants, seo_description, seo_tags, seo_notes, seo_validated,
      upload_date, upload_status, upload_url, upload_notes, upload_validated
    `)
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
