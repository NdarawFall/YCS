'use server'

import { createClient } from '@/utils/supabase/server'

// Remplacez cette constante par votre propre email pour restreindre l'accès
const ADMIN_EMAILS = ['ndarawpro@gmail.com'];

export async function fetchAdminStats() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return { error: 'Non autorisé.' }
  }

  const { data: userStats } = await supabase.from('admin_user_stats').select('*').single()
  const { data: wsStats } = await supabase.from('admin_workspace_stats').select('*').single()

  return { userStats, wsStats }
}

export async function fetchAdminUsers() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return { error: 'Non autorisé.' }
  }

  const { data: users } = await supabase.from('admin_user_list').select('*')
  return { users }
}

export async function fetchAdminWorkspaces() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return { error: 'Non autorisé.' }
  }

  const { data: workspaces } = await supabase.from('admin_workspace_list').select('*')
  return { workspaces }
}

export async function fetchRecentVideos() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return { error: 'Non autorisé.' }
  }

  const { data: videos } = await supabase.from('admin_recent_videos').select('*')
  return { videos }
}

export async function toggleUserPlan(userId: string, newPlan: 'free' | 'premium') {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  
  // 1. Vérification stricte : seul un admin peut exécuter cette action
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return { error: 'Non autorisé. Action réservée aux administrateurs.' }
  }

  // 2. Mise à jour sécurisée du plan
  const { error } = await supabase
    .from('users')
    .update({ plan: newPlan })
    .eq('id', userId)

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: `Plan de l'utilisateur mis à jour en ${newPlan}.` }
}
