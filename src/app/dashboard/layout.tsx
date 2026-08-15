import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogOut, Settings, LayoutGrid } from "lucide-react";
import { logout } from "@/app/auth/actions";
import { Logo } from "@/components/ui/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

  // Fetch user profile
  const { data: profile } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const fullName = profile?.full_name || user.email?.split("@")[0] || "Créateur";
  const initials = fullName.substring(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0b0d]">
      <header className="sticky top-0 z-40 flex h-18 shrink-0 items-center justify-between border-b border-border/50 bg-[#101014]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="flex items-center gap-6">
          <Logo size="md" />
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-9 w-9 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer">
              <Avatar className="h-9 w-9 border border-red-500/30 shadow-xs">
                <AvatarFallback className="bg-red-600/20 text-red-500 font-bold text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 bg-[#141418] border-border/80 text-foreground" align="end">
              <DropdownMenuLabel className="font-normal p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold text-white leading-none">{fullName}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/60" />
              <DropdownMenuItem className="p-0 focus:bg-white/5 cursor-pointer">
                <Link href="/dashboard" className="flex w-full items-center px-3 py-2 text-sm text-foreground">
                  <LayoutGrid className="mr-2.5 h-4 w-4 text-red-500" />
                  <span>Mes Workspaces</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/60" />
              <DropdownMenuItem className="p-0 focus:bg-red-500/10 cursor-pointer">
                <form action={logout} className="w-full">
                  <button type="submit" className="flex w-full px-3 py-2 items-center text-sm text-red-400 hover:text-red-300">
                    <LogOut className="mr-2.5 h-4 w-4" />
                    <span>Déconnexion</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
