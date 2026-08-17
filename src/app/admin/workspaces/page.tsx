import { fetchAdminWorkspaces } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function AdminWorkspacesPage() {
  const { workspaces, error } = await fetchAdminWorkspaces();

  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Gestion des Workspaces</h1>
      
      <Card className="bg-[#141418] border-border/50">
        <CardHeader><CardTitle>Liste des workspaces</CardTitle></CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nom Workspace</TableHead>
                        <TableHead>Niche</TableHead>
                        <TableHead>Propriétaire</TableHead>
                        <TableHead>Date création</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {workspaces?.map((ws: any) => (
                        <TableRow key={ws.id}>
                            <TableCell className="font-medium">{ws.workspace_name}</TableCell>
                            <TableCell>{ws.niche}</TableCell>
                            <TableCell>{ws.owner_name}</TableCell>
                            <TableCell>{new Date(ws.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}
