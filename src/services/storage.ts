import { supabase, storageBucket } from './supabaseClient'

export const uploadTradeImage = async (file: File, tradeId: string) => {
  const extension = file.name.split('.').pop()
  const path = `${tradeId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`

  const { error } = await supabase.storage.from(storageBucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  return path
}

export const getSignedUrl = async (path: string, expiresIn = 3600) => {
  const { data, error } = await supabase.storage.from(storageBucket).createSignedUrl(path, expiresIn)
  if (error) throw error
  return data.signedUrl
}
