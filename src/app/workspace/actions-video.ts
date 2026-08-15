'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updateVideoStage(videoId: string, workspaceId: string, updates: Record<string, unknown>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  const { error } = await supabase
    .from('videos')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', videoId)

  if (error) return { error: error.message }
  revalidatePath(`/workspace/${workspaceId}/video/${videoId}`)
  return { success: true }
}

export async function deleteVideo(videoId: string, workspaceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  const { error } = await supabase.from('videos').delete().eq('id', videoId)
  if (error) return { error: error.message }

  revalidatePath(`/workspace/${workspaceId}`)
  redirect(`/workspace/${workspaceId}`)
}
