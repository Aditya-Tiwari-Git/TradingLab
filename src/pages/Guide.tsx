import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'

const sections = [
  {
    title: 'Dashboard',
    description: 'High-level performance snapshot with key KPIs and charts.',
    steps: ['Review win rate and PnL', 'Scan equity curve and monthly performance', 'Identify top/bottom trades'],
  },
  {
    title: 'Trades',
    description: 'Log trades, edit details, attach tags, and track outcomes.',
    steps: ['Use Quick Add or New Trade', 'Fill entry/exit details', 'Review auto-calculated P/L and R:R'],
  },
  {
    title: 'Calendar',
    description: 'See green/red days at a glance.',
    steps: ['Click a day to review trades', 'Spot consistency streaks'],
  },
  {
    title: 'Strategies',
    description: 'Define strategy rules and measure performance.',
    steps: ['Add strategies', 'Assign to trades', 'Compare PnL per strategy'],
  },
  {
    title: 'Playbook',
    description: 'Create setup templates and checklists.',
    steps: ['Define setup rules', 'Use checklist during trade review'],
  },
  {
    title: 'Watchlist',
    description: 'Track assets and catalysts you are monitoring.',
    steps: ['Add assets with reasons', 'Review notes before sessions'],
  },
  {
    title: 'Notes',
    description: 'Capture learning insights and psychology notes.',
    steps: ['Log market lessons', 'Tag key themes'],
  },
  {
    title: 'Analytics',
    description: 'Advanced stats for expectancy, drawdown, and streaks.',
    steps: ['Review profit factor', 'Track drawdown', 'Inspect streaks'],
  },
  {
    title: 'Reports',
    description: 'Build filters, run queries, and export results.',
    steps: ['Add filter conditions', 'Run query', 'Export CSV'],
  },
  {
    title: 'Calculator',
    description: 'Plan long-term investment growth with advanced assumptions.',
    steps: ['Set contributions and return assumptions', 'Review projected balance'],
  },
  {
    title: 'Customization',
    description: 'Configure defaults, assets, and chart preferences.',
    steps: ['Set default asset/timeframe', 'Manage asset universe', 'Tune chart tooltips'],
  },
]

export const Guide = () => {
  return (
    <AppShell>
      <TopBar title="Guide" subtitle="How to use every module in TradeLab." />

      <section className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <h3 className="text-sm font-semibold text-slate-200">{section.title}</h3>
            <p className="mt-2 text-xs text-slate-500">{section.description}</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {section.steps.map((step) => (
                <li key={step} className="rounded-xl border border-bg-700/70 bg-bg-900/50 px-3 py-2">
                  {step}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>
    </AppShell>
  )
}
