export type ThemeMode = 'dark' | 'light'

export type UserSettings = {
  currency: string
  compactMode: boolean
  notifications: boolean
  assets: string[]
  tagOptions: string[]
  defaultAsset: string
  defaultTimeframe: string
  defaultDirection: 'Long' | 'Short'
  showChartGrid: boolean
  showTooltips: boolean
  dailyLossLimit: number
  maxTrades: number
  riskPerTrade: number
  theme: ThemeMode
}
