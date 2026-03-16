import { supabase } from './supabaseClient'
import type { ChecklistItem } from '../types'

export const fetchChecklistItems = async (date: string) => {
  const { data, error } = await supabase
    .from('daily_checklist')
    .select('*')
    .eq('date', date)
    .order('section', { ascending: true })
  if (error) throw error
  return data as ChecklistItem[]
}

export const createChecklistItem = async (item: Partial<ChecklistItem>) => {
  const { data, error } = await supabase.from('daily_checklist').insert(item).select('*').single()
  if (error) throw error
  return data as ChecklistItem
}

export const updateChecklistItem = async (id: string, item: Partial<ChecklistItem>) => {
  const { data, error } = await supabase.from('daily_checklist').update(item).eq('id', id).select('*').single()
  if (error) throw error
  return data as ChecklistItem
}

export const deleteChecklistItem = async (id: string) => {
  const { error } = await supabase.from('daily_checklist').delete().eq('id', id)
  if (error) throw error
}

