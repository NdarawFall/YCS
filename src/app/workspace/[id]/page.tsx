import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { KanbanBoard } from "@/components/workspace/kanban-board";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch videos for this workspace
  const { data: videos } = await supabase
    .from("videos")
    .select("*")
    .eq("workspace_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
      <KanbanBoard videos={videos || []} workspaceId={id} />
    </div>
  );
}
