import { useEffect, useRef, useState } from 'react'
import { useAuth } from './useAuth'
import type { UserSettings } from '../types/settings'
import { fetchUserSettings, upsertUserSettings } from '../services/settings'

const SETTINGS_KEY = 'tradelab-settings'

export const defaultSettings: UserSettings = {
  currency: 'USD',
  compactMode: false,
  notifications: true,
  assets: ['AAPL', 'TSLA', 'SPY', 'BTCUSDT', 'ETHUSDT', 'EURUSD'],
  tagOptions: ['breakout', 'pullback', 'trend', 'news', 'fomo', 'reversal'],
  defaultAsset: 'AAPL',
  defaultTimeframe: '1H',
  defaultDirection: 'Long',
  showChartGrid: true,
  showTooltips: true,
  dailyLossLimit: 500,
  maxTrades: 5,
  riskPerTrade: 100,
  theme: 'dark',
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
  const { user } = useAuth()
  const [settings, setSettings] = useState<UserSettings>(getInitialSettings)
  const [loading, setLoading] = useState(false)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    fetchUserSettings(user.id)
      .then((remote) => {
        if (cancelled) return
        if (remote) {
          setSettings({ ...defaultSettings, ...remote })
        } else {
          void upsertUserSettings(user.id, settings)
        }
      })
      .catch(() => {
        if (cancelled) return
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const updateSettings = (partial: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial }
      if (user) {
        if (saveTimeout.current) window.clearTimeout(saveTimeout.current)
        saveTimeout.current = window.setTimeout(() => {
          void upsertUserSettings(user.id, next)
        }, 400)
      }
      return next
    })
  }

  return { settings, updateSettings, loading }
}
