import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateVideoDialog } from "@/components/workspace/create-video-dialog";
import { UserNav } from "@/components/dashboard/user-nav";

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

  // Fetch user profile from database
  const { data: profile } = await supabase
    .from("users")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Créateur";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#0b0b0d]">
      {/* Workspace Top Navigation Bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-[#101014]/90 backdrop-blur-md px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard" 
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            title="Retour aux workspaces"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="h-5 w-px bg-border/60" />

          <div className="flex items-center gap-2.5">
            {/* YouTube 4-box Menu Icon Badge */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF0000] text-white shadow-xs">
              <div className="grid grid-cols-2 gap-0.5 p-0.5">
                <div className="w-1 h-1 bg-white rounded-xs" />
                <div className="w-1 h-1 bg-white rounded-xs" />
                <div className="w-1 h-1 bg-white rounded-xs" />
                <div className="w-1 h-1 bg-white rounded-xs" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base leading-none">{workspace.name}</span>
                <span className="rounded-full bg-red-600/15 text-red-400 border border-red-600/25 px-2 py-0.2 text-[11px] font-semibold">
                  {workspace.niche}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CreateVideoDialog workspaceId={id} />
          <div className="h-5 w-px bg-border/60 hidden sm:block" />
          <UserNav 
            user={{
              email: user.email,
              fullName,
              avatarUrl,
            }} 
          />
        </div>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-hidden p-4 sm:p-6">
        {children}
      </main>
    </div>
  );
}
