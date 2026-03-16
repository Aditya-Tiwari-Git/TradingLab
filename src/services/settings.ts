import { supabase } from './supabaseClient'
import type { UserSettings } from '../types/settings'

export const fetchUserSettings = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('settings')
    .eq('user_id', userId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null
    throw error
  }
  return (data?.settings as UserSettings) ?? null
}

export const upsertUserSettings = async (userId: string, settings: UserSettings) => {
  const { error } = await supabase.from('user_settings').upsert(
    {
      user_id: userId,
      settings,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  )
  if (error) throw error
}
