import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { fetchTrades } from '../services/trades'
import type { Trade } from '../types'
import { formatCurrency, safeNumber } from '../utils/metrics'
import { formatDate, getCalendarDays } from '../utils/dates'

export const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [trades, setTrades] = useState<Trade[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    fetchTrades().then(setTrades)
  }, [])

  const dailyTotals = useMemo(() => {
    const map: Record<string, number> = {}
    trades.forEach((trade) => {
      map[trade.date] = (map[trade.date] || 0) + safeNumber(trade.profit_loss)
    })
    return map
  }, [trades])

  const selectedTrades = useMemo(() => {
    if (!selectedDate) return []
    return trades.filter((trade) => trade.date === selectedDate)
  }, [selectedDate, trades])

  const days = getCalendarDays(currentMonth)

  return (
    <AppShell>
      <TopBar title="Trade Calendar" subtitle="Daily performance snapshot." />
      <div className="flex items-center gap-3">
        <button
          className="rounded-xl border border-bg-800/80 px-3 py-2 text-xs text-slate-300"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
        >
          Prev
        </button>
        <h3 className="text-sm font-semibold text-slate-200">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          className="rounded-xl border border-bg-800/80 px-3 py-2 text-xs text-slate-300"
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
        >
          Next
        </button>
      </div>

      <Card>
        <div className="grid grid-cols-7 gap-2 text-xs text-slate-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const key = formatDate(day.date)
            const total = dailyTotals[key] ?? 0
            const tone = total > 0 ? 'bg-emerald-500/15 text-emerald-300' : total < 0 ? 'bg-red-500/15 text-red-300' : 'bg-bg-900/60'
            return (
              <button
                key={`${key}-${index}`}
                onClick={() => setSelectedDate(key)}
                className={`flex flex-col gap-1 rounded-xl border border-bg-800/70 p-2 text-left text-xs transition hover:border-accent-400/40 ${day.isCurrentMonth ? tone : 'opacity-40'}`}
              >
                <span className="text-xs text-slate-300">{day.date.getDate()}</span>
                <span className="text-[10px]">{formatCurrency(total)}</span>
              </button>
            )
          })}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-slate-200">Trades for {selectedDate ?? 'Select a day'}</h3>
        <div className="mt-3 space-y-2 text-sm">
          {selectedTrades.map((trade) => (
            <div key={trade.id} className="flex items-center justify-between rounded-lg border border-bg-800 bg-bg-900/50 px-3 py-2">
              <div>
                <p className="text-slate-200">{trade.asset}</p>
                <p className="text-xs text-slate-500">{trade.direction} · {trade.timeframe}</p>
              </div>
              <span className={safeNumber(trade.profit_loss) >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                {formatCurrency(safeNumber(trade.profit_loss))}
              </span>
            </div>
          ))}
          {!selectedTrades.length && <p className="text-xs text-slate-500">No trades logged.</p>}
        </div>
      </Card>
    </AppShell>
  )
}

