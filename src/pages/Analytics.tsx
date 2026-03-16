import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { StatCard } from '../components/ui/StatCard'
import { Card } from '../components/ui/Card'
import { fetchTrades } from '../services/trades'
import type { Trade } from '../types'
import {
  averageWinLoss,
  drawdown,
  expectancy,
  formatCurrency,
  formatNumber,
  profitFactor,
  consecutiveRuns,
} from '../utils/metrics'

export const Analytics = () => {
  const [trades, setTrades] = useState<Trade[]>([])

  useEffect(() => {
    fetchTrades().then(setTrades)
  }, [])

  const stats = useMemo(() => {
    const { avgWin, avgLoss } = averageWinLoss(trades)
    const pf = profitFactor(trades)
    const exp = expectancy(trades)
    const dd = drawdown(trades)
    const { maxWins, maxLosses } = consecutiveRuns(trades)
    const mistakeCounts = trades.reduce<Record<string, number>>((acc, trade) => {
      if (trade.mistake_category) {
        acc[trade.mistake_category] = (acc[trade.mistake_category] || 0) + 1
      }
      return acc
    }, {})
    const topMistakes = Object.entries(mistakeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5)
    return { avgWin, avgLoss, pf, exp, dd, maxWins, maxLosses, topMistakes }
  }, [trades])

  return (
    <AppShell>
      <TopBar title="Performance Analytics" subtitle="Advanced trading statistics." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Profit Factor" value={stats.pf === Infinity ? '∞' : formatNumber(stats.pf, 2)} />
        <StatCard label="Expectancy" value={formatCurrency(stats.exp)} />
        <StatCard label="Average Win" value={formatCurrency(stats.avgWin)} />
        <StatCard label="Average Loss" value={formatCurrency(stats.avgLoss)} />
        <StatCard label="Largest Drawdown" value={formatCurrency(stats.dd)} />
        <StatCard label="Consecutive Wins" value={String(stats.maxWins)} />
        <StatCard label="Consecutive Losses" value={String(stats.maxLosses)} />
      </section>

      <Card>
        <h3 className="text-sm font-semibold text-slate-200">Insights</h3>
        <ul className="mt-3 list-disc pl-5 text-sm text-slate-400">
          <li>Focus on setups that increase profit factor and expectancy.</li>
          <li>Use drawdown to calibrate risk per trade and daily limits.</li>
          <li>Track streaks to maintain discipline after a series of wins or losses.</li>
        </ul>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-slate-200">Most Common Mistakes</h3>
        <div className="mt-3 space-y-2 text-sm text-slate-400">
          {stats.topMistakes.length ? (
            stats.topMistakes.map(([mistake, count]) => (
              <div key={mistake} className="flex items-center justify-between rounded-lg border border-bg-800 bg-bg-900/50 px-3 py-2">
                <span>{mistake}</span>
                <span className="text-xs text-slate-500">{count} trades</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-500">No mistake data yet.</p>
          )}
        </div>
      </Card>
    </AppShell>
  )
}

