import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CreateWorkspaceDialog } from "@/components/dashboard/create-workspace-dialog";
import { WorkspaceCard } from "@/components/dashboard/workspace-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = 'force-dynamic';

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
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Gérez vos chaînes, productions et paramètres.
          </p>
        </div>
      </div>

      <Tabs defaultValue="workspaces" className="space-y-6">
        <TabsList className="bg-[#141418] border border-border/40">
          <TabsTrigger value="workspaces">Mes Chaînes</TabsTrigger>
          <TabsTrigger value="analytics" disabled>Analytiques (Bientôt)</TabsTrigger>
        </TabsList>

        <TabsContent value="workspaces" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Vos Workspaces</h2>
            {hasWorkspaces && <CreateWorkspaceDialog buttonText="Nouvelle Chaîne" />}
          </div>

          {/* Content Area */}
          {!hasWorkspaces ? (
            /* Empty State UX */
            <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-3xl border-red-500/30 glass text-center relative overflow-hidden">
              <h3 className="text-2xl font-bold text-white mb-2">Aucune chaîne configurée</h3>
              <p className="text-muted-foreground mb-8 max-w-md text-sm leading-relaxed">
                Créez votre première chaîne pour commencer.
              </p>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
