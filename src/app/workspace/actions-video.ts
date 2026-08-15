'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateVideoStage(videoId: string, updates: any) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  // TODO: Check permissions based on Team roles if in Team mode. 
  // For now, allow edit if authenticated.

  const { error } = await supabase
    .from('videos')
    .update(updates)
    .eq('id', videoId)

  if (error) return { error: error.message }

  // Get workspace ID to revalidate
  const { data: video } = await supabase.from('videos').select('workspace_id').eq('id', videoId).single()
  
  if (video) {
    revalidatePath(`/workspace/${video.workspace_id}`)
  }
  
  return { success: true }
}
