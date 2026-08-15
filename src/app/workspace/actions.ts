'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function createVideo(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  const workspaceId = formData.get('workspaceId') as string
  const title = formData.get('title') as string
  const mode = formData.get('mode') as string // 'solo' or 'equipe'
  const teamId = formData.get('teamId') as string

  if (!title || !workspaceId) return { error: 'Le titre est obligatoire' }

  const isTeamMode = mode === 'equipe'

  const { error } = await supabase
    .from('videos')
    .insert({
      workspace_id: workspaceId,
      title,
      is_team_mode: isTeamMode,
      team_id: isTeamMode && teamId ? teamId : null
    })

  if (error) return { error: error.message }

  revalidatePath(`/workspace/${workspaceId}`)
  return { success: true }
}
