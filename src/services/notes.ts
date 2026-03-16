import { supabase } from './supabaseClient'
import type { LearningNote } from '../types'

export const fetchNotes = async () => {
  const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as LearningNote[]
}

export const createNote = async (note: Partial<LearningNote>) => {
  const { data, error } = await supabase.from('notes').insert(note).select('*').single()
  if (error) throw error
  return data as LearningNote
}

export const updateNote = async (id: string, note: Partial<LearningNote>) => {
  const { data, error } = await supabase.from('notes').update(note).eq('id', id).select('*').single()
  if (error) throw error
  return data as LearningNote
}

export const deleteNote = async (id: string) => {
  const { error } = await supabase.from('notes').delete().eq('id', id)
  if (error) throw error
}

