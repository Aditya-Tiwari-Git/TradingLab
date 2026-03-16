import { supabase } from './supabaseClient'
import type { Strategy } from '../types'

export const fetchStrategies = async () => {
  const { data, error } = await supabase.from('strategies').select('*').order('name')
  if (error) throw error
  return data as Strategy[]
}

export const createStrategy = async (strategy: Partial<Strategy>) => {
  const { data, error } = await supabase.from('strategies').insert(strategy).select('*').single()
  if (error) throw error
  return data as Strategy
}

export const updateStrategy = async (id: string, strategy: Partial<Strategy>) => {
  const { data, error } = await supabase.from('strategies').update(strategy).eq('id', id).select('*').single()
  if (error) throw error
  return data as Strategy
}

export const deleteStrategy = async (id: string) => {
  const { error } = await supabase.from('strategies').delete().eq('id', id)
  if (error) throw error
}

