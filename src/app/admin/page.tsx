import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AdminController } from './admin-controller';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, User } from 'lucide-react';

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.email !== 'ndarawpro@gmail.com') {
    redirect('/dashboard');
  }

  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single();

  return (
    <div className="p-4 sm:p-10 min-h-screen bg-[#0b0b0d] text-white">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Panneau d'administration</h1>
        
        <Card className="bg-[#141418] border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-red-500" /> Gestion des accès
            </CardTitle>
            <CardDescription className="text-white/60">
              Gérez le statut des utilisateurs en temps réel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-[#0f0f13] border border-border/50">
                <div className="p-2 rounded-full bg-white/5">
                    <User className="h-5 w-5 text-white/70" />
                </div>
                <div>
                    <p className="text-sm font-medium text-white/60">Utilisateur connecté</p>
                    <p className="font-bold">{user.email}</p>
                </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0f0f13] border border-border/50">
                <span className="font-medium text-white/60">Plan actuel</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${profile?.plan === 'premium' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white'}`}>
                    {profile?.plan?.toUpperCase()}
                </span>
            </div>
          </CardContent>
        </Card>

        <AdminController userId={user.id} currentPlan={profile?.plan} />
      </div>
    </div>
  );
}
