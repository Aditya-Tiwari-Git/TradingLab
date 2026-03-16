import { useEffect, useMemo, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Modal } from '../components/ui/Modal'
import { TradeTable } from '../components/trade/TradeTable'
import { TradeForm } from '../components/trade/TradeForm'
import { fetchStrategies } from '../services/strategies'
import { createTrade, deleteTrade, fetchTagsForTrade, fetchTradeTagsMap, fetchTrades, updateTrade } from '../services/trades'
import type { Strategy, Trade } from '../types'
import { Badge } from '../components/ui/Badge'
import { formatCurrency, safeNumber } from '../utils/metrics'

const defaultFilters = {
  from: '',
  to: '',
  strategy: '',
  tag: '',
  asset: '',
  result: '',
  timeframe: '',
}

export const Trades = () => {
  const [trades, setTrades] = useState<Trade[]>([])
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [filters, setFilters] = useState(defaultFilters)
  const [tagsMap, setTagsMap] = useState<Record<string, string[]>>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTrade, setActiveTrade] = useState<Trade | null>(null)
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)

  const load = async () => {
    const [tradeData, strategyData, tagMap] = await Promise.all([fetchTrades(), fetchStrategies(), fetchTradeTagsMap()])
    setTrades(tradeData)
    setStrategies(strategyData)
    setTagsMap(tagMap)
    setSelectedTrade(tradeData[0] ?? null)
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openCreate()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const filteredTrades = useMemo(() => {
    return trades.filter((trade) => {
      const tradeTags = tagsMap[trade.id] || []
      const afterFrom = filters.from ? trade.date >= filters.from : true
      const beforeTo = filters.to ? trade.date <= filters.to : true
      const strategyMatch = filters.strategy ? trade.strategy_id === filters.strategy : true
      const tagMatch = filters.tag ? tradeTags.includes(filters.tag) : true
      const assetMatch = filters.asset ? trade.asset.toLowerCase().includes(filters.asset.toLowerCase()) : true
      const resultMatch = filters.result ? trade.result === filters.result : true
      const timeframeMatch = filters.timeframe ? trade.timeframe === filters.timeframe : true
      return afterFrom && beforeTo && strategyMatch && tagMatch && assetMatch && resultMatch && timeframeMatch
    })
  }, [trades, filters, tagsMap])

  const openCreate = () => {
    setActiveTrade(null)
    setActiveTags([])
    setModalOpen(true)
  }

  const openEdit = async (trade: Trade) => {
    const tags = await fetchTagsForTrade(trade.id)
    setActiveTrade(trade)
    setActiveTags(tags.map((tag) => tag.name))
    setModalOpen(true)
  }

  const handleSave = async (trade: Partial<Trade>, tags: string[]) => {
    if (activeTrade) {
      await updateTrade(activeTrade.id, trade, tags)
    } else {
      await createTrade(trade, tags)
    }
    setModalOpen(false)
    await load()
  }

  const handleDelete = async (trade: Trade) => {
    if (!window.confirm('Delete this trade?')) return
    await deleteTrade(trade.id)
    await load()
  }

  return (
    <AppShell>
      <TopBar title="Trades" subtitle="Log, review, and filter your trades." onQuickAdd={openCreate} />

      <Card className="sticky top-24 z-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <Input label="From" type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} />
            <Input label="To" type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} />
            <Select
              label="Strategy"
              value={filters.strategy}
              onChange={(e) => setFilters({ ...filters, strategy: e.target.value })}
            >
              <option value="">All</option>
              {strategies.map((strategy) => (
                <option key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </option>
              ))}
            </Select>
            <Input label="Tag" value={filters.tag} onChange={(e) => setFilters({ ...filters, tag: e.target.value })} />
            <Input label="Asset" value={filters.asset} onChange={(e) => setFilters({ ...filters, asset: e.target.value })} />
            <Select
              label="Result"
              value={filters.result}
              onChange={(e) => setFilters({ ...filters, result: e.target.value })}
            >
              <option value="">All</option>
              <option value="Win">Win</option>
              <option value="Loss">Loss</option>
              <option value="Breakeven">Breakeven</option>
            </Select>
            <Input
              label="Timeframe"
              value={filters.timeframe}
              onChange={(e) => setFilters({ ...filters, timeframe: e.target.value })}
            />
          </div>
          <Button onClick={openCreate}>New Trade</Button>
        </div>
      </Card>

      <section className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <TradeTable
          trades={filteredTrades}
          onEdit={openEdit}
          onDelete={handleDelete}
          onSelect={setSelectedTrade}
          selectedId={selectedTrade?.id ?? null}
        />
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Trade Details</h3>
              <p className="text-xs text-slate-500">Quick view of the selected trade.</p>
            </div>
            {selectedTrade ? (
              <Badge label={selectedTrade.result ?? 'Open'} tone={selectedTrade.result === 'Win' ? 'success' : selectedTrade.result === 'Loss' ? 'danger' : 'warning'} />
            ) : null}
          </div>
          {selectedTrade ? (
            <div className="mt-5 space-y-4 text-sm text-slate-300">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">Asset</p>
                  <p className="text-slate-100">{selectedTrade.asset}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Direction</p>
                  <p className="text-slate-100">{selectedTrade.direction}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Timeframe</p>
                  <p className="text-slate-100">{selectedTrade.timeframe ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Strategy</p>
                  <p className="text-slate-100">
                    {strategies.find((strategy) => strategy.id === selectedTrade.strategy_id)?.name ?? '—'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500">Tags</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(tagsMap[selectedTrade.id] || []).map((tag) => (
                    <Badge key={tag} label={tag} />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500">Profit / Loss</p>
                <p className={safeNumber(selectedTrade.profit_loss) >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                  {formatCurrency(safeNumber(selectedTrade.profit_loss))}
                </p>
              </div>
              <Button variant="secondary" onClick={() => openEdit(selectedTrade)}>
                Edit Trade
              </Button>
            </div>
          ) : (
            <p className="mt-4 text-xs text-slate-500">Select a trade to view details.</p>
          )}
        </Card>
      </section>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={activeTrade ? 'Edit Trade' : 'New Trade'}>
        <TradeForm
          strategies={strategies}
          initial={activeTrade ? { ...activeTrade, tags: activeTags } : undefined}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </AppShell>
  )
}
