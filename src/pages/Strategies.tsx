import { useEffect, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { fetchStrategies, createStrategy, deleteStrategy } from '../services/strategies'
import { fetchTrades } from '../services/trades'
import type { Strategy, Trade } from '../types'
import { formatCurrency, winRate, sumProfitLoss } from '../utils/metrics'

export const Strategies = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [rules, setRules] = useState('')

  const load = async () => {
    setStrategies(await fetchStrategies())
    setTrades(await fetchTrades())
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = async () => {
    if (!name.trim()) return
    await createStrategy({ name, description, rules })
    setName('')
    setDescription('')
    setRules('')
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this strategy?')) return
    await deleteStrategy(id)
    await load()
  }

  return (
    <AppShell>
      <TopBar title="Strategies" subtitle="Define and review your trading strategies." />
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Strategy Name" required value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Textarea label="Rules" value={rules} onChange={(e) => setRules(e.target.value)} />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleAdd}>Add Strategy</Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {strategies.map((strategy) => (
          <Card key={strategy.id}>
            <h3 className="text-sm font-semibold text-slate-200">{strategy.name}</h3>
            <p className="mt-2 text-xs text-slate-500">{strategy.description}</p>
            <p className="mt-2 text-xs text-slate-400">{strategy.rules}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
              <span>Win rate: {winRate(trades.filter((trade) => trade.strategy_id === strategy.id)).toFixed(1)}%</span>
              <span>Profit: {formatCurrency(sumProfitLoss(trades.filter((trade) => trade.strategy_id === strategy.id)))}</span>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={() => handleDelete(strategy.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}

