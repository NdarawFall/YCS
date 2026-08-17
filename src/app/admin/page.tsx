import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { AdminController } from './admin-controller';

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
    <div className="p-10 text-white min-h-screen bg-[#0b0b0d]">
      <h1 className="text-2xl font-bold mb-5">Interface Admin</h1>
      <p className="mb-4">Email : {user.email}</p>
      <p className="mb-8">Plan actuel : <span className="font-bold text-red-500">{profile?.plan}</span></p>
      
      <AdminController userId={user.id} currentPlan={profile?.plan} />
    </div>
  );
}
