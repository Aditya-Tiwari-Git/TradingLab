import clsx from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
}

export const Input = ({ label, hint, className, ...props }: InputProps) => {
  const tooltip = hint ?? label ?? props.placeholder
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-300" title={tooltip}>
      {label ? (
        <span className="text-xs uppercase tracking-wide text-slate-500" title={tooltip}>
          {label}
          {props.required ? <span className="ml-1 text-red-400">*</span> : null}
        </span>
      ) : null}
      <input
        className={clsx(
          'rounded-xl border border-bg-700/80 bg-bg-900/70 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30 hover:border-bg-600',
          className
        )}
        title={tooltip}
        {...props}
      />
    </label>
  )
}
