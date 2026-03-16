import { useState } from 'react'
import type { TradeLink } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface TradeLinksProps {
  links: TradeLink[]
  onAdd: (link: { url: string; label?: string; link_type?: string }) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export const TradeLinks = ({ links, onAdd, onDelete }: TradeLinksProps) => {
  const [url, setUrl] = useState('')
  const [label, setLabel] = useState('')
  const [type, setType] = useState('')

  const handleAdd = async () => {
    if (!url.trim()) return
    await onAdd({ url, label, link_type: type })
    setUrl('')
    setLabel('')
    setType('')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Input label="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
        <Input label="Label" value={label} onChange={(e) => setLabel(e.target.value)} />
        <Input label="Type" value={type} onChange={(e) => setType(e.target.value)} placeholder="news, tweet" />
      </div>
      <div className="flex justify-end">
        <Button variant="secondary" type="button" onClick={handleAdd}>
          Add Link
        </Button>
      </div>
      <div className="space-y-2">
        {links.map((link) => (
          <div key={link.id} className="flex items-center justify-between rounded-xl border border-bg-800/70 bg-bg-900/50 px-3 py-2">
            <div>
              <p className="text-sm text-slate-100">{link.label || link.link_type || 'Reference'}</p>
              <a href={link.url} target="_blank" rel="noreferrer" className="text-xs text-accent-300">
                {link.url}
              </a>
            </div>
            <button onClick={() => onDelete(link.id)} className="text-xs text-red-400 hover:text-red-300">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

