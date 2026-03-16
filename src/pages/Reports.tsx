import { useEffect, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { fetchTrades, createTrade } from '../services/trades'
import type { Trade } from '../types'

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
  ]
  const rows = trades.map((trade) =>
    headers
      .map((header) => {
        const value = (trade as Record<string, unknown>)[header]
        return value === null || value === undefined ? '' : String(value)
      })
      .join(',')
  )
  return `${headers.join(',')}\n${rows.join('\n')}`
}

export const Reports = () => {
  const [trades, setTrades] = useState<Trade[]>([])
  const [importStatus, setImportStatus] = useState('')

  useEffect(() => {
    fetchTrades().then(setTrades)
  }, [])

  const handleExport = () => {
    const csv = toCsv(trades)
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
      })
      imported += 1
    }
    setImportStatus(`Imported ${imported} trades.`)
    setTrades(await fetchTrades())
  }

  return (
    <AppShell>
      <TopBar title="Reports" subtitle="Export, import, and archive your trades." />
      <Card>
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={handleExport}>Export Trades to CSV</Button>
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
    </AppShell>
  )
}

