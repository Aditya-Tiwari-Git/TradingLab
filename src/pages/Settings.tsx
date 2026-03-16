import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'

export const Settings = () => {
  return (
    <AppShell>
      <TopBar title="Settings" subtitle="Personalize your TradeLab experience." />
      <Card>
        <h3 className="text-sm font-semibold text-slate-200">Preferences</h3>
        <p className="mt-2 text-sm text-slate-500">More settings coming soon.</p>
      </Card>
    </AppShell>
  )
}
