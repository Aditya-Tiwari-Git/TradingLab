import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { TradeLinks } from '../components/trade/TradeLinks'
import { TradeImages } from '../components/trade/TradeImages'
import {
  addTradeImage,
  addTradeLink,
  deleteTradeImage,
  deleteTradeLink,
  fetchTagsForTrade,
  fetchTradeById,
  fetchTradeImages,
  fetchTradeLinks,
} from '../services/trades'
import { getSignedUrl, uploadTradeImage } from '../services/storage'
import type { Trade, TradeImage, TradeLink } from '../types'
import { formatCurrency, safeNumber } from '../utils/metrics'

export const TradeDetail = () => {
  const { id } = useParams()
  const [trade, setTrade] = useState<Trade | null>(null)
  const [tags, setTags] = useState<string[]>([])
  const [links, setLinks] = useState<TradeLink[]>([])
  const [images, setImages] = useState<TradeImage[]>([])
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({})

  const load = async () => {
    if (!id) return
    const [tradeData, tagData, linkData, imageData] = await Promise.all([
      fetchTradeById(id),
      fetchTagsForTrade(id),
      fetchTradeLinks(id),
      fetchTradeImages(id),
    ])
    setTrade(tradeData)
    setTags(tagData.map((tag) => tag.name))
    setLinks(linkData)
    setImages(imageData)
    const urls = await Promise.all(
      imageData.map(async (image) => ({
        id: image.id,
        url: await getSignedUrl(image.storage_path),
      }))
    )
    const map: Record<string, string> = {}
    urls.forEach((item) => {
      map[item.id] = item.url
    })
    setImageUrls(map)
  }

  useEffect(() => {
    load()
  }, [id])

  if (!trade) {
    return (
      <AppShell>
        <TopBar title="Trade Detail" />
        <p className="text-sm text-slate-500">Loading trade...</p>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <TopBar title={`Trade ${trade.trade_code ?? trade.id}`} subtitle="Deep dive into this trade." />

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Trade Snapshot</h3>
              <p className="text-xs text-slate-500">Key details and trade context</p>
            </div>
            <Badge
              label={trade.result ?? 'Open'}
              tone={trade.result === 'Win' ? 'success' : trade.result === 'Loss' ? 'danger' : 'warning'}
            />
          </div>
          <div className="mt-4 grid gap-3 text-sm text-slate-300 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-500">Date</p>
              <p>{trade.date}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Asset</p>
              <p>{trade.asset}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Direction</p>
              <p>{trade.direction}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Timeframe</p>
              <p>{trade.timeframe ?? '--'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Entry</p>
              <p>{trade.entry_price ?? '--'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Exit</p>
              <p>{trade.exit_price ?? '--'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Stop</p>
              <p>{trade.stop_loss ?? '--'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Position Size</p>
              <p>{trade.position_size ?? '--'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Risk / Trade</p>
              <p>{trade.risk_per_trade ?? '--'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">R:R</p>
              <p>{trade.rr_ratio ?? '--'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Emotional State</p>
              <p>{trade.emotional_state || '--'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Rule Followed</p>
              <p>{trade.rule_followed === null || trade.rule_followed === undefined ? '--' : trade.rule_followed ? 'Yes' : 'No'}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-slate-500">Profit / Loss</p>
              <p className={safeNumber(trade.profit_loss) >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                {formatCurrency(safeNumber(trade.profit_loss))}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} label={tag} />
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Notes & Psychology</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <div>
              <p className="text-xs text-slate-500">Pre-trade reasoning</p>
              <p>{trade.pre_trade_reasoning || '--'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Post-trade reflection</p>
              <p>{trade.post_trade_reflection || '--'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">What went right</p>
              <p>{trade.what_went_right || '--'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">What went wrong</p>
              <p>{trade.what_went_wrong || '--'}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Lessons learned</p>
              <p>{trade.lessons_learned || '--'}</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold text-slate-200">News & Context Links</h3>
          <div className="mt-4">
            <TradeLinks
              links={links}
              onAdd={async (link) => {
                if (!id) return
                await addTradeLink({ ...link, trade_id: id })
                await load()
              }}
              onDelete={async (linkId) => {
                await deleteTradeLink(linkId)
                await load()
              }}
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-slate-200">Trade Screenshots</h3>
          <div className="mt-4">
            <TradeImages
              images={images}
              imageUrls={imageUrls}
              onUpload={async (file, caption) => {
                if (!id) return
                const path = await uploadTradeImage(file, id)
                await addTradeImage({ trade_id: id, storage_path: path, caption })
                await load()
              }}
              onDelete={async (imageId) => {
                await deleteTradeImage(imageId)
                await load()
              }}
            />
          </div>
        </Card>
      </section>
    </AppShell>
  )
}

