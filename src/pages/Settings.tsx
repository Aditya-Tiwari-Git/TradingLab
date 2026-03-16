import { useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Select'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useTheme } from '../hooks/useTheme'
import { useSettings } from '../hooks/useSettings'
import { formatCurrency, formatNumber } from '../utils/metrics'

export const Settings = () => {
  const { theme, toggleTheme } = useTheme()
  const { settings, updateSettings } = useSettings()

  const [initialInvestment, setInitialInvestment] = useState(10000)
  const [monthlyContribution, setMonthlyContribution] = useState(500)
  const [annualReturn, setAnnualReturn] = useState(10)
  const [years, setYears] = useState(10)
  const [compoundsPerYear, setCompoundsPerYear] = useState(12)

  const calculator = useMemo(() => {
    const r = annualReturn / 100 / compoundsPerYear
    const n = years * compoundsPerYear
    const contributionPerPeriod = monthlyContribution * (12 / compoundsPerYear)
    const growth = Math.pow(1 + r, n)
    const futureValue = initialInvestment * growth + (contributionPerPeriod * (growth - 1)) / (r || 1)
    const totalContributed = initialInvestment + monthlyContribution * 12 * years
    const interestEarned = futureValue - totalContributed
    return { futureValue, totalContributed, interestEarned }
  }, [annualReturn, compoundsPerYear, initialInvestment, monthlyContribution, years])

  return (
    <AppShell>
      <TopBar title="Settings" subtitle="Personalize your TradeLab experience." />

      <section className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Preferences</h3>
          <p className="mt-2 text-xs text-slate-500">Control how TradeLab behaves for your workflow.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Select
              label="Currency"
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="INR">INR - Indian Rupee</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="AUD">AUD - Australian Dollar</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </Select>

            <div className="flex flex-col gap-2 text-sm text-slate-300">
              <span className="text-xs uppercase tracking-wide text-slate-500">Theme</span>
              <Button variant="secondary" type="button" onClick={toggleTheme}>
                {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
              </Button>
            </div>

            <label className="flex items-center justify-between rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3 text-sm text-slate-300">
              <span>Compact tables</span>
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={(e) => updateSettings({ compactMode: e.target.checked })}
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3 text-sm text-slate-300">
              <span>Notifications</span>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => updateSettings({ notifications: e.target.checked })}
              />
            </label>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Investment Calculator</h3>
          <p className="mt-2 text-xs text-slate-500">Project future value with contributions and compounding.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input
              label="Initial Investment"
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
            />
            <Input
              label="Monthly Contribution"
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            />
            <Input
              label="Annual Return (%)"
              type="number"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
            />
            <Input
              label="Years"
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
            <Input
              label="Compounds / Year"
              type="number"
              value={compoundsPerYear}
              onChange={(e) => setCompoundsPerYear(Number(e.target.value))}
            />
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3">
              <p className="text-xs text-slate-500">Future Value</p>
              <p className="text-lg font-semibold text-slate-100">
                {formatCurrency(calculator.futureValue)}
              </p>
            </div>
            <div className="rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3">
              <p className="text-xs text-slate-500">Total Contributed</p>
              <p className="text-lg font-semibold text-slate-100">
                {formatCurrency(calculator.totalContributed)}
              </p>
            </div>
            <div className="rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3">
              <p className="text-xs text-slate-500">Interest Earned</p>
              <p className="text-lg font-semibold text-emerald-300">
                {formatCurrency(calculator.interestEarned)}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Assumes contributions at the end of each compounding period and a fixed annual return of {formatNumber(annualReturn, 2)}%.
          </p>
        </Card>
      </section>
    </AppShell>
  )
}
