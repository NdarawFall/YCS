/**
 * Configuration de l'équipe, partagée entre les server actions et l'UI.
 *
 * Ce module ne porte volontairement pas 'use server' : un fichier de server
 * actions ne peut exporter que des fonctions async, donc ces constantes doivent
 * vivre à part pour être importables des deux côtés.
 */

/** Plafond de personnes par équipe : membres + invitations en attente. */
export const MAX_TEAM_SIZE = 10

/**
 * Rôles assignables à un collaborateur.
 *
 * Doit rester aligné sur la contrainte `team_members_role_check` définie dans
 * supabase-commands.sql, sinon l'acceptation d'une invitation échouera.
 * "Chef d'équipe" est exclu : il est réservé au propriétaire du workspace.
 */
export const ASSIGNABLE_ROLES = [
  "Copywriter",
  "Voix off",
  "Monteur",
  "Musicien",
  "Miniamaker",
  "Designer",
  "Artiste 2D/3D",
] as const

export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number]

/** Rôle du propriétaire, non assignable via une invitation. */
export const OWNER_ROLE = "Chef d'équipe"

export function isAssignableRole(role: string): role is AssignableRole {
  return (ASSIGNABLE_ROLES as readonly string[]).includes(role)
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isValidEmail(email: string) {
  return EMAIL_PATTERN.test(email)
}
