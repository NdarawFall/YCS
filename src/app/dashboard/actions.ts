'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createWorkspace(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Vous devez être connecté.' }
  }

  const name = formData.get('name') as string
  const niche = formData.get('niche') as string

  if (!name || !niche) {
    return { error: 'Veuillez remplir tous les champs.' }
  }

  // S'assurer que le profil existe dans public.users pour satisfaire la foreign key
  await supabase.from('users').upsert({
    id: user.id,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Créateur',
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
  }, { onConflict: 'id' })

  // Récupérer le plan de l'utilisateur
  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan || 'free'

  // Compter le nombre de workspaces actuels
  const { count: workspaceCount, error: countError } = await supabase
    .from('workspaces')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  if (countError) return { error: "Erreur lors de la vérification de vos chaînes." }

  // Appliquer les limites selon le plan
  if (plan === 'free' && (workspaceCount || 0) >= 1) {
    return { error: "Plan Débutant: Vous avez atteint la limite de 1 chaîne (Workspace). Passez au plan Premium." }
  }
  if (plan === 'premium' && (workspaceCount || 0) >= 7) {
    return { error: "Plan Premium: Vous avez atteint la limite de 7 chaînes (Workspaces)." }
  }

  // Créer le Workspace
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .insert({
      user_id: user.id,
      name,
      niche
    })
    .select('id')
    .single()

  if (workspaceError) {
    return { error: workspaceError.message }
  }

  // Créer l'équipe par défaut (Équipe Principale)
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({
      workspace_id: workspace.id,
      name: 'Équipe Principale'
    })
    .select('id')
    .single()

  if (!teamError && team) {
    // Ajouter le créateur en tant que Chef d'équipe
    await supabase.from('team_members').insert({
      team_id: team.id,
      user_id: user.id,
      role: "Chef d'équipe"
    })
  }

  revalidatePath('/dashboard')
  redirect(`/workspace/${workspace.id}`)
}

export async function deleteWorkspace(workspaceId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  const { error } = await supabase
    .from('workspaces')
    .delete()
    .eq('id', workspaceId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}
