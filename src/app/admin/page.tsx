import { fetchAdminStats, fetchRecentVideos } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ShieldCheck, Film, Clock } from 'lucide-react';

export default async function AdminDashboardPage() {
  const stats = await fetchAdminStats();
  const { videos } = await fetchRecentVideos();
  
  if (stats.error) return <div>{stats.error}</div>;

  const data = [
    { name: 'Premium', value: stats.userStats?.premium_users || 0, color: '#ef4444' },
    { name: 'Free', value: stats.userStats?.free_users || 0, color: '#374151' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#141418] border-border/50">
            <CardHeader><CardTitle className="text-sm font-medium text-white/60">Total Utilisateurs</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{stats.userStats?.total_users || 0}</p></CardContent>
        </Card>
        <Card className="bg-[#141418] border-border/50">
            <CardHeader><CardTitle className="text-sm font-medium text-white/60">Total Workspaces</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{stats.wsStats?.total_workspaces || 0}</p></CardContent>
        </Card>
        <Card className="bg-[#141418] border-border/50">
            <CardHeader><CardTitle className="text-sm font-medium text-white/60">Moy. Workspaces / Utilisateur</CardTitle></CardHeader>
            <CardContent><p className="text-3xl font-bold">{stats.wsStats?.avg_workspaces_per_user?.toFixed(1) || 0}</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#141418] border-border/50 p-6">
            <CardTitle className="mb-6">Répartition des plans</CardTitle>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip contentStyle={{ backgroundColor: '#141418', border: '1px solid #374151' }} />
                        <Bar dataKey="value">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
        
        <Card className="bg-[#141418] border-border/50 p-6">
            <CardTitle className="mb-6 flex items-center gap-2"><Clock className="h-5 w-5 text-red-500" /> Activités récentes</CardTitle>
            <div className="space-y-4">
                {videos?.map((video: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-[#0f0f13] border border-border/50">
                        <Film className="h-5 w-5 text-white/50" />
                        <div>
                            <p className="font-medium text-sm">{video.title}</p>
                            <p className="text-xs text-white/50">{video.workspace_name} • {new Date(video.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
      </div>
    </div>
  );
}
