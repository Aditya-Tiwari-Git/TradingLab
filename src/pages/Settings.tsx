import { useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Select } from '../components/ui/Select'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useTheme } from '../hooks/useTheme'
import { useSettings } from '../hooks/useSettings'
import { Badge } from '../components/ui/Badge'

export const Settings = () => {
  const { theme, toggleTheme } = useTheme()
  const { settings, updateSettings } = useSettings()
  const [newAsset, setNewAsset] = useState('')
  const [newTag, setNewTag] = useState('')

  const addAsset = () => {
    const trimmed = newAsset.trim().toUpperCase()
    if (!trimmed) return
    if (!settings.assets.includes(trimmed)) {
      const nextAssets = [...settings.assets, trimmed]
      updateSettings({
        assets: nextAssets,
        defaultAsset: settings.defaultAsset || trimmed,
      })
    }
    setNewAsset('')
  }

  const removeAsset = (asset: string) => {
    const nextAssets = settings.assets.filter((item) => item !== asset)
    const nextDefault = settings.defaultAsset === asset ? nextAssets[0] ?? '' : settings.defaultAsset
    updateSettings({ assets: nextAssets, defaultAsset: nextDefault })
  }

  const addTag = () => {
    const trimmed = newTag.trim().toLowerCase()
    if (!trimmed) return
    if (!settings.tagOptions.includes(trimmed)) {
      updateSettings({ tagOptions: [...settings.tagOptions, trimmed] })
    }
    setNewTag('')
  }

  const removeTag = (tag: string) => {
    updateSettings({ tagOptions: settings.tagOptions.filter((item) => item !== tag) })
  }

  return (
    <AppShell>
      <TopBar title="Customization" subtitle="Personalize how TradeLab looks and behaves." />

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Preferences</h3>
          <p className="mt-2 text-xs text-slate-500">Control core behavior and display density.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Select
              label="Currency"
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}
              hint="Used for P/L and portfolio calculations"
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

            <label className="flex items-center justify-between rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3 text-sm text-slate-300">
              <span>Show chart grid</span>
              <input
                type="checkbox"
                checked={settings.showChartGrid}
                onChange={(e) => updateSettings({ showChartGrid: e.target.checked })}
              />
            </label>

            <label className="flex items-center justify-between rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3 text-sm text-slate-300">
              <span>Show chart tooltips</span>
              <input
                type="checkbox"
                checked={settings.showTooltips}
                onChange={(e) => updateSettings({ showTooltips: e.target.checked })}
              />
            </label>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Trade Defaults</h3>
          <p className="mt-2 text-xs text-slate-500">Speed up entry with defaults for new trades.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Select
              label="Default Asset"
              value={settings.defaultAsset}
              onChange={(e) => updateSettings({ defaultAsset: e.target.value })}
              hint="Pre-selected when creating a new trade"
            >
              <option value="">None</option>
              {settings.assets.map((asset) => (
                <option key={asset} value={asset}>
                  {asset}
                </option>
              ))}
            </Select>
            <Select
              label="Default Timeframe"
              value={settings.defaultTimeframe}
              onChange={(e) => updateSettings({ defaultTimeframe: e.target.value })}
            >
              <option value="1D">1D</option>
              <option value="4H">4H</option>
              <option value="1H">1H</option>
              <option value="30M">30M</option>
              <option value="15M">15M</option>
              <option value="5M">5M</option>
            </Select>
            <Select
              label="Default Direction"
              value={settings.defaultDirection}
              onChange={(e) => updateSettings({ defaultDirection: e.target.value as 'Long' | 'Short' })}
            >
              <option value="Long">Long</option>
              <option value="Short">Short</option>
            </Select>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Asset Universe</h3>
          <p className="mt-2 text-xs text-slate-500">Manage assets used in the trade entry dropdown.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input
              label="Add Custom Asset"
              value={newAsset}
              onChange={(e) => setNewAsset(e.target.value.toUpperCase())}
              placeholder="E.g. NIFTY, BTCUSD"
            />
            <Button type="button" variant="secondary" className="h-11 self-end" onClick={addAsset} disabled={!newAsset.trim()}>
              Add Asset
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {settings.assets.map((asset) => (
              <div key={asset} className="flex items-center gap-2 rounded-full border border-bg-700/70 bg-bg-900/50 px-3 py-1 text-xs text-slate-300">
                <Badge label={asset} />
                <button onClick={() => removeAsset(asset)} className="text-xs text-red-400 hover:text-red-300">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Trading Tags</h3>
          <p className="mt-2 text-xs text-slate-500">Create searchable tag suggestions for trade entry.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Input
              label="Add Tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value.toLowerCase())}
              placeholder="breakout, pullback, fomo"
            />
            <Button type="button" variant="secondary" className="h-11 self-end" onClick={addTag} disabled={!newTag.trim()}>
              Add Tag
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {settings.tagOptions.map((tag) => (
              <div key={tag} className="flex items-center gap-2 rounded-full border border-bg-700/70 bg-bg-900/50 px-3 py-1 text-xs text-slate-300">
                <Badge label={tag} />
                <button onClick={() => removeTag(tag)} className="text-xs text-red-400 hover:text-red-300">
                  Remove
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Risk Guardrails</h3>
          <p className="mt-2 text-xs text-slate-500">Set daily limits to keep discipline consistent.</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Input
              label="Daily Loss Limit"
              type="number"
              min={0}
              value={settings.dailyLossLimit}
              onChange={(e) => updateSettings({ dailyLossLimit: Number(e.target.value) })}
            />
            <Input
              label="Max Trades / Day"
              type="number"
              min={0}
              value={settings.maxTrades}
              onChange={(e) => updateSettings({ maxTrades: Number(e.target.value) })}
            />
            <Input
              label="Risk Per Trade"
              type="number"
              min={0}
              value={settings.riskPerTrade}
              onChange={(e) => updateSettings({ riskPerTrade: Number(e.target.value) })}
            />
          </div>
        </Card>
      </section>
    </AppShell>
  )
}
