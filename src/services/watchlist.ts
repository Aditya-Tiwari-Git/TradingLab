import { supabase } from './supabaseClient'
import type { WatchlistItem } from '../types'

export const fetchWatchlist = async () => {
  const { data, error } = await supabase.from('watchlist').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data as WatchlistItem[]
}

export const createWatchlistItem = async (item: Partial<WatchlistItem>) => {
  const { data, error } = await supabase.from('watchlist').insert(item).select('*').single()
  if (error) throw error
  return data as WatchlistItem
}

export const updateWatchlistItem = async (id: string, item: Partial<WatchlistItem>) => {
  const { data, error } = await supabase.from('watchlist').update(item).eq('id', id).select('*').single()
  if (error) throw error
  return data as WatchlistItem
}

export const deleteWatchlistItem = async (id: string) => {
  const { error } = await supabase.from('watchlist').delete().eq('id', id)
  if (error) throw error
}

