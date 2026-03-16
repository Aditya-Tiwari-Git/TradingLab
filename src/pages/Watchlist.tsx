import { useEffect, useState } from 'react'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Textarea } from '../components/ui/Textarea'
import { createWatchlistItem, deleteWatchlistItem, fetchWatchlist } from '../services/watchlist'
import type { WatchlistItem } from '../types'

export const Watchlist = () => {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [assetName, setAssetName] = useState('')
  const [notes, setNotes] = useState('')
  const [reason, setReason] = useState('')

  const load = async () => {
    setItems(await fetchWatchlist())
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = async () => {
    if (!assetName.trim()) return
    await createWatchlistItem({ asset_name: assetName, notes, reason })
    setAssetName('')
    setNotes('')
    setReason('')
    await load()
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Remove from watchlist?')) return
    await deleteWatchlistItem(id)
    await load()
  }

  return (
    <AppShell>
      <TopBar title="Watchlist" subtitle="Track assets you are watching." />
      <Card>
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Asset Name" required value={assetName} onChange={(e) => setAssetName(e.target.value)} />
          <Textarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <Textarea label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleAdd}>Add to Watchlist</Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <h3 className="text-sm font-semibold text-slate-200">{item.asset_name}</h3>
            <p className="mt-2 text-xs text-slate-500">{item.reason}</p>
            <p className="mt-2 text-xs text-slate-400">{item.notes}</p>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" onClick={() => handleDelete(item.id)}>
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  )
}

