import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { UserNav } from "@/components/dashboard/user-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Fetch user profile from database
  const { data: profile } = await supabase
    .from("users")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Créateur";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined;

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0b0d]">
      <header className="sticky top-0 z-40 flex h-18 shrink-0 items-center justify-between border-b border-border/50 bg-[#101014]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="flex items-center gap-6">
          <Logo size="md" />
        </div>

        <div className="flex items-center gap-4">
          <UserNav 
            user={{
              email: user.email,
              fullName,
              avatarUrl,
            }} 
          />
        </div>
      </header>

      <main className="flex-1">
        <div className="py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
        </div>
      </main>
    </div>
  );
}
