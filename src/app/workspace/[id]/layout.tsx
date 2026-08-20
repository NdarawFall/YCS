import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateVideoDialog } from "@/components/workspace/create-video-dialog";
import { UserNav } from "@/components/dashboard/user-nav";
import { LogoMark } from "@/components/ui/logo";
import { MobileGuard } from "@/components/mobile-guard";
import { BackgroundGradient } from "@/components/ui/background-gradient";

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
    .select("full_name, avatar_url, plan")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Créateur";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined;
  const plan = profile?.plan || 'free';

  return (
    <MobileGuard>
      <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#0b0b0d] relative">
        <BackgroundGradient />
        {/* Top Navbar */}
        <header className="h-16 shrink-0 border-b border-border/50 bg-[#101014]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-30">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Link 
              href="/dashboard" 
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
              title="Retour au tableau de bord"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="h-5 w-px bg-border/60 shrink-0 hidden sm:block" />

            <div className="flex items-center gap-3 min-w-0">
              {/* Marvid brand mark */}
              <LogoMark size="sm" className="hidden sm:flex" />
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-white text-sm sm:text-base leading-tight truncate">{workspace.name}</span>
                <span className="hidden sm:inline-flex rounded-full bg-red-600/15 text-red-400 border border-red-600/25 px-2.5 py-0.5 text-xs font-semibold shrink-0">
                  {workspace.niche}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <CreateVideoDialog workspaceId={id} />
            <div className="h-5 w-px bg-border/60 hidden sm:block" />
            <UserNav 
              user={{
                email: user.email,
                fullName,
                avatarUrl,
                plan,
              }} 
            />
          </div>
        </header>

        {/* Main Workspace Area */}
        <main className="flex-1 min-h-0 overflow-hidden flex flex-col p-3 sm:p-4">
          {children}
        </main>
      </div>
    </MobileGuard>
  );
}
