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

  // Create Workspace
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

  // Create default Team (Chef d'équipe)
  const { data: team, error: teamError } = await supabase
    .from('teams')
    .insert({
      workspace_id: workspace.id,
      name: 'Équipe Principale'
    })
    .select('id')
    .single()

  if (!teamError && team) {
    // Add owner as Chef d'équipe
    await supabase.from('team_members').insert({
      team_id: team.id,
      user_id: user.id,
      role: "Chef d'équipe"
    })
  }

  revalidatePath('/dashboard')
  redirect(`/workspace/${workspace.id}`)
}
