'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { sendInvitationEmail } from './email'
import {
  MAX_TEAM_SIZE,
  OWNER_ROLE,
  isAssignableRole,
  isValidEmail,
  normalizeEmail,
} from './team-config'

type ServerClient = Awaited<ReturnType<typeof createClient>>

const DEFAULT_TEAM_NAME = 'Équipe Principale'

/**
 * Vérifie que l'utilisateur courant est bien propriétaire du workspace.
 *
 * Indispensable en plus des policies RLS : celles de `team_members` autorisent
 * n'importe quel membre de l'équipe à en supprimer un autre.
 */
async function requireOwner(workspaceId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .eq('id', workspaceId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!workspace) return { error: 'Workspace non trouvé ou non autorisé' }

  return { supabase, user }
}

/**
 * Récupère l'équipe du workspace, ou la crée si elle n'existe pas.
 *
 * Un workspace n'a qu'une seule équipe : elle est normalement créée avec le
 * workspace (voir src/app/dashboard/actions.ts). On prend la plus ancienne pour
 * rester déterministe si des doublons existent déjà en base.
 */
async function getOrCreateTeam(
  supabase: ServerClient,
  workspaceId: string,
  ownerId: string,
  name = DEFAULT_TEAM_NAME
) {
  const { data: existing } = await supabase
    .from('teams')
    .select('id, name')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (existing) return { team: existing }

  const { data: team, error } = await supabase
    .from('teams')
    .insert({ workspace_id: workspaceId, name })
    .select('id, name')
    .single()

  if (error) return { error: error.message }

  await supabase.from('team_members').insert({
    team_id: team.id,
    user_id: ownerId,
    role: OWNER_ROLE,
  })

  return { team }
}

/** Nombre de personnes déjà engagées : membres + invitations en attente. */
async function countTeamSeats(supabase: ServerClient, workspaceId: string, teamId: string) {
  const { count: memberCount } = await supabase
    .from('team_members')
    .select('*', { count: 'exact', head: true })
    .eq('team_id', teamId)

  const { data: pending } = await supabase
    .from('invitations')
    .select('email')
    .eq('workspace_id', workspaceId)
    .eq('status', 'pending')

  const pendingEmails = new Set((pending || []).map((p) => normalizeEmail(p.email)))

  return { members: memberCount || 0, pendingEmails }
}

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

/**
 * Crée l'équipe du workspace si elle n'existe pas, sinon la renomme.
 *
 * Pas de restriction Premium ici : une équipe est de toute façon créée
 * automatiquement avec chaque workspace, quel que soit le plan. C'est
 * l'invitation de collaborateurs qui est réservée au Premium.
 */
export async function saveTeamName(workspaceId: string, name: string) {
  const ctx = await requireOwner(workspaceId)
  if ('error' in ctx) return { error: ctx.error }
  const { supabase, user } = ctx

  const trimmed = name.trim()
  if (!trimmed) return { error: "Le nom de l'équipe est obligatoire." }
  if (trimmed.length > 60) return { error: "Le nom de l'équipe ne peut pas dépasser 60 caractères." }

  const result = await getOrCreateTeam(supabase, workspaceId, user.id, trimmed)
  if ('error' in result) return { error: result.error }

  if (result.team.name !== trimmed) {
    const { error } = await supabase
      .from('teams')
      .update({ name: trimmed })
      .eq('id', result.team.id)

    if (error) return { error: error.message }
  }

  revalidatePath(`/workspace/${workspaceId}`)
  return { success: true }
}

/**
 * Invite plusieurs collaborateurs d'un coup.
 *
 * Applique le plafond de MAX_TEAM_SIZE personnes (membres + invitations en
 * attente) et refuse les doublons. Renvoie le détail des envois d'email afin que
 * l'UI puisse signaler un échec au lieu de le masquer.
 */
