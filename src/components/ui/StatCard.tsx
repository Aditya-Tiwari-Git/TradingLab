import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string
  helper?: string
}

export const StatCard = ({ label, value, helper }: StatCardProps) => {
  return (
    <Card className="flex flex-col gap-3 border border-bg-800/80">
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-2xl font-semibold text-slate-100">{value}</span>
      {helper ? <span className="text-xs text-slate-500">{helper}</span> : null}
    </Card>
  )
}
