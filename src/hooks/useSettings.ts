import { useEffect, useState } from 'react'

export type UserSettings = {
  currency: string
  compactMode: boolean
  notifications: boolean
}

const SETTINGS_KEY = 'tradelab-settings'

const defaultSettings: UserSettings = {
  currency: 'USD',
  compactMode: false,
  notifications: true,
}

const getInitialSettings = (): UserSettings => {
  if (typeof window === 'undefined') return defaultSettings
  const stored = window.localStorage.getItem(SETTINGS_KEY)
  if (!stored) return defaultSettings
  try {
    return { ...defaultSettings, ...(JSON.parse(stored) as Partial<UserSettings>) }
  } catch {
    return defaultSettings
  }
}

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings>(getInitialSettings)

  useEffect(() => {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }))
  }

  return { settings, updateSettings }
}
