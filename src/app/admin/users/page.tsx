import { fetchAdminUsers } from '../actions';
import { PlanSwitcher } from './plan-switcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function AdminUsersPage() {
  const { users, error } = await fetchAdminUsers();

  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Gestion des Utilisateurs</h1>
      
      <Card className="bg-[#141418] border-border/50">
        <CardHeader><CardTitle>Liste des utilisateurs</CardTitle></CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Date création</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users?.map((user: any) => (
                        <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.full_name}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.plan === 'premium' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white'}`}>
                                    {user.plan?.toUpperCase()}
                                </span>
                            </TableCell>
                            <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <PlanSwitcher userId={user.id} currentPlan={user.plan} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
