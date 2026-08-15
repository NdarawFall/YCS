import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CreateWorkspaceDialog } from "@/components/dashboard/create-workspace-dialog";
import { WorkspaceCard } from "@/components/dashboard/workspace-card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch workspaces with videos count
  const { data: workspaces } = await supabase
    .from("workspaces")
    .select(`
      *,
      videos:videos(count)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const hasWorkspaces = workspaces && workspaces.length > 0;

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Vos Chaînes YouTube
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez vos productions vidéos étape par étape dans chaque chaîne.
          </p>
        </div>

        {/* Bouton unique dans le header UNIQUEMENT si au moins un workspace existe */}
        {hasWorkspaces && (
          <div>
            <CreateWorkspaceDialog buttonText="Nouvelle Chaîne" />
          </div>
        )}
      </div>

      {/* Content Area */}
      {!hasWorkspaces ? (
        /* Empty State UX : Point d'action unique au centre */
        <div className="flex flex-col items-center justify-center p-12 md:p-16 border border-dashed rounded-3xl border-red-500/30 bg-[#141418]/60 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-red-600/5 via-transparent to-transparent pointer-events-none" />
          
          {/* YouTube 4-box Menu Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF0000] text-white shadow-xl shadow-red-600/30 mb-6 group-hover:scale-105 transition-transform">
            <div className="grid grid-cols-2 gap-1.5 p-1">
              <div className="w-2.5 h-2.5 bg-white rounded-xs" />
              <div className="w-2.5 h-2.5 bg-white rounded-xs" />
              <div className="w-2.5 h-2.5 bg-white rounded-xs" />
              <div className="w-2.5 h-2.5 bg-white rounded-xs" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">Aucune chaîne configurée</h3>
          <p className="text-muted-foreground mb-8 max-w-md text-sm leading-relaxed">
            Créez votre première chaîne YouTube pour commencer à structurer et produire vos vidéos avec le tableau Kanban.
          </p>

          {/* Bouton d'action principal unique */}
          <CreateWorkspaceDialog buttonText="Créer ma première chaîne" variant="hero" />
        </div>
      ) : (
        /* Grid des Workspaces */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace: any) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      )}
    </div>
  );
}
