import { motion } from 'framer-motion'
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  NotebookPen,
  PieChart,
  Radar,
  Settings,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import clsx from 'clsx'
import { SidebarItem } from './SidebarItem'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trades', label: 'Trades', icon: TrendingUp },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/strategies', label: 'Strategies', icon: Radar },
  { to: '/playbook', label: 'Playbook', icon: BookOpen },
  { to: '/watchlist', label: 'Watchlist', icon: Target },
  { to: '/notes', label: 'Notes', icon: NotebookPen },
  { to: '/analytics', label: 'Analytics', icon: PieChart },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { signOut } = useAuth()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 86 : 280 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="flex h-screen flex-col overflow-y-auto border-r border-bg-700/70 bg-bg-900/80 px-4 py-6 backdrop-blur"
    >
      <div className="mb-8 flex items-center justify-between">
        <div className={clsx('flex items-center gap-3', collapsed && 'justify-center w-full')}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/20 text-accent-300">
            <TrendingUp size={18} />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-display text-lg text-slate-100">TradeLab</h1>
              <p className="text-xs text-slate-500">Pro journal</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={clsx(
            'flex h-8 w-8 items-center justify-center rounded-full border border-bg-700/70 bg-bg-900/60 text-slate-400 hover:text-slate-200',
            collapsed && 'hidden'
          )}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <SidebarItem key={item.to} to={item.to} label={item.label} icon={item.icon} collapsed={collapsed} />
        ))}
      </nav>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={onToggle}
          className={clsx(
            'flex items-center justify-center gap-2 rounded-xl border border-bg-700/70 px-3 py-2 text-xs text-slate-400 transition hover:border-accent-400/60 hover:text-slate-200',
            !collapsed && 'hidden'
          )}
        >
          <ChevronRight size={16} />
          Expand
        </button>
        <button
          onClick={() => signOut()}
          className="flex items-center justify-center gap-2 rounded-xl border border-bg-700/70 px-3 py-2 text-xs text-slate-400 transition hover:border-accent-400/60 hover:text-slate-200"
        >
          Sign out
        </button>
      </div>
    </motion.aside>
  )
}
