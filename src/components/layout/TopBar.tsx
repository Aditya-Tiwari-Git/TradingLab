import { Bell, Search, Plus, ChevronDown, Sun, Moon, Mail } from 'lucide-react'
import clsx from 'clsx'
import { useTheme } from '../../hooks/useTheme'

interface TopBarProps {
  title: string
  subtitle?: string
  onQuickAdd?: () => void
}

export const TopBar = ({ title, subtitle, onQuickAdd }: TopBarProps) => {
  const { theme, toggleTheme } = useTheme()
  return (
    <header className="sticky top-0 z-20 -mx-4 bg-bg-900/80 px-4 pb-4 pt-2 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-bg-700/60 pb-4">
        <div>
          <h2 className="font-display text-2xl text-slate-100">{title}</h2>
          {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-bg-700/70 bg-bg-900/60 px-4 py-2 text-xs text-slate-400 shadow-card">
            <Search size={14} />
            Search trades, tags, assets
          </div>
          <button
            onClick={onQuickAdd}
            className={clsx(
              'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition',
              onQuickAdd
                ? 'bg-accent-500 text-white shadow-glow hover:bg-accent-400'
                : 'cursor-not-allowed border border-bg-700/70 text-slate-500'
            )}
          >
            <Plus size={14} />
            Quick Add
            {onQuickAdd ? (
              <span className="rounded-full border border-white/20 px-2 py-0.5 text-[10px] text-white/80">Ctrl+K</span>
            ) : null}
          </button>
          <button className="rounded-full border border-bg-700/70 bg-bg-900/60 p-2 text-slate-400 shadow-card hover:text-slate-200">
            <Bell size={16} />
          </button>
          <a
            href="mailto:aditiw.work@gmail.com"
            className="rounded-full border border-bg-700/70 bg-bg-900/60 p-2 text-slate-400 shadow-card hover:text-slate-200"
            aria-label="Contact support"
          >
            <Mail size={16} />
          </a>
          <button
            onClick={toggleTheme}
            className="rounded-full border border-bg-700/70 bg-bg-900/60 p-2 text-slate-400 shadow-card hover:text-slate-200"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <button className="flex items-center gap-2 rounded-full border border-bg-700/70 bg-bg-900/60 px-3 py-2 text-xs text-slate-300">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-500/20 text-accent-300">TJ</span>
            Trader
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </header>
  )
}
