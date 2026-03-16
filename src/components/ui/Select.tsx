import clsx from 'clsx'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
}

export const Select = ({ label, className, children, ...props }: SelectProps) => {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-300">
      {label ? <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span> : null}
      <select
        className={clsx(
          'rounded-xl border border-bg-700/80 bg-bg-900/70 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30 hover:border-bg-600',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
