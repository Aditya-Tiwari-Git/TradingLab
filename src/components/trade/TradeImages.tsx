import { useState } from 'react'
import type { TradeImage } from '../../types'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

interface TradeImagesProps {
  images: TradeImage[]
  onUpload: (file: File, caption?: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  imageUrls: Record<string, string>
}

export const TradeImages = ({ images, onUpload, onDelete, imageUrls }: TradeImagesProps) => {
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')

  const handleUpload = async () => {
    if (!file) return
    await onUpload(file, caption)
    setFile(null)
    setCaption('')
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <Input label="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} />
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          <span className="text-xs uppercase tracking-wide text-slate-500">Upload image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="rounded-lg border border-bg-700 bg-bg-900/60 px-3 py-2 text-sm text-slate-200"
          />
        </label>
        <div className="flex items-end">
          <Button variant="secondary" type="button" onClick={handleUpload}>
            Upload
          </Button>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {images.map((image) => (
          <div key={image.id} className="rounded-2xl border border-bg-800/70 bg-bg-900/50 p-3">
            <img src={imageUrls[image.id] || ''} alt={image.caption ?? 'Trade'} className="mb-2 h-40 w-full rounded-lg object-cover" />
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{image.caption}</span>
              <button onClick={() => onDelete(image.id)} className="text-xs text-red-400 hover:text-red-300">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

