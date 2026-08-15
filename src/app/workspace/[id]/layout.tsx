import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Video, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateVideoDialog } from "@/components/workspace/create-video-dialog";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // Fetch workspace info
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", id)
    .single();

  if (!workspace) redirect("/dashboard");

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-muted/10">
      <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Retour au dashboard</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20 text-primary">
              <Video className="h-3 w-3" />
            </div>
            <span className="font-semibold">{workspace.name}</span>
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {workspace.niche}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <CreateVideoDialog workspaceId={id} />
        </div>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        {children}
      </main>
    </div>
  );
}
