'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateUsername(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non autorisé' }

  const fullName = (formData.get('fullName') as string)?.trim()
  if (!fullName || fullName.length < 2) return { error: 'Le nom doit contenir au moins 2 caractères.' }
  if (fullName.length > 50) return { error: 'Le nom ne peut pas dépasser 50 caractères.' }

  const { error } = await supabase
    .from('users')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/settings')
  return { success: true }
}
