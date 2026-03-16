import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import clsx from 'clsx'

interface SidebarItemProps {
  to: string
  label: string
  icon: LucideIcon
  collapsed: boolean
}

export const SidebarItem = ({ to, label, icon: Icon, collapsed }: SidebarItemProps) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        clsx(
          'sidebar-item group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-gradient-to-r from-accent-500/20 via-accent-500/10 to-transparent text-accent-200 shadow-[0_8px_24px_rgba(59,130,246,0.2)]'
            : 'text-slate-300 hover:bg-bg-800/70'
        )
      }
    >
      <Icon size={18} className="sidebar-icon text-slate-300 group-hover:text-slate-100" />
      {!collapsed && <span>{label}</span>}
    </NavLink>
  )
}
