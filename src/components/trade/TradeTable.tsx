import { Link } from 'react-router-dom'
import type { Trade } from '../../types'
import { Badge } from '../ui/Badge'
import { formatCurrency, formatNumber, getTradeResult, safeNumber } from '../../utils/metrics'
import clsx from 'clsx'

interface TradeTableProps {
  trades: Trade[]
  onEdit: (trade: Trade) => void
  onDelete: (trade: Trade) => void
  onSelect?: (trade: Trade) => void
  selectedId?: string | null
}

export const TradeTable = ({ trades, onEdit, onDelete, onSelect, selectedId }: TradeTableProps) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-bg-700/70 bg-bg-900/40">
      <table className="w-full text-sm">
        <thead className="bg-bg-900/80 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Asset</th>
            <th className="px-4 py-3 text-left">Direction</th>
            <th className="px-4 py-3 text-left">R:R</th>
            <th className="px-4 py-3 text-left">P/L</th>
            <th className="px-4 py-3 text-left">Result</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-bg-800/60">
          {trades.map((trade) => {
            const result = getTradeResult(trade)
            return (
              <tr
                key={trade.id}
                onClick={() => onSelect?.(trade)}
                className={clsx(
                  'cursor-pointer transition hover:bg-bg-900/60',
                  selectedId === trade.id && 'bg-bg-900/70'
                )}
              >
                <td className="px-4 py-3">
                  <Link to={`/trades/${trade.id}`} className="text-accent-300 hover:underline">
                    {trade.date}
                  </Link>
                </td>
                <td className="px-4 py-3">{trade.asset}</td>
                <td className="px-4 py-3">{trade.direction}</td>
                <td className="px-4 py-3">{formatNumber(safeNumber(trade.rr_ratio))}</td>
                <td className="px-4 py-3">
                  <span className={safeNumber(trade.profit_loss) >= 0 ? 'text-emerald-300' : 'text-red-300'}>
                    {formatCurrency(safeNumber(trade.profit_loss))}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge
                    label={result}
                    tone={result === 'Win' ? 'success' : result === 'Loss' ? 'danger' : 'warning'}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      onEdit(trade)
                    }}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(event) => {
                      event.stopPropagation()
                      onDelete(trade)
                    }}
                    className="ml-3 text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
