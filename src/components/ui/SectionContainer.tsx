import { Card } from './Card'

interface SectionContainerProps {
  title: string
  description?: string
  children: React.ReactNode
}

export const SectionContainer = ({ title, description, children }: SectionContainerProps) => {
  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        {description ? <p className="text-xs text-slate-500">{description}</p> : null}
      </div>
      {children}
    </Card>
  )
}
