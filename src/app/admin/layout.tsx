import Link from 'next/link';
import { LayoutDashboard, Users, ArrowLeft, FolderKanban } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0b0b0d] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/50 p-6 space-y-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/50 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Retour App
        </Link>
        <nav className="space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 font-semibold">
            <LayoutDashboard className="h-5 w-5 text-red-500" /> Dashboard
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 font-semibold">
            <Users className="h-5 w-5 text-red-500" /> Utilisateurs
          </Link>
          <Link href="/admin/workspaces" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 font-semibold">
            <FolderKanban className="h-5 w-5 text-red-500" /> Workspaces
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}
