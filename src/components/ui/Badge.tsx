import clsx from 'clsx'

export const Badge = ({ label, tone = 'default' }: { label: string; tone?: 'default' | 'success' | 'danger' | 'warning' }) => {
  return (
    <span
      className={clsx(
        'rounded-full border border-transparent px-3 py-1 text-xs font-semibold',
        tone === 'success' && 'bg-emerald-500/20 text-emerald-300',
        tone === 'danger' && 'bg-red-500/20 text-red-300',
        tone === 'warning' && 'bg-amber-500/20 text-amber-300',
        tone === 'default' && 'bg-bg-800/80 text-slate-300'
      )}
    >
      {label}
    </span>
  )
}
