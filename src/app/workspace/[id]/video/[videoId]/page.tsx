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
      {/* Main Production Interface with Unified Top Header */}
      <VideoProduction
        video={video}
        workspaceId={workspaceId}
        workspaceName={workspace?.name || "Workspace"}
      />
    </div>
  );
}
