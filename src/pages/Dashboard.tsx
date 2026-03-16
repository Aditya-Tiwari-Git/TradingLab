import { useEffect, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { EquityCurve } from '../components/charts/EquityCurve'
import { MonthlyBar } from '../components/charts/MonthlyBar'
import { WinLossPie } from '../components/charts/WinLossPie'
import { StrategyBar } from '../components/charts/StrategyBar'
import { MetricCard } from '../components/ui/MetricCard'
import { fetchTrades } from '../services/trades'
import { fetchStrategies } from '../services/strategies'
import type { Trade, Strategy } from '../types'
import {
  averageRR,
  equityCurve,
  formatCurrency,
  formatNumber,
  monthlyPerformance,
  profitFactor,
  sumProfitLoss,
  winLossDistribution,
  winRate,
  strategyPerformance,
  safeNumber,
} from '../utils/metrics'
import { Activity, Percent, TrendingUp, DollarSign, Target } from 'lucide-react'

export const Dashboard = () => {
  const [trades, setTrades] = useState<Trade[]>([])
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [tradeData, strategyData] = await Promise.all([fetchTrades(), fetchStrategies()])
      setTrades(tradeData)
      setStrategies(strategyData)
      setLoading(false)
    }
    load()
  }, [])

  const totalTrades = trades.length
  const winRateValue = winRate(trades)
  const profitLoss = sumProfitLoss(trades)
  const avgRR = averageRR(trades)
  const pf = profitFactor(trades)
  const bestTrade = Math.max(0, ...trades.map((trade) => safeNumber(trade.profit_loss)))
  const worstTrade = Math.min(0, ...trades.map((trade) => safeNumber(trade.profit_loss)))

  return (
    <AppShell>
      <TopBar title="Dashboard" subtitle="Your trading performance at a glance." />
      {loading ? (
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Total Trades" value={String(totalTrades)} icon={Activity} />
            <MetricCard label="Win Rate" value={`${formatNumber(winRateValue, 1)}%`} icon={Percent} tone="info" />
            <MetricCard label="Total PnL" value={formatCurrency(profitLoss)} icon={DollarSign} tone={profitLoss >= 0 ? 'success' : 'danger'} />
            <MetricCard label="Profit Factor" value={pf === Infinity ? '∞' : formatNumber(pf, 2)} icon={TrendingUp} />
            <MetricCard label="Average R:R" value={formatNumber(avgRR, 2)} icon={Target} />
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <Card>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Equity Curve</h3>
                <p className="text-xs text-slate-500">Performance over time</p>
              </div>
              <EquityCurve data={equityCurve(trades)} />
            </Card>
            <Card>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Monthly Performance</h3>
                <p className="text-xs text-slate-500">Profit or loss per month</p>
              </div>
              <MonthlyBar data={monthlyPerformance(trades)} />
            </Card>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <Card>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Win / Loss Distribution</h3>
                <p className="text-xs text-slate-500">Outcome breakdown</p>
              </div>
              <WinLossPie data={winLossDistribution(trades)} />
            </Card>
            <Card>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Strategy Performance</h3>
                <p className="text-xs text-slate-500">Net profit by strategy</p>
              </div>
              <StrategyBar data={strategyPerformance(trades, strategies)} />
            </Card>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <Card>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Best Trade</h3>
                <p className="text-xs text-slate-500">Highest PnL captured</p>
              </div>
              <div className="text-3xl font-semibold text-emerald-300">{formatCurrency(bestTrade)}</div>
            </Card>
            <Card>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-slate-200">Worst Trade</h3>
                <p className="text-xs text-slate-500">Largest drawdown hit</p>
              </div>
              <div className="text-3xl font-semibold text-red-300">{formatCurrency(worstTrade)}</div>
            </Card>
          </section>
        </>
      )}
    </AppShell>
  )
}
