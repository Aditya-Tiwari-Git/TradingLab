import clsx from 'clsx'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
}

export const Textarea = ({ label, hint, className, ...props }: TextareaProps) => {
  const tooltip = hint ?? label ?? props.placeholder
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-300" title={tooltip}>
      {label ? (
        <span className="text-xs uppercase tracking-wide text-slate-500" title={tooltip}>
          {label}
          {props.required ? <span className="ml-1 text-red-400">*</span> : null}
        </span>
      ) : null}
      <textarea
        className={clsx(
          'min-h-[96px] rounded-xl border border-bg-700/80 bg-bg-900/70 px-3 py-2 text-sm text-slate-200 outline-none transition focus:border-accent-400 focus:ring-2 focus:ring-accent-400/30 hover:border-bg-600',
          className
        )}
        title={tooltip}
        {...props}
      />
    </label>
  )
}
