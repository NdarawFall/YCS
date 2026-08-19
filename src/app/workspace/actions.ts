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

export async function createTeam(workspaceId: string, name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  // Check plan
  const { data: profile } = await supabase.from('users').select('plan').eq('id', user.id).single()
  if (profile?.plan !== 'premium') return { error: 'La création d\'équipe est réservée au plan Premium.' }

  // Check workspace ownership
  const { data: workspace } = await supabase.from('workspaces').select('id').eq('id', workspaceId).eq('user_id', user.id).single()
  if (!workspace) return { error: 'Workspace non trouvé ou non autorisé' }

  const { data: team, error } = await supabase
    .from('teams')
    .insert({ workspace_id: workspaceId, name })
    .select('id')
    .single()

  if (error) return { error: error.message }
  
  // Add creator
  await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: user.id,
    role: "Chef d'équipe"
  })

  revalidatePath(`/workspace/${workspaceId}`)
  return { success: true, teamId: team.id }
}

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function createVideo(formData: FormData) {
...
export async function inviteMember(workspaceId: string, email: string, role: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  // Check plan
  const { data: profile } = await supabase.from('users').select('plan').eq('id', user.id).single()
  if (profile?.plan !== 'premium') return { error: 'L\'invitation est réservée au plan Premium.' }

  // Create invitation
  const { error } = await supabase
    .from('invitations')
    .insert({ workspace_id: workspaceId, email, role })

  if (error) return { error: error.message }

  // Envoi email via Resend
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // À remplacer par votre domaine vérifié plus tard
      to: email,
      subject: 'Invitation à collaborer sur YCS Studio',
      html: `
        <h2>Invitation YCS Studio</h2>
        <p>Vous avez été invité à rejoindre un workspace en tant que <strong>${role}</strong>.</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard">Cliquez ici pour accéder à votre espace</a></p>
      `
    });
  } catch (emailError) {
    console.error('Erreur envoi email:', emailError);
    // On ne bloque pas l'invitation en BDD si l'email échoue, mais on peut le gérer différemment
  }

  revalidatePath(`/workspace/${workspaceId}`)
  return { success: true }
}

