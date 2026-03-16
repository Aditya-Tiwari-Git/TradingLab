import type { Trade } from '../../types'
import { Badge } from '../ui/Badge'
import { formatCurrency, safeNumber } from '../../utils/metrics'

export const TradeCard = ({ trade }: { trade: Trade }) => {
  return (
    <div className="rounded-2xl border border-bg-700/70 bg-bg-900/50 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-100">{trade.asset}</p>
          <p className="text-xs text-slate-500">{trade.direction} · {trade.timeframe ?? '—'}</p>
        </div>
        <Badge
          label={trade.result ?? 'Open'}
          tone={trade.result === 'Win' ? 'success' : trade.result === 'Loss' ? 'danger' : 'warning'}
        />
      </div>
      <div className="mt-3 text-xs text-slate-500">PnL</div>
      <div className={safeNumber(trade.profit_loss) >= 0 ? 'text-emerald-300' : 'text-red-300'}>
        {formatCurrency(safeNumber(trade.profit_loss))}
      </div>
    </div>
  )
}
