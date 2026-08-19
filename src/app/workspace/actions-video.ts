'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { collectCloudinaryUrls, deleteCloudinaryAssets } from '@/lib/cloudinary'

export async function updateVideoStage(videoId: string, workspaceId: string, updates: Record<string, unknown>) {
  console.log("Updating video stage:", videoId, updates);
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  const { error } = await supabase
    .from('videos')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', videoId)

  if (error) {
    console.error("Supabase update error:", error);
    return { error: error.message }
  }
  revalidatePath(`/workspace/${workspaceId}/video/${videoId}`)
  return { success: true }
}

export async function deleteVideo(videoId: string, workspaceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  // Récupérer les assets AVANT la suppression de la ligne, sinon les URLs sont
  // perdues et les images restent orphelines sur Cloudinary à vie.
  const { data: video } = await supabase
    .from('videos')
    .select('thumbnail_images, editing_resources, music_tracks')
    .eq('id', videoId)
    .maybeSingle()

  const assetUrls = video ? collectCloudinaryUrls(video) : []

  // `.select()` pour vérifier qu'une ligne a réellement été supprimée : la
  // policy RLS peut refuser sans renvoyer d'erreur, et il ne faut surtout pas
  // purger les images d'une vidéo qui existe toujours.
  const { data: deleted, error } = await supabase
    .from('videos')
    .delete()
    .eq('id', videoId)
    .select('id')

  if (error) return { error: error.message }
  if (!deleted || deleted.length === 0) {
    return { error: "Cette vidéo n'a pas pu être supprimée (droits insuffisants)." }
  }

  if (assetUrls.length > 0) {
    // Best-effort : la ligne est déjà supprimée, on ne bloque pas l'utilisateur
    // si Cloudinary répond mal. Les échecs sont journalisés.
    await deleteCloudinaryAssets(assetUrls)
  }

  revalidatePath(`/workspace/${workspaceId}`)
  redirect(`/workspace/${workspaceId}`)
}
