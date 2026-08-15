import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, LayoutTemplate, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CreateWorkspaceDialog } from "@/components/dashboard/create-workspace-dialog";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch workspaces
  const { data: workspaces } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vos Workspaces</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos chaînes YouTube et vos vidéos.
          </p>
        </div>
        <CreateWorkspaceDialog />
      </div>

      {!workspaces || workspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl border-border/60 bg-muted/5 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <LayoutTemplate className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Aucun workspace</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Vous n'avez pas encore créé de workspace. Commencez par ajouter votre première chaîne YouTube.
          </p>
          <CreateWorkspaceDialog />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Card key={workspace.id} className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/50">
              <Link href={`/workspace/${workspace.id}`} className="absolute inset-0 z-10">
                <span className="sr-only">Voir {workspace.name}</span>
              </Link>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-3">
                    <VideoIcon className="h-5 w-5" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 z-20 relative">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-xl line-clamp-1">{workspace.name}</CardTitle>
                <CardDescription className="line-clamp-1">Niche : {workspace.niche}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-2 text-xs text-muted-foreground border-t bg-muted/10">
                Créé {formatDistanceToNow(new Date(workspace.created_at), { addSuffix: true, locale: fr })}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function VideoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 8-6 4 6 4V8Z" />
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
    </svg>
  );
}
