import type { Trade } from '../types'

const getCurrency = () => {
  if (typeof window === 'undefined') return 'USD'
  try {
    const raw = window.localStorage.getItem('tradelab-settings')
    if (!raw) return 'USD'
    const parsed = JSON.parse(raw) as { currency?: string }
    return parsed.currency || 'USD'
  } catch {
    return 'USD'
  }
}

export const formatCurrency = (value: number, currency = getCurrency()) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export const formatNumber = (value: number, digits = 2) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: digits,
  }).format(value)
}

export const safeNumber = (value: number | null | undefined) => value ?? 0

export const getTradeResult = (trade: Trade) =>
  trade.result ?? (safeNumber(trade.profit_loss) > 0 ? 'Win' : safeNumber(trade.profit_loss) < 0 ? 'Loss' : 'Breakeven')

export const sumProfitLoss = (trades: Trade[]) => trades.reduce((acc, trade) => acc + safeNumber(trade.profit_loss), 0)

export const averageRR = (trades: Trade[]) => {
  const values = trades.map((trade) => safeNumber(trade.rr_ratio)).filter((value) => value > 0)
  if (!values.length) return 0
  return values.reduce((acc, value) => acc + value, 0) / values.length
}

export const winRate = (trades: Trade[]) => {
  if (!trades.length) return 0
  const wins = trades.filter((trade) => getTradeResult(trade) === 'Win').length
  return (wins / trades.length) * 100
}

export const averageWinLoss = (trades: Trade[]) => {
  const wins = trades.filter((trade) => getTradeResult(trade) === 'Win').map((trade) => safeNumber(trade.profit_loss))
  const losses = trades.filter((trade) => getTradeResult(trade) === 'Loss').map((trade) => safeNumber(trade.profit_loss))
  const avgWin = wins.length ? wins.reduce((acc, val) => acc + val, 0) / wins.length : 0
  const avgLoss = losses.length ? losses.reduce((acc, val) => acc + val, 0) / losses.length : 0
  return { avgWin, avgLoss }
}

export const profitFactor = (trades: Trade[]) => {
  const gains = trades.filter((trade) => safeNumber(trade.profit_loss) > 0).reduce((acc, trade) => acc + safeNumber(trade.profit_loss), 0)
  const losses = trades.filter((trade) => safeNumber(trade.profit_loss) < 0).reduce((acc, trade) => acc + Math.abs(safeNumber(trade.profit_loss)), 0)
  if (losses === 0) return gains > 0 ? Infinity : 0
  return gains / losses
}

export const expectancy = (trades: Trade[]) => {
  const { avgWin, avgLoss } = averageWinLoss(trades)
  const winPct = winRate(trades) / 100
  const lossPct = 1 - winPct
  return avgWin * winPct + avgLoss * lossPct
}

export const equityCurve = (trades: Trade[]) => {
  const sorted = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  let equity = 0
  return sorted.map((trade, index) => {
    equity += safeNumber(trade.profit_loss)
    return {
      index: index + 1,
      date: trade.date,
      equity,
    }
  })
}

export const drawdown = (trades: Trade[]) => {
  const curve = equityCurve(trades)
  let peak = 0
  let maxDrawdown = 0
  curve.forEach((point) => {
    peak = Math.max(peak, point.equity)
    const dd = peak - point.equity
    maxDrawdown = Math.max(maxDrawdown, dd)
  })
  return maxDrawdown
}

export const consecutiveRuns = (trades: Trade[]) => {
  let maxWins = 0
  let maxLosses = 0
  let currentWins = 0
  let currentLosses = 0
  trades.forEach((trade) => {
    const result = getTradeResult(trade)
    if (result === 'Win') {
      currentWins += 1
      currentLosses = 0
    } else if (result === 'Loss') {
      currentLosses += 1
      currentWins = 0
    } else {
      currentWins = 0
      currentLosses = 0
    }
    maxWins = Math.max(maxWins, currentWins)
    maxLosses = Math.max(maxLosses, currentLosses)
  })
  return { maxWins, maxLosses }
}

export const monthlyPerformance = (trades: Trade[]) => {
  const buckets: Record<string, number> = {}
  trades.forEach((trade) => {
    const date = new Date(trade.date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    buckets[key] = (buckets[key] || 0) + safeNumber(trade.profit_loss)
  })
  return Object.entries(buckets)
    .sort((a, b) => (a[0] > b[0] ? 1 : -1))
    .map(([month, value]) => ({ month, value }))
}

export const strategyPerformance = (trades: Trade[], strategies: { id: string; name: string }[]) => {
  const map: Record<string, { name: string; value: number }> = {}
  strategies.forEach((strategy) => {
    map[strategy.id] = { name: strategy.name, value: 0 }
  })
  trades.forEach((trade) => {
    if (trade.strategy_id && map[trade.strategy_id]) {
      map[trade.strategy_id].value += safeNumber(trade.profit_loss)
    }
  })
  return Object.values(map).filter((entry) => entry.value !== 0)
}

export const winLossDistribution = (trades: Trade[]) => {
  const wins = trades.filter((trade) => getTradeResult(trade) === 'Win').length
  const losses = trades.filter((trade) => getTradeResult(trade) === 'Loss').length
  const breakeven = trades.filter((trade) => getTradeResult(trade) === 'Breakeven').length
  return [
    { name: 'Wins', value: wins },
    { name: 'Losses', value: losses },
    { name: 'Breakeven', value: breakeven },
  ]
}
