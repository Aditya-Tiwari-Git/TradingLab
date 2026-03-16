import clsx from 'clsx'

interface TabsProps {
  tabs: { id: string; label: string }[]
  activeId: string
  onChange: (id: string) => void
}

export const Tabs = ({ tabs, activeId, onChange }: TabsProps) => {
  return (
    <div className="flex flex-wrap gap-2 rounded-full border border-bg-700/70 bg-bg-900/60 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'rounded-full px-4 py-2 text-xs font-semibold transition',
            activeId === tab.id ? 'bg-accent-500/20 text-accent-200' : 'text-slate-400 hover:text-slate-200'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
