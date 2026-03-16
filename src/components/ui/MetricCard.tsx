import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface MetricCardProps {
  label: string
  value: string
  icon: LucideIcon
  tone?: 'neutral' | 'success' | 'danger' | 'info'
  helper?: string
}

const toneStyles: Record<NonNullable<MetricCardProps['tone']>, string> = {
  neutral: 'from-bg-800/80 to-bg-900/60',
  success: 'from-emerald-500/20 to-bg-900/60',
  danger: 'from-red-500/20 to-bg-900/60',
  info: 'from-accent-500/25 to-bg-900/60',
}

export const MetricCard = ({ label, value, icon: Icon, tone = 'neutral', helper }: MetricCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={clsx(
        'rounded-2xl border border-bg-700/70 bg-gradient-to-br p-4 shadow-card',
        toneStyles[tone]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-bg-700/70 bg-bg-900/60 text-slate-200">
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4 text-2xl font-semibold text-slate-100">{value}</div>
      {helper ? <div className="mt-1 text-xs text-slate-500">{helper}</div> : null}
      <div className="mt-4 h-[2px] w-full overflow-hidden rounded-full bg-bg-800/70">
        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-accent-400 to-info" />
      </div>
    </motion.div>
  )
}
