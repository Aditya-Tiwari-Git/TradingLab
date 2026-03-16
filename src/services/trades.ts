import { supabase } from './supabaseClient'
import type { Trade, TradeLink, TradeImage } from '../types'

export const fetchTrades = async () => {
  const { data, error } = await supabase
    .from('trades')
    .select('*')
    .order('date', { ascending: false })
  if (error) throw error
  return data as Trade[]
}

export const fetchTradeById = async (id: string) => {
  const { data, error } = await supabase.from('trades').select('*').eq('id', id).single()
  if (error) throw error
  return data as Trade
}

export const createTrade = async (trade: Partial<Trade>, tags: string[] = []) => {
  const { data, error } = await supabase.from('trades').insert(trade).select('*').single()
  if (error) throw error
  if (tags.length) {
    await syncTradeTags(data.id, tags)
  }
  return data as Trade
}

export const updateTrade = async (id: string, trade: Partial<Trade>, tags: string[] = []) => {
  const { data, error } = await supabase.from('trades').update(trade).eq('id', id).select('*').single()
  if (error) throw error
  await syncTradeTags(id, tags)
  return data as Trade
}

export const deleteTrade = async (id: string) => {
  const { error } = await supabase.from('trades').delete().eq('id', id)
  if (error) throw error
}

export const fetchTradeLinks = async (tradeId: string) => {
  const { data, error } = await supabase.from('trade_links').select('*').eq('trade_id', tradeId)
  if (error) throw error
  return data as TradeLink[]
}

export const addTradeLink = async (link: Partial<TradeLink>) => {
  const { data, error } = await supabase.from('trade_links').insert(link).select('*').single()
  if (error) throw error
  return data as TradeLink
}

export const deleteTradeLink = async (id: string) => {
  const { error } = await supabase.from('trade_links').delete().eq('id', id)
  if (error) throw error
}

export const fetchTradeImages = async (tradeId: string) => {
  const { data, error } = await supabase.from('trade_images').select('*').eq('trade_id', tradeId)
  if (error) throw error
  return data as TradeImage[]
}

export const addTradeImage = async (image: Partial<TradeImage>) => {
  const { data, error } = await supabase.from('trade_images').insert(image).select('*').single()
  if (error) throw error
  return data as TradeImage
}

export const deleteTradeImage = async (id: string) => {
  const { error } = await supabase.from('trade_images').delete().eq('id', id)
  if (error) throw error
}

export const fetchTagsForTrade = async (tradeId: string) => {
  const { data, error } = await supabase
    .from('trade_tags')
    .select('tags ( id, name )')
    .eq('trade_id', tradeId)
  if (error) throw error
  return (data ?? []).map((row) => row.tags)
}

export const fetchTradeTagsMap = async () => {
  const { data, error } = await supabase
    .from('trade_tags')
    .select('trade_id, tags ( name )')
  if (error) throw error
  const map: Record<string, string[]> = {}
  data?.forEach((row: { trade_id: string; tags: { name: string } }) => {
    if (!map[row.trade_id]) map[row.trade_id] = []
    if (row.tags?.name) map[row.trade_id].push(row.tags.name)
  })
  return map
}

const syncTradeTags = async (tradeId: string, tags: string[]) => {
  const normalized = tags.map((tag) => tag.trim()).filter(Boolean)
  const unique = Array.from(new Set(normalized))

  const { data: existingTags, error: tagsError } = await supabase
    .from('tags')
    .select('id, name')
    .in('name', unique)
  if (tagsError) throw tagsError

  const existingMap = new Map((existingTags ?? []).map((tag) => [tag.name, tag.id]))
  const missing = unique.filter((tag) => !existingMap.has(tag))

  if (missing.length) {
    const { data: inserted, error: insertError } = await supabase
      .from('tags')
      .insert(missing.map((name) => ({ name })))
      .select('id, name')
    if (insertError) throw insertError
    inserted?.forEach((tag) => existingMap.set(tag.name, tag.id))
  }

  const allTagIds = unique.map((name) => existingMap.get(name)).filter(Boolean) as string[]

  await supabase.from('trade_tags').delete().eq('trade_id', tradeId)
  if (allTagIds.length) {
    const { error: linkError } = await supabase
      .from('trade_tags')
      .insert(allTagIds.map((tagId) => ({ trade_id: tradeId, tag_id: tagId })))
    if (linkError) throw linkError
  }
}

