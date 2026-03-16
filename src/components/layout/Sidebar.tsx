import { motion } from 'framer-motion'
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  LayoutDashboard,
  NotebookPen,
  PieChart,
  Calculator,
  Radar,
  Settings,
  HelpCircle,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Mail,
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
  { to: '/calculator', label: 'Calculator', icon: Calculator },
  { to: '/guide', label: 'Guide', icon: HelpCircle },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Customization', icon: Settings },
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
      animate={{ width: collapsed ? 112 : 280 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="relative flex h-screen flex-col overflow-y-auto overflow-x-visible border-r border-bg-700/70 bg-bg-900/80 px-4 py-6 backdrop-blur"
    >
      {collapsed ? (
        <button
          onClick={onToggle}
          className="absolute right-2 top-24 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-accent-400/60 bg-bg-900 text-accent-200 shadow-[0_10px_30px_rgba(59,130,246,0.35)] transition hover:border-accent-300 hover:text-white"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={18} />
        </button>
      ) : null}
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
            'flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-bg-700/70 px-3 py-2 text-xs text-slate-400 transition hover:border-accent-400/60 hover:text-slate-200',
            !collapsed && 'hidden'
          )}
        >
          <ChevronRight size={16} />
          Expand
        </button>
        <a
          href="mailto:aditiw.work@gmail.com"
          className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-bg-700/70 px-3 py-2 text-xs text-slate-400 transition hover:border-accent-400/60 hover:text-slate-200"
        >
          <Mail size={16} />
          Contact Us
        </a>
        <button
          onClick={() => signOut()}
          className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-bg-700/70 px-3 py-2 text-xs text-slate-400 transition hover:border-accent-400/60 hover:text-slate-200"
        >
          Sign out
        </button>
      </div>
    </motion.aside>
  )
}
