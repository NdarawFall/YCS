import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

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

  const fullName = profile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "";
  const currentPlan = profile?.plan || "free";

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">Paramètres du compte</h1>
        <p className="text-muted-foreground text-sm">Gérez vos informations personnelles et votre abonnement.</p>
      </div>

      <SettingsForm initialFullName={fullName} currentPlan={currentPlan} />
    </div>
  );
}
