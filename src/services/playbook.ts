import { supabase } from './supabaseClient'
import type { PlaybookSetup } from '../types'

export const fetchPlaybook = async () => {
  const { data, error } = await supabase.from('playbook_setups').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as PlaybookSetup[]
}

export const createPlaybook = async (setup: Partial<PlaybookSetup>) => {
  const { data, error } = await supabase.from('playbook_setups').insert(setup).select('*').single()
  if (error) throw error
  return data as PlaybookSetup
}

export const updatePlaybook = async (id: string, setup: Partial<PlaybookSetup>) => {
  const { data, error } = await supabase.from('playbook_setups').update(setup).eq('id', id).select('*').single()
  if (error) throw error
  return data as PlaybookSetup
}

export const deletePlaybook = async (id: string) => {
  const { error } = await supabase.from('playbook_setups').delete().eq('id', id)
  if (error) throw error
}

