import clsx from 'clsx'

interface DataTableProps {
  headers: string[]
  children: React.ReactNode
  className?: string
}

export const DataTable = ({ headers, children, className }: DataTableProps) => {
  return (
    <div className={clsx('overflow-x-auto rounded-2xl border border-bg-700/70 bg-bg-900/40', className)}>
      <table className="w-full text-sm">
        <thead className="bg-bg-900/80 text-xs uppercase text-slate-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 text-left">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-bg-800/60">{children}</tbody>
      </table>
    </div>
  )
}
