import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Tv, Sparkles, ArrowRight, Video } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CreateWorkspaceDialog } from "@/components/dashboard/create-workspace-dialog";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

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
            Vos Chaînes & Workspaces
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sélectionnez une chaîne pour accéder à son tableau de bord de production Kanban.
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
          
          {/* YouTube-like stylized icon */}
          <div className="flex h-16 w-20 items-center justify-center rounded-2xl bg-[#FF0000] text-white shadow-xl shadow-red-600/30 mb-6 group-hover:scale-105 transition-transform">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 fill-current translate-x-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-white mb-2">Aucune chaîne enregistrée</h3>
          <p className="text-muted-foreground mb-8 max-w-md text-sm leading-relaxed">
            Vous n'avez pas encore configuré de chaîne YouTube. Créez votre premier workspace pour commencer à planifier et produire vos vidéos en équipe ou en solo.
          </p>

          {/* Bouton d'action principal unique */}
          <CreateWorkspaceDialog buttonText="Créer ma première chaîne" variant="hero" />
        </div>
      ) : (
        /* Grid des Workspaces */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace: any) => {
            const videoCount = workspace.videos?.[0]?.count || 0;

            return (
              <Card 
                key={workspace.id} 
                className="group relative overflow-hidden bg-[#141418] border-border/70 hover:border-red-600/60 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-600/10 rounded-2xl"
              >
                <Link href={`/workspace/${workspace.id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">Ouvrir {workspace.name}</span>
                </Link>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    {/* YouTube Channel Icon */}
                    <div className="flex h-12 w-14 items-center justify-center rounded-xl bg-[#FF0000] text-white shadow-md shadow-red-600/25 group-hover:scale-105 transition-transform">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 fill-current translate-x-0.5">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>

                    <span className="inline-flex items-center rounded-full bg-red-600/10 border border-red-600/20 px-2.5 py-0.5 text-xs font-semibold text-red-400">
                      {workspace.niche}
                    </span>
                  </div>

                  <div className="mt-4">
                    <CardTitle className="text-xl font-bold text-white line-clamp-1 group-hover:text-red-400 transition-colors">
                      {workspace.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <Video className="h-3.5 w-3.5 text-red-500" />
                      {videoCount} vidéo{videoCount > 1 ? "s" : ""} en cours
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardFooter className="pt-3 pb-3 text-xs text-muted-foreground border-t border-border/40 bg-[#101014]/60 flex items-center justify-between">
                  <span>Créé {formatDistanceToNow(new Date(workspace.created_at), { addSuffix: true, locale: fr })}</span>
                  <span className="text-red-500 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Ouvrir <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
