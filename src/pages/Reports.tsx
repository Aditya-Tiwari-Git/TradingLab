import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Select } from '../components/ui/Select'
import { Input } from '../components/ui/Input'
import { fetchTrades, createTrade } from '../services/trades'
import type { Trade } from '../types'

type FilterRow = {
  id: string
  field: string
  operator: string
  value: string
}

type FieldType = 'text' | 'select' | 'number' | 'date' | 'boolean'

const filterFields: { id: string; label: string; type: FieldType; options?: string[] }[] = [
  { id: 'asset', label: 'Asset', type: 'text' },
  { id: 'direction', label: 'Direction', type: 'select', options: ['Long', 'Short'] },
  { id: 'result', label: 'Result', type: 'select', options: ['Win', 'Loss', 'Breakeven'] },
  { id: 'timeframe', label: 'Timeframe', type: 'text' },
  { id: 'strategy_id', label: 'Strategy ID', type: 'text' },
  { id: 'setup_type', label: 'Setup Type', type: 'text' },
  { id: 'emotional_state', label: 'Emotional State', type: 'text' },
  { id: 'rule_followed', label: 'Rule Followed', type: 'boolean', options: ['Yes', 'No'] },
  { id: 'mistake_category', label: 'Mistake Category', type: 'text' },
  { id: 'trade_code', label: 'Trade ID', type: 'text' },
  { id: 'profit_loss', label: 'Profit/Loss', type: 'number' },
  { id: 'entry_price', label: 'Entry Price', type: 'number' },
  { id: 'exit_price', label: 'Exit Price', type: 'number' },
  { id: 'position_size', label: 'Position Size', type: 'number' },
  { id: 'risk_per_trade', label: 'Risk / Trade', type: 'number' },
  { id: 'rr_ratio', label: 'R:R', type: 'number' },
  { id: 'date', label: 'Date', type: 'date' },
]

const operatorsByType: Record<FieldType, { label: string; value: string }[]> = {
  text: [
    { label: 'Contains', value: 'contains' },
    { label: 'Equals', value: 'equals' },
    { label: 'Not equals', value: 'not_equals' },
  ],
  select: [
    { label: 'Equals', value: 'equals' },
    { label: 'Not equals', value: 'not_equals' },
  ],
  boolean: [
    { label: 'Equals', value: 'equals' },
    { label: 'Not equals', value: 'not_equals' },
  ],
  number: [
    { label: '=', value: 'equals' },
    { label: '>', value: 'gt' },
    { label: '>=', value: 'gte' },
    { label: '<', value: 'lt' },
    { label: '<=', value: 'lte' },
  ],
  date: [
    { label: 'On', value: 'equals' },
    { label: 'Before', value: 'lt' },
    { label: 'After', value: 'gt' },
  ],
}

const getTradeField = (trade: Trade, field: string) => (trade as unknown as Record<string, unknown>)[field]

const toCsv = (trades: Trade[]) => {
  const headers = [
    'date',
    'asset',
    'direction',
    'strategy_id',
    'setup_type',
    'timeframe',
    'entry_price',
    'exit_price',
    'stop_loss',
    'position_size',
    'risk_per_trade',
    'rr_ratio',
    'profit_loss',
    'result',
    'emotional_state',
    'rule_followed',
    'mistake_category',
  ]
  const rows = trades.map((trade) =>
    headers
      .map((header) => {
        const value = getTradeField(trade, header)
        return value === null || value === undefined ? '' : String(value)
      })
      .join(',')
  )
  return `${headers.join(',')}\n${rows.join('\n')}`
}

