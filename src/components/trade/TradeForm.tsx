import { useEffect, useState } from 'react'
import type { Strategy, Trade } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Textarea } from '../ui/Textarea'
import { ChipInput } from '../ui/ChipInput'

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

export const TradeForm = ({ strategies, initial, onSave, onCancel }: TradeFormProps) => {
  const [trade, setTrade] = useState<Partial<Trade>>({ ...defaultTrade, ...initial })
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [loading, setLoading] = useState(false)

  const parseNumber = (value: string) => (value === '' ? null : Number(value))

  useEffect(() => {
    setTrade({ ...defaultTrade, ...initial })
    setTags(initial?.tags ?? [])
  }, [initial])

  const updateField = (field: keyof Trade, value: string | number | boolean | null) => {
    setTrade((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    await onSave(trade, tags)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Input label="Trade ID" value={trade.trade_code ?? ''} onChange={(e) => updateField('trade_code', e.target.value)} />
        <Input label="Date" type="date" value={trade.date ?? ''} onChange={(e) => updateField('date', e.target.value)} />
        <Input label="Asset" value={trade.asset ?? ''} onChange={(e) => updateField('asset', e.target.value)} />
        <Select label="Direction" value={trade.direction ?? 'Long'} onChange={(e) => updateField('direction', e.target.value)}>
          <option value="Long">Long</option>
          <option value="Short">Short</option>
        </Select>
        <Select
          label="Strategy"
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
        <Input label="Setup Type" value={trade.setup_type ?? ''} onChange={(e) => updateField('setup_type', e.target.value)} />
        <Input label="Timeframe" value={trade.timeframe ?? ''} onChange={(e) => updateField('timeframe', e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Input
          label="Entry Price"
          type="number"
          value={trade.entry_price ?? ''}
          onChange={(e) => updateField('entry_price', parseNumber(e.target.value))}
        />
        <Input
          label="Exit Price"
          type="number"
          value={trade.exit_price ?? ''}
          onChange={(e) => updateField('exit_price', parseNumber(e.target.value))}
        />
        <Input
          label="Stop Loss"
          type="number"
          value={trade.stop_loss ?? ''}
          onChange={(e) => updateField('stop_loss', parseNumber(e.target.value))}
        />
        <Input
          label="Position Size"
          type="number"
          value={trade.position_size ?? ''}
          onChange={(e) => updateField('position_size', parseNumber(e.target.value))}
        />
        <Input
          label="Risk per Trade"
          type="number"
          value={trade.risk_per_trade ?? ''}
          onChange={(e) => updateField('risk_per_trade', parseNumber(e.target.value))}
        />
        <Input
          label="Risk Reward Ratio"
          type="number"
          value={trade.rr_ratio ?? ''}
          onChange={(e) => updateField('rr_ratio', parseNumber(e.target.value))}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Input
          label="Profit / Loss"
          type="number"
          value={trade.profit_loss ?? ''}
          onChange={(e) => updateField('profit_loss', parseNumber(e.target.value))}
        />
        <Select label="Result" value={trade.result ?? 'Breakeven'} onChange={(e) => updateField('result', e.target.value)}>
          <option value="Win">Win</option>
          <option value="Loss">Loss</option>
          <option value="Breakeven">Breakeven</option>
        </Select>
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
      </div>

      <ChipInput label="Tags" values={tags} onChange={setTags} placeholder="breakout, pullback, fomo" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Textarea
          label="Pre-trade reasoning"
          value={trade.pre_trade_reasoning ?? ''}
          onChange={(e) => updateField('pre_trade_reasoning', e.target.value)}
        />
        <Textarea
          label="Post-trade reflection"
          value={trade.post_trade_reflection ?? ''}
          onChange={(e) => updateField('post_trade_reflection', e.target.value)}
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

