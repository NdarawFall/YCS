'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

const STAGES_ORDER = [
  { id: 'idea', key: 'idea_validated' },
  { id: 'script', key: 'script_validated' },
  { id: 'voiceover', key: 'voiceover_validated' },
  { id: 'editing', key: 'editing_validated' },
  { id: 'music', key: 'music_validated' },
  { id: 'thumbnail', key: 'thumbnail_validated' },
  { id: 'seo', key: 'seo_validated' },
  { id: 'upload', key: 'upload_validated' },
]

export async function updateVideoStage(videoId: string, updates: any) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  const { error } = await supabase
    .from('videos')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', videoId)

  if (error) return { error: error.message }

  const { data: video } = await supabase.from('videos').select('workspace_id').eq('id', videoId).single()
  if (video) {
    revalidatePath(`/workspace/${video.workspace_id}`)
  }
  
  return { success: true }
}

export async function moveVideoToStage(videoId: string, targetStageId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  const targetIndex = STAGES_ORDER.findIndex(s => s.id === targetStageId)
  if (targetIndex === -1) return { error: 'Étape invalide' }

  // Valide toutes les étapes antérieures à l'étape cible, et invalide l'étape cible et les suivantes
  const stageUpdates: Record<string, boolean> = {}
  STAGES_ORDER.forEach((stage, idx) => {
    stageUpdates[stage.key] = idx < targetIndex
  })

  const { error } = await supabase
    .from('videos')
    .update({
      ...stageUpdates,
      updated_at: new Date().toISOString()
    })
    .eq('id', videoId)

  if (error) return { error: error.message }

  const { data: video } = await supabase.from('videos').select('workspace_id').eq('id', videoId).single()
  if (video) {
    revalidatePath(`/workspace/${video.workspace_id}`)
  }

  return { success: true }
}

export async function deleteVideo(videoId: string, workspaceId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId)

  if (error) return { error: error.message }

  revalidatePath(`/workspace/${workspaceId}`)
  return { success: true }
}
