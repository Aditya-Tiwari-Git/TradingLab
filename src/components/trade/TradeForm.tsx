import { useEffect, useMemo, useState } from 'react'
import type { Strategy, Trade } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { ChipInput } from '../ui/ChipInput'
import { useSettings } from '../../hooks/useSettings'

interface TradeFormProps {
  strategies: Strategy[]
  initial?: Partial<Trade> & { tags?: string[] }
  onSave: (trade: Partial<Trade>, tags: string[]) => Promise<void>
  onCancel: () => void
}

const defaultTrade: Partial<Trade> = {
  date: new Date().toISOString().split('T')[0],
  direction: 'Long',
  result: 'Breakeven',
  timeframe: '1H',
}

const parseNumber = (value: string) => (value === '' ? null : Number(value))
const parseNonNegative = (value: string) => {
  if (value === '') return null
  const num = Number(value)
  if (Number.isNaN(num)) return null
  return Math.max(0, num)
}

const toNumber = (value: unknown) => (typeof value === 'number' && Number.isFinite(value) ? value : null)

export const TradeForm = ({ strategies, initial, onSave, onCancel }: TradeFormProps) => {
  const { settings } = useSettings()
  const [autoCalc, setAutoCalc] = useState(
    () => !(initial && (!initial.entry_price || !initial.exit_price || !initial.position_size))
  )
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const resolvedDefaults = useMemo(
    () => ({
      ...defaultTrade,
      asset: settings.defaultAsset || '',
      direction: settings.defaultDirection ?? defaultTrade.direction,
      timeframe: settings.defaultTimeframe ?? defaultTrade.timeframe,
    }),
    [settings.defaultAsset, settings.defaultDirection, settings.defaultTimeframe]
  )

  const [trade, setTrade] = useState<Partial<Trade>>({ ...resolvedDefaults, ...initial })
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])

  const assetOptions =
    trade.asset && !settings.assets.includes(trade.asset) ? [trade.asset, ...settings.assets] : settings.assets

  useEffect(() => {
    setTrade({ ...resolvedDefaults, ...initial })
    setTags(initial?.tags ?? [])
    if (initial) {
      setAutoCalc(!( !initial.entry_price || !initial.exit_price || !initial.position_size ))
    } else {
      setAutoCalc(true)
    }
  }, [initial, resolvedDefaults])

  const updateField = (field: keyof Trade, value: string | number | boolean | null) => {
    setTrade((prev) => ({ ...prev, [field]: value }))
  }

  const computed = useMemo(() => {
    const entry = toNumber(trade.entry_price)
    const exit = toNumber(trade.exit_price)
    const position = toNumber(trade.position_size)
    const stop = toNumber(trade.stop_loss)
    const direction = trade.direction ?? 'Long'

    let pnl: number | null = null
    if (entry !== null && exit !== null && position !== null) {
      const multiplier = direction === 'Short' ? -1 : 1
      pnl = (exit - entry) * position * multiplier
    }

    let rr: number | null = null
    if (entry !== null && exit !== null && stop !== null) {
      const risk = direction === 'Short' ? stop - entry : entry - stop
      const reward = direction === 'Short' ? entry - exit : exit - entry
      if (risk > 0) rr = reward / risk
    }

    let returnPct: number | null = null
    if (pnl !== null && entry !== null && position !== null && entry * position !== 0) {
      returnPct = (pnl / (entry * position)) * 100
    }

    return { pnl, rr, returnPct }
  }, [trade.direction, trade.entry_price, trade.exit_price, trade.position_size, trade.stop_loss])

  useEffect(() => {
    if (!autoCalc) return
    setTrade((prev) => {
      let changed = false
      const next = { ...prev }

      if (computed.pnl !== null) {
        const pnl = Number(computed.pnl.toFixed(2))
        if (prev.profit_loss !== pnl) {
          next.profit_loss = pnl
          changed = true
        }
        const result = pnl > 0 ? 'Win' : pnl < 0 ? 'Loss' : 'Breakeven'
        if (prev.result !== result) {
          next.result = result
          changed = true
        }
      }

      if (computed.rr !== null && Number.isFinite(computed.rr)) {
        const rr = Number(computed.rr.toFixed(2))
        if (prev.rr_ratio !== rr) {
          next.rr_ratio = rr
          changed = true
        }
      }

      return changed ? next : prev
    })
  }, [autoCalc, computed.pnl, computed.rr])

  const handleSubmit = async () => {
    setError(null)
    if (!trade.asset || !trade.date || !trade.direction) {
      setError('Please fill Asset, Date, and Direction before saving.')
      return
    }

    const nonNegativeChecks: [string, number | null | undefined][] = [
      ['Entry Price', trade.entry_price],
      ['Exit Price', trade.exit_price],
      ['Stop Loss', trade.stop_loss],
      ['Position Size', trade.position_size],
      ['Risk per Trade', trade.risk_per_trade],
    ]
    const negativeFields = nonNegativeChecks
      .filter(([, value]) => typeof value === 'number' && value < 0)
      .map(([label]) => label)
    if (negativeFields.length) {
      setError(`These fields cannot be negative: ${negativeFields.join(', ')}`)
      return
    }

    const cleaned: Partial<Trade> = {}
    Object.entries(trade).forEach(([key, value]) => {
      if (key === 'tags') return
      if (value === undefined) return
      if (typeof value === 'number' && Number.isNaN(value)) {
        cleaned[key as keyof Trade] = null
        return
      }
      cleaned[key as keyof Trade] = value as never
    })

    setLoading(true)
    try {
      await onSave(cleaned, tags)
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : typeof (err as { message?: string })?.message === 'string'
            ? String((err as { message?: string }).message)
            : `Failed to save trade. ${JSON.stringify(err)}`
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Input
          label="Date"
          type="date"
          required
          hint="Trade date"
          value={trade.date ?? ''}
          onChange={(e) => updateField('date', e.target.value)}
        />
        <Select
          label="Asset"
          required
          hint="Select the traded symbol"
          value={trade.asset ?? ''}
          onChange={(e) => updateField('asset', e.target.value)}
        >
          <option value="" disabled>
            Select asset
          </option>
          {assetOptions.map((asset) => (
            <option key={asset} value={asset}>
              {asset}
            </option>
          ))}
        </Select>
        <Select
          label="Direction"
          required
          hint="Long or short"
          value={trade.direction ?? 'Long'}
          onChange={(e) => updateField('direction', e.target.value)}
        >
          <option value="Long">Long</option>
          <option value="Short">Short</option>
        </Select>
        <Select
          label="Strategy"
          hint="Optional strategy mapping"
          value={trade.strategy_id ?? ''}
          onChange={(e) => updateField('strategy_id', e.target.value || null)}
        >
          <option value="">None</option>
          {strategies.map((strategy) => (
            <option key={strategy.id} value={strategy.id}>
              {strategy.name}
            </option>
          ))}
        </Select>
        <Input
          label="Timeframe"
          hint="Chart timeframe used for setup"
          value={trade.timeframe ?? ''}
          onChange={(e) => updateField('timeframe', e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Input
          label="Entry Price"
          type="number"
          min={0}
          hint="Price at entry"
          value={trade.entry_price ?? ''}
          onChange={(e) => updateField('entry_price', parseNonNegative(e.target.value))}
        />
        <Input
          label="Exit Price"
          type="number"
          min={0}
          hint="Price at exit"
          value={trade.exit_price ?? ''}
          onChange={(e) => updateField('exit_price', parseNonNegative(e.target.value))}
        />
        <Input
          label="Stop Loss"
          type="number"
          min={0}
          hint="Stop loss price"
          value={trade.stop_loss ?? ''}
          onChange={(e) => updateField('stop_loss', parseNonNegative(e.target.value))}
        />
        <Input
          label="Position Size"
          type="number"
          min={0}
          hint="Units or contracts traded"
          value={trade.position_size ?? ''}
          onChange={(e) => updateField('position_size', parseNonNegative(e.target.value))}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3 text-sm text-slate-300">
        <div>
          <p className="text-slate-100">Auto-calculation</p>
          <p className="text-xs text-slate-500">P/L, R:R, and result auto-update from entry, exit, and size.</p>
        </div>
        <label className="flex items-center gap-2 text-xs text-slate-300">
          <input type="checkbox" checked={autoCalc} onChange={(e) => setAutoCalc(e.target.checked)} />
          Auto-calc P/L &amp; R:R
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Input
          label="Profit / Loss"
          type="number"
          hint="Auto-calculated when enabled"
          value={trade.profit_loss ?? ''}
          onChange={(e) => updateField('profit_loss', parseNumber(e.target.value))}
          disabled={autoCalc}
        />
        <Select
          label="Result"
          hint="Auto-set from P/L when enabled"
          value={trade.result ?? 'Breakeven'}
          onChange={(e) => updateField('result', e.target.value)}
          disabled={autoCalc}
        >
          <option value="Win">Win</option>
          <option value="Loss">Loss</option>
          <option value="Breakeven">Breakeven</option>
        </Select>
        <Input
          label="Return %"
          type="number"
          hint="Calculated from P/L and position size"
          value={computed.returnPct !== null ? computed.returnPct.toFixed(2) : ''}
          readOnly
        />
      </div>

      <ChipInput
        label="Tags"
        hint="Used for filtering and analytics"
        values={tags}
        onChange={setTags}
        placeholder="breakout, pullback, fomo"
        suggestions={settings.tagOptions}
      />

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Textarea
          label="Post-trade reflection"
          hint="What happened after execution"
          value={trade.post_trade_reflection ?? ''}
          onChange={(e) => updateField('post_trade_reflection', e.target.value)}
        />
        <Textarea
          label="Notes"
          hint="Pre-trade reasoning or context"
          value={trade.pre_trade_reasoning ?? ''}
          onChange={(e) => updateField('pre_trade_reasoning', e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-bg-700/70 bg-bg-900/50 px-4 py-3 text-sm text-slate-300">
        <div>
          <p className="text-slate-100">Advanced fields</p>
          <p className="text-xs text-slate-500">Psychology, risk, and detailed review fields.</p>
        </div>
        <Button variant="secondary" type="button" onClick={() => setShowAdvanced((prev) => !prev)}>
          {showAdvanced ? 'Hide' : 'Show'}
        </Button>
      </div>

      {showAdvanced ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <Input label="Trade ID" value={trade.trade_code ?? ''} onChange={(e) => updateField('trade_code', e.target.value)} />
          <Input label="Setup Type" value={trade.setup_type ?? ''} onChange={(e) => updateField('setup_type', e.target.value)} />
          <Input
            label="Risk per Trade"
            type="number"
            min={0}
            value={trade.risk_per_trade ?? ''}
            onChange={(e) => updateField('risk_per_trade', parseNonNegative(e.target.value))}
          />
          <Input
            label="Risk Reward Ratio"
            type="number"
            value={trade.rr_ratio ?? ''}
            onChange={(e) => updateField('rr_ratio', parseNumber(e.target.value))}
            disabled={autoCalc}
          />
          <Select
            label="Emotional State"
            value={trade.emotional_state ?? ''}
            onChange={(e) => updateField('emotional_state', e.target.value)}
          >
            <option value="">Not set</option>
            <option value="Calm">Calm</option>
            <option value="Fear">Fear</option>
            <option value="FOMO">FOMO</option>
            <option value="Overconfidence">Overconfidence</option>
          </Select>
          <Select
            label="Rule Followed"
            value={trade.rule_followed === null || trade.rule_followed === undefined ? '' : trade.rule_followed ? 'yes' : 'no'}
            onChange={(e) => updateField('rule_followed', e.target.value === '' ? null : e.target.value === 'yes')}
          >
            <option value="">Not set</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </Select>
          <Input
            label="Mistake Category"
            value={trade.mistake_category ?? ''}
            onChange={(e) => updateField('mistake_category', e.target.value)}
            placeholder="entered early, no stop loss"
          />
          <Textarea
            label="What went right"
            value={trade.what_went_right ?? ''}
            onChange={(e) => updateField('what_went_right', e.target.value)}
          />
          <Textarea
            label="What went wrong"
            value={trade.what_went_wrong ?? ''}
            onChange={(e) => updateField('what_went_wrong', e.target.value)}
          />
          <Textarea
            label="Lessons learned"
            value={trade.lessons_learned ?? ''}
            onChange={(e) => updateField('lessons_learned', e.target.value)}
          />
        </div>
      ) : null}

      <div className="flex justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Saving...' : 'Save Trade'}
        </Button>
      </div>
    </div>
  )
}
