'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function createVideo(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  const workspaceId = formData.get('workspaceId') as string
  const title = formData.get('title') as string
  const mode = formData.get('mode') as string

  if (!title || !workspaceId) return { error: 'Le titre est obligatoire' }

  const isTeamMode = mode === 'equipe'

  // Récupérer le plan de l'utilisateur
  const { data: profile } = await supabase
    .from('users')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan || 'free'

  // Restreindre le mode équipe
  if (isTeamMode && plan === 'free') {
    return { error: 'Le mode Équipe est réservé au plan Premium.' }
  }

  // Compter le nombre TOTAL de vidéos de l'utilisateur (tous workspaces confondus)
  const { count: videoCount, error: countError } = await supabase
    .from('videos')
    .select('*, workspaces!inner(user_id)', { count: 'exact', head: true })
    .eq('workspaces.user_id', user.id)

  if (countError) return { error: "Erreur lors de la vérification de vos vidéos." }

  // Appliquer les limites selon le plan
  if (plan === 'free' && (videoCount || 0) >= 1) {
    return { error: "Plan Débutant: Vous avez atteint la limite de 1 vidéo au total. Passez au plan Premium." }
  }
  if (plan === 'premium' && (videoCount || 0) >= 10) {
    return { error: "Plan Premium: Vous avez atteint la limite maximale de 10 vidéos au total." }
  }

  const { data: video, error } = await supabase
    .from('videos')
    .insert({
      workspace_id: workspaceId,
      title,
      is_team_mode: isTeamMode,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/workspace/${workspaceId}`)
  redirect(`/workspace/${workspaceId}/video/${video.id}`)
}
