import { useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { formatCurrency, formatNumber } from '../utils/metrics'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useSettings } from '../hooks/useSettings'

type Frequency = 'monthly' | 'quarterly' | 'yearly'
type Timing = 'start' | 'end'

const frequencyToPeriods = (frequency: Frequency) => {
  if (frequency === 'quarterly') return 4
  if (frequency === 'yearly') return 1
  return 12
}

export const Calculator = () => {
  const { settings } = useSettings()
  const [initialInvestment, setInitialInvestment] = useState(15000)
  const [contribution, setContribution] = useState(500)
  const [frequency, setFrequency] = useState<Frequency>('monthly')
  const [annualReturn, setAnnualReturn] = useState(10)
  const [years, setYears] = useState(15)
  const [compoundsPerYear, setCompoundsPerYear] = useState(12)
  const [contributionGrowth, setContributionGrowth] = useState(2)
  const [inflation, setInflation] = useState(3)
  const [fee, setFee] = useState(0.4)
  const [timing, setTiming] = useState<Timing>('end')

  const projection = useMemo(() => {
    const monthsPerYear = 12
    const totalMonths = years * monthsPerYear
    const baseRate = annualReturn / 100
    const feeRate = fee / 100
    const netNominal = baseRate - feeRate
    const effectiveAnnual = Math.pow(1 + netNominal / compoundsPerYear, compoundsPerYear) - 1
    const monthlyRate = Math.pow(1 + effectiveAnnual, 1 / monthsPerYear) - 1
    const contributionPeriods = frequencyToPeriods(frequency)
    const contributionInterval = monthsPerYear / contributionPeriods
    const growthRate = contributionGrowth / 100

    let balance = initialInvestment
    let totalContributed = initialInvestment
    const schedule: { year: number; balance: number; contributed: number }[] = []

    for (let month = 1; month <= totalMonths; month += 1) {
      const yearIndex = Math.floor((month - 1) / monthsPerYear)
      const adjustedContribution = contribution * Math.pow(1 + growthRate, yearIndex)
      const shouldContribute = month % contributionInterval === 0

      if (timing === 'start' && shouldContribute) {
        balance += adjustedContribution
        totalContributed += adjustedContribution
      }

      balance *= 1 + monthlyRate

      if (timing === 'end' && shouldContribute) {
        balance += adjustedContribution
        totalContributed += adjustedContribution
      }

      if (month % monthsPerYear === 0) {
        schedule.push({
          year: yearIndex + 1,
          balance,
          contributed: totalContributed,
        })
      }
    }

    const futureValue = balance
    const realValue = futureValue / Math.pow(1 + inflation / 100, years)
    const interestEarned = futureValue - totalContributed
    return { schedule, futureValue, totalContributed, interestEarned, realValue }
  }, [annualReturn, compoundsPerYear, contribution, contributionGrowth, fee, frequency, inflation, initialInvestment, timing, years])

  const previewRows = useMemo(() => {
    const data = projection.schedule
    if (data.length <= 8) return data
    return [...data.slice(0, 4), ...data.slice(-4)]
  }, [projection.schedule])

  return (
    <AppShell>
      <TopBar title="Investment Calculator" subtitle="Model long-term portfolio growth with advanced assumptions." />

      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Assumptions</h3>
          <p className="mt-2 text-xs text-slate-500">Tune contributions, growth, inflation, and compounding.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input
              label="Initial Investment"
              type="number"
              min={0}
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
            />
            <Input
              label="Contribution Amount"
              type="number"
              min={0}
              value={contribution}
              onChange={(e) => setContribution(Number(e.target.value))}
            />
            <Select label="Contribution Frequency" value={frequency} onChange={(e) => setFrequency(e.target.value as Frequency)}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </Select>
            <Select label="Contribution Timing" value={timing} onChange={(e) => setTiming(e.target.value as Timing)}>
              <option value="end">End of period</option>
              <option value="start">Start of period</option>
            </Select>
            <Input
              label="Annual Return (%)"
              type="number"
              min={0}
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
            />
            <Input
              label="Years"
              type="number"
              min={0}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
            <Select
              label="Compounds / Year"
              value={String(compoundsPerYear)}
              onChange={(e) => setCompoundsPerYear(Number(e.target.value))}
            >
              <option value="12">Monthly (12)</option>
              <option value="4">Quarterly (4)</option>
              <option value="2">Semi-annual (2)</option>
              <option value="1">Annual (1)</option>
            </Select>
            <Input
              label="Annual Contribution Growth (%)"
              type="number"
              min={0}
              value={contributionGrowth}
              onChange={(e) => setContributionGrowth(Number(e.target.value))}
            />
            <Input
              label="Inflation (%)"
              type="number"
              min={0}
              value={inflation}
              onChange={(e) => setInflation(Number(e.target.value))}
            />
            <Input
              label="Fees / Expense Ratio (%)"
              type="number"
              min={0}
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3">
              <p className="text-xs text-slate-500">Future Value</p>
              <p className="text-lg font-semibold text-slate-100">{formatCurrency(projection.futureValue)}</p>
            </div>
            <div className="rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3">
              <p className="text-xs text-slate-500">Total Contributed</p>
              <p className="text-lg font-semibold text-slate-100">{formatCurrency(projection.totalContributed)}</p>
            </div>
            <div className="rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3">
              <p className="text-xs text-slate-500">Interest Earned</p>
              <p className="text-lg font-semibold text-emerald-300">{formatCurrency(projection.interestEarned)}</p>
            </div>
            <div className="rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3">
              <p className="text-xs text-slate-500">Real Value (Inflation)</p>
              <p className="text-lg font-semibold text-slate-100">{formatCurrency(projection.realValue)}</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Projection runs on monthly steps using the effective annual rate derived from the selected compounding.
            Contributions grow annually at {formatNumber(contributionGrowth, 1)}%.
          </p>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Growth Projection</h3>
          <p className="mt-2 text-xs text-slate-500">Balance vs. total contributions over time.</p>

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projection.schedule} margin={{ top: 10, right: 10, left: -10 }}>
                {settings.showChartGrid ? (
                  <CartesianGrid stroke="rgba(var(--chart-grid), 0.25)" strokeDasharray="3 3" vertical={false} />
                ) : null}
                <XAxis dataKey="year" tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }} />
                <YAxis
                  tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                {settings.showTooltips ? (
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(var(--bg-900), 0.96)',
                      border: '1px solid rgba(var(--bg-700), 0.7)',
                      borderRadius: '10px',
                      color: '#e2e8f0',
                    }}
                    labelStyle={{ color: 'rgb(var(--muted))', fontSize: 12 }}
                    itemStyle={{ color: '#e2e8f0' }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                ) : null}
                <Line type="monotone" dataKey="balance" stroke="rgb(var(--chart-primary))" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="contributed" stroke="rgb(var(--chart-secondary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6">
            <p className="text-xs text-slate-500">Yearly snapshot</p>
            <div className="mt-3 grid gap-2">
              {previewRows.map((row, index) => (
                <div
                  key={`${row.year}-${index}`}
                  className="flex items-center justify-between rounded-xl border border-bg-700/70 bg-bg-900/50 px-3 py-2 text-xs text-slate-300"
                >
                  <span>Year {row.year}</span>
                  <span className="text-slate-400">Contributed {formatCurrency(row.contributed)}</span>
                  <span className="text-slate-100">Balance {formatCurrency(row.balance)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </AppShell>
  )
}