export async function inviteMembers(
  workspaceId: string,
  invites: { email: string; role: string }[]
) {
  const ctx = await requireOwner(workspaceId)
  if ('error' in ctx) return { error: ctx.error }
  const { supabase, user } = ctx

  const { data: profile } = await supabase.from('users').select('plan').eq('id', user.id).single()
  if (profile?.plan !== 'premium') {
    return { error: "L'invitation de collaborateurs est réservée au plan Premium." }
  }

  // Nettoyage et validation du formulaire
  const cleaned: { email: string; role: string }[] = []
  const seen = new Set<string>()

  for (const invite of invites) {
    const email = normalizeEmail(invite.email || '')
    if (!email) continue

    if (!isValidEmail(email)) return { error: `Adresse email invalide : ${invite.email}` }
    if (!isAssignableRole(invite.role)) return { error: `Rôle invalide : ${invite.role}` }
    if (seen.has(email)) return { error: `Cette adresse apparaît deux fois : ${email}` }

    seen.add(email)
    cleaned.push({ email, role: invite.role })
  }

  if (cleaned.length === 0) return { error: 'Ajoutez au moins une adresse email.' }

  const teamResult = await getOrCreateTeam(supabase, workspaceId, user.id)
  if ('error' in teamResult) return { error: teamResult.error }

  const { members, pendingEmails } = await countTeamSeats(supabase, workspaceId, teamResult.team.id)

  const alreadyPending = cleaned.filter((c) => pendingEmails.has(c.email))
  if (alreadyPending.length > 0) {
    return {
      error: `Une invitation est déjà en attente pour : ${alreadyPending.map((c) => c.email).join(', ')}`,
    }
  }

  const used = members + pendingEmails.size
  if (used + cleaned.length > MAX_TEAM_SIZE) {
    const remaining = Math.max(0, MAX_TEAM_SIZE - used)
    return {
      error: remaining === 0
        ? `L'équipe est complète (${MAX_TEAM_SIZE} personnes maximum).`
        : `Il ne reste que ${remaining} place${remaining > 1 ? 's' : ''} sur ${MAX_TEAM_SIZE} : vous en demandez ${cleaned.length}.`,
    }
  }

  const { error: insertError } = await supabase.from('invitations').insert(
    cleaned.map((c) => ({ workspace_id: workspaceId, email: c.email, role: c.role }))
  )

  if (insertError) return { error: insertError.message }

  // Envoi des emails : on remonte les échecs plutôt que de les avaler
  const failed: string[] = []
  for (const c of cleaned) {
    const res = await sendInvitationEmail(c.email, c.role)
    if (res?.error) failed.push(c.email)
  }

  revalidatePath(`/workspace/${workspaceId}`)
  return { success: true, sent: cleaned.length - failed.length, failed }
}

export async function removeMember(workspaceId: string, memberId: string) {
  const ctx = await requireOwner(workspaceId)
  if ('error' in ctx) return { error: ctx.error }
  const { supabase } = ctx

  // Restreindre la suppression aux équipes de ce workspace
  const { data: teams } = await supabase.from('teams').select('id').eq('workspace_id', workspaceId)
  const teamIds = (teams || []).map((t) => t.id)
  if (teamIds.length === 0) return { error: 'Aucune équipe sur ce workspace.' }

  const { data: member } = await supabase
    .from('team_members')
    .select('id, role')
    .eq('id', memberId)
    .in('team_id', teamIds)
    .maybeSingle()

  if (!member) return { error: 'Membre non trouvé.' }
  if (member.role === OWNER_ROLE) return { error: "Le chef d'équipe ne peut pas être retiré." }

  const { error } = await supabase.from('team_members').delete().eq('id', memberId)
  if (error) return { error: error.message }

  revalidatePath(`/workspace/${workspaceId}`)
  return { success: true }
}

export async function cancelInvitation(workspaceId: string, invitationId: string) {
  const ctx = await requireOwner(workspaceId)
  if ('error' in ctx) return { error: ctx.error }
  const { supabase } = ctx

  const { data, error } = await supabase
    .from('invitations')
    .delete()
    .eq('id', invitationId)
    .eq('workspace_id', workspaceId)
    .select('id')

  if (error) return { error: error.message }

  // Sans policy RLS DELETE, Postgres renvoie 0 ligne sans erreur : on le détecte
  // explicitement pour ne pas afficher un faux succès.
  if (!data || data.length === 0) {
    return {
      error: "L'invitation n'a pas pu être annulée. Vérifiez que la policy de suppression a bien été exécutée (supabase-commands.sql).",
    }
  }

  revalidatePath(`/workspace/${workspaceId}`)
  return { success: true }
}
