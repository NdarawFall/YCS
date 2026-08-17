import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, plan")
    .eq("id", user.id)
    .single();

  // Use the saved username if available, otherwise fallback
  const fullName = profile?.full_name || "";
  const currentPlan = profile?.plan || "free";

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10">
      <div className="border-b border-border/50 pb-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-white/50 hover:text-white transition-colors mb-6 p-2 rounded-lg hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4 text-red-500" />
          <span>Retour au tableau de bord</span>
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-3">Paramètres</h1>
        <p className="text-muted-foreground text-lg">Gérez vos informations personnelles et votre abonnement.</p>
      </div>

      <SettingsForm initialFullName={fullName} currentPlan={currentPlan} userId={user.id} />
    </div>
  );
}
