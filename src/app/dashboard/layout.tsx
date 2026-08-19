import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { UserNav } from "@/components/dashboard/user-nav";
import { MobileGuard } from "@/components/mobile-guard";

export const dynamic = 'force-dynamic';

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

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, avatar_url, plan")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Créateur";
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || undefined;
  const plan = profile?.plan || "free";

  return (
    <MobileGuard>
      <div className="flex min-h-screen flex-col">
        {/* Top navbar */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between px-4 sm:px-6 lg:px-8 glass border-b border-white/5">
          <div className="flex items-center gap-6">
            <Logo size="md" />
          </div>
          <div className="flex items-center gap-4">
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

        <main className="flex-1">
          <div className="py-10">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
          </div>
        </main>
      </div>
    </MobileGuard>
  );
}
