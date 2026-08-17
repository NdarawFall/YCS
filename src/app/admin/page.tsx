import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AdminController } from './admin-controller';
import { fetchAdminStats } from './actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShieldCheck, User, Users, Film } from 'lucide-react';

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
    
  const stats = await fetchAdminStats();

  return (
    <div className="p-4 sm:p-10 min-h-screen bg-[#0b0b0d] text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Panneau d'administration</h1>
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-[#141418] border-border/50">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-white/60">Total Utilisateurs</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold">{stats.userStats?.total_users || 0}</p></CardContent>
            </Card>
            <Card className="bg-[#141418] border-border/50">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-white/60">Premium / Free</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold">{stats.userStats?.premium_users || 0} / {stats.userStats?.free_users || 0}</p></CardContent>
            </Card>
            <Card className="bg-[#141418] border-border/50">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-white/60">Workspaces</CardTitle></CardHeader>
                <CardContent><p className="text-3xl font-bold">{stats.wsStats?.total_workspaces || 0}</p></CardContent>
            </Card>
        </div>

        <Card className="bg-[#141418] border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-red-500" /> Gestion de votre accès
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