export const Reports = () => {
  const [trades, setTrades] = useState<Trade[]>([])
  const [importStatus, setImportStatus] = useState('')
  const [draftLogic, setDraftLogic] = useState<'and' | 'or'>('and')
  const [appliedLogic, setAppliedLogic] = useState<'and' | 'or'>('and')
  const [draftFilters, setDraftFilters] = useState<FilterRow[]>([
    { id: crypto.randomUUID(), field: 'asset', operator: 'contains', value: '' },
  ])
  const [appliedFilters, setAppliedFilters] = useState<FilterRow[]>(draftFilters)
  const [previewColumns, setPreviewColumns] = useState([
    'date',
    'asset',
    'direction',
    'result',
    'profit_loss',
    'rr_ratio',
    'entry_price',
    'exit_price',
    'stop_loss',
    'position_size',
  ])

  useEffect(() => {
    fetchTrades().then(setTrades)
  }, [])

  const filteredTrades = useMemo(() => {
    const active = appliedFilters.filter((filter) => filter.value.trim() !== '')
    if (active.length === 0) return trades

    const matchesFilter = (trade: Trade, filter: FilterRow) => {
      const fieldDef = filterFields.find((field) => field.id === filter.field)
      if (!fieldDef) return true
      const raw = getTradeField(trade, filter.field)
      const value = filter.value.trim()

      if (fieldDef.type === 'number') {
        const tradeValue = typeof raw === 'number' ? raw : Number(raw)
        const filterValue = Number(value)
        if (Number.isNaN(tradeValue) || Number.isNaN(filterValue)) return false
        if (filter.operator === 'gt') return tradeValue > filterValue
        if (filter.operator === 'gte') return tradeValue >= filterValue
        if (filter.operator === 'lt') return tradeValue < filterValue
        if (filter.operator === 'lte') return tradeValue <= filterValue
        return tradeValue === filterValue
      }

      if (fieldDef.type === 'date') {
        const tradeValue = raw ? new Date(String(raw)).getTime() : 0
        const filterValue = new Date(value).getTime()
        if (!tradeValue || Number.isNaN(filterValue)) return false
        if (filter.operator === 'gt') return tradeValue > filterValue
        if (filter.operator === 'lt') return tradeValue < filterValue
        return tradeValue === filterValue
      }

      if (fieldDef.type === 'boolean') {
        const tradeValue = raw === true ? 'Yes' : raw === false ? 'No' : ''
        if (filter.operator === 'not_equals') return tradeValue !== value
        return tradeValue === value
      }

      const tradeValue = String(raw ?? '').toLowerCase()
      const compareValue = value.toLowerCase()
      if (filter.operator === 'contains') return tradeValue.includes(compareValue)
      if (filter.operator === 'not_equals') return tradeValue !== compareValue
      return tradeValue === compareValue
    }

    return trades.filter((trade) =>
      appliedLogic === 'and'
        ? active.every((filter) => matchesFilter(trade, filter))
        : active.some((filter) => matchesFilter(trade, filter))
    )
  }, [appliedFilters, appliedLogic, trades])

  const handleRunQuery = () => {
    setAppliedFilters(draftFilters)
    setAppliedLogic(draftLogic)
  }

  const clearFilters = () => {
    const base = { id: crypto.randomUUID(), field: 'asset', operator: 'contains', value: '' }
    setDraftFilters([base])
    setAppliedFilters([base])
    setDraftLogic('and')
    setAppliedLogic('and')
  }

  const handleExport = () => {
    const csv = toCsv(filteredTrades)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `trades-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleImport = async (file: File) => {
    const text = await file.text()
    const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean)
    const headers = headerLine.split(',').map((h) => h.trim())
    let imported = 0
    for (const line of lines) {
      const values = line.split(',')
      const payload: Record<string, string> = {}
      headers.forEach((header, index) => {
        payload[header] = values[index]
      })
      if (!payload.date || !payload.asset) continue
      await createTrade({
        date: payload.date,
        asset: payload.asset,
        direction: (payload.direction as 'Long' | 'Short') || 'Long',
        strategy_id: payload.strategy_id || null,
        setup_type: payload.setup_type || null,
        timeframe: payload.timeframe || null,
        entry_price: Number(payload.entry_price) || null,
        exit_price: Number(payload.exit_price) || null,
        stop_loss: Number(payload.stop_loss) || null,
        position_size: Number(payload.position_size) || null,
        risk_per_trade: Number(payload.risk_per_trade) || null,
        rr_ratio: Number(payload.rr_ratio) || null,
        profit_loss: Number(payload.profit_loss) || null,
        result: (payload.result as 'Win' | 'Loss' | 'Breakeven') || null,
        emotional_state: payload.emotional_state || null,
        mistake_category: payload.mistake_category || null,
        rule_followed: payload.rule_followed === 'true',
      })
      imported += 1
    }
    setImportStatus(`Imported ${imported} trades.`)
    setTrades(await fetchTrades())
  }

  return (
    <AppShell>
      <TopBar title="Reports" subtitle="Run filtered queries and export results." />

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.9fr]">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Trade Filters</h3>
              <p className="text-xs text-slate-500">Build layered filters using AND/OR logic.</p>
            </div>
            <Select
              label="Logic"
              value={draftLogic}
              onChange={(e) => setDraftLogic(e.target.value as 'and' | 'or')}
            >
              <option value="and">AND (all conditions)</option>
              <option value="or">OR (any condition)</option>
            </Select>
          </div>

          <div className="mt-6 space-y-3">
            {draftFilters.map((filter) => {
              const fieldDef = filterFields.find((field) => field.id === filter.field) ?? filterFields[0]
              const operators = operatorsByType[fieldDef.type] ?? operatorsByType.text
              return (
                <div key={filter.id} className="grid gap-3 md:grid-cols-[1.2fr_1fr_1.6fr_auto]">
                  <Select
                    label="Field"
                    value={filter.field}
                    onChange={(e) =>
                      setDraftFilters((prev) =>
                        prev.map((item) =>
                          item.id === filter.id
                            ? {
                                ...item,
                                field: e.target.value,
                                operator: operatorsByType[filterFields.find((f) => f.id === e.target.value)?.type ?? 'text'][0]
                                  .value,
                              }
                            : item
                        )
                      )
                    }
                  >
                    {filterFields.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.label}
                      </option>
                    ))}
                  </Select>

                  <Select
                    label="Operator"
                    value={filter.operator}
                    onChange={(e) =>
                      setDraftFilters((prev) =>
                        prev.map((item) => (item.id === filter.id ? { ...item, operator: e.target.value } : item))
                      )
                    }
                  >
                    {operators.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </Select>

                  {fieldDef.type === 'select' || fieldDef.type === 'boolean' ? (
                    <Select
                      label="Value"
                      value={filter.value}
                      onChange={(e) =>
                        setDraftFilters((prev) =>
                          prev.map((item) => (item.id === filter.id ? { ...item, value: e.target.value } : item))
                        )
                      }
                    >
                      <option value="">Select</option>
                      {fieldDef.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  ) : (
                    <Input
                      label="Value"
                      type={fieldDef.type === 'number' ? 'number' : fieldDef.type === 'date' ? 'date' : 'text'}
                      value={filter.value}
                      onChange={(e) =>
                        setDraftFilters((prev) =>
                          prev.map((item) => (item.id === filter.id ? { ...item, value: e.target.value } : item))
                        )
                      }
                    />
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    className="h-11 self-end"
                    onClick={() => setDraftFilters((prev) => prev.filter((item) => item.id !== filter.id))}
                  >
                    Remove
                  </Button>
                </div>
              )
            })}

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setDraftFilters((prev) => [
                    ...prev,
                    { id: crypto.randomUUID(), field: 'asset', operator: 'contains', value: '' },
                  ])
                }
              >
                Add Filter
              </Button>
              <Button type="button" onClick={handleRunQuery}>
                Run Query
              </Button>
              <Button type="button" variant="ghost" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Export & Import</h3>
              <p className="text-xs text-slate-500">
                Export {filteredTrades.length} trades based on the last run query or import CSV.
              </p>
            </div>
            <Button onClick={handleExport}>Export Results</Button>
            <label className="text-xs text-slate-400">
              Import CSV
              <input
                type="file"
                accept=".csv"
                className="mt-2 block text-xs text-slate-300"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void handleImport(file)
                }}
              />
            </label>
            {importStatus ? <p className="text-xs text-emerald-300">{importStatus}</p> : null}
          </div>
        </Card>
      </section>

      <Card className="mt-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Results Preview</h3>
            <p className="text-xs text-slate-500">
              Showing {filteredTrades.length} records from the last run query.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            {[
              'date',
              'asset',
              'direction',
              'result',
              'profit_loss',
              'rr_ratio',
              'entry_price',
              'exit_price',
              'stop_loss',
              'position_size',
              'risk_per_trade',
              'timeframe',
              'strategy_id',
              'setup_type',
              'trade_code',
              'emotional_state',
              'rule_followed',
              'mistake_category',
              'created_at',
            ].map((col) => (
              <label key={col} className="flex items-center gap-2 rounded-full border border-bg-700/70 bg-bg-900/60 px-3 py-1">
                <input
                  type="checkbox"
                  checked={previewColumns.includes(col)}
                  onChange={(e) =>
                    setPreviewColumns((prev) =>
                      e.target.checked ? [...prev, col] : prev.filter((item) => item !== col)
                    )
                  }
                />
                {col.replace('_', ' ')}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-x-auto rounded-2xl border border-bg-700/70 bg-bg-900/40">
          <table className="w-full text-sm">
            <thead className="bg-bg-900/80 text-xs uppercase text-slate-500">
              <tr>
                {previewColumns.map((col) => (
                  <th key={col} className="px-4 py-3 text-left">
                    {col.replace('_', ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-bg-800/60">
              {filteredTrades.slice(0, 50).map((trade) => (
                <tr key={trade.id} className="hover:bg-bg-900/60">
                  {previewColumns.map((col) => (
                    <td key={`${trade.id}-${col}`} className="px-4 py-3 text-slate-300">
                      {String(getTradeField(trade, col) ?? '--')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTrades.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-500">No results found. Adjust filters and run query again.</div>
          ) : null}
        </div>
      </Card>
    </AppShell>
  )
}
