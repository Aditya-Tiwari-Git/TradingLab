import { useEffect, useState } from 'react'
import { useSettings } from './useSettings'

type Theme = 'dark' | 'light'

const THEME_KEY = 'tradelab-theme'

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(THEME_KEY) as Theme | null
  if (stored === 'light' || stored === 'dark') return stored
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches
  return prefersLight ? 'light' : 'dark'
}

export const useTheme = () => {
  const { settings, updateSettings } = useSettings()
  const [theme, setTheme] = useState<Theme>(settings.theme ?? getInitialTheme)

  useEffect(() => {
    if (settings.theme && settings.theme !== theme) {
      setTheme(settings.theme)
    }
  }, [settings.theme])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('light', theme === 'light')
    window.localStorage.setItem(THEME_KEY, theme)
    if (settings.theme !== theme) {
      updateSettings({ theme })
    }
  }, [theme])

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return { theme, toggleTheme }
}
