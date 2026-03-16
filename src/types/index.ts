export type Direction = 'Long' | 'Short'
export type TradeResult = 'Win' | 'Loss' | 'Breakeven'

export interface Strategy {
  id: string
  name: string
  description?: string | null
  rules?: string | null
  created_at?: string
}

export interface Trade {
  id: string
  user_id: string
  trade_code?: string | null
  date: string
  asset: string
  direction: Direction
  strategy_id?: string | null
  setup_type?: string | null
  timeframe?: string | null
  entry_price?: number | null
  exit_price?: number | null
  stop_loss?: number | null
  position_size?: number | null
  risk_per_trade?: number | null
  rr_ratio?: number | null
  profit_loss?: number | null
  result?: TradeResult | null
  pre_trade_reasoning?: string | null
  post_trade_reflection?: string | null
  what_went_right?: string | null
  what_went_wrong?: string | null
  lessons_learned?: string | null
  emotional_state?: string | null
  rule_followed?: boolean | null
  mistake_id?: string | null
  mistake_category?: string | null
  created_at?: string
}

export interface Tag {
  id: string
  name: string
}

export interface TradeLink {
  id: string
  trade_id: string
  url: string
  label?: string | null
  link_type?: string | null
  created_at?: string
}

export interface TradeImage {
  id: string
  trade_id: string
  storage_path: string
  caption?: string | null
  created_at?: string
}

export interface Mistake {
  id: string
  name: string
  description?: string | null
}

export interface LearningNote {
  id: string
  title: string
  tags?: string[] | null
  content: string
  created_at?: string
  updated_at?: string
}

export interface WatchlistItem {
  id: string
  asset_name: string
  notes?: string | null
  reason?: string | null
  created_at?: string
}

export interface PlaybookSetup {
  id: string
  name: string
  rules?: string | null
  checklist?: { text: string; checked: boolean }[] | null
  created_at?: string
}

export interface ChecklistItem {
  id: string
  date: string
  section: 'Pre Market' | 'Post Market'
  text: string
  completed: boolean
}
