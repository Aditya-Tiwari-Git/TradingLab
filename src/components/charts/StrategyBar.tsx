import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useSettings } from '../../hooks/useSettings'

export const StrategyBar = ({ data }: { data: { name: string; value: number }[] }) => {
  const { settings } = useSettings()
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 30, right: 16, top: 10 }}>
          {settings.showChartGrid ? (
            <CartesianGrid stroke="rgba(var(--chart-grid), 0.25)" strokeDasharray="3 3" horizontal={false} />
          ) : null}
          <XAxis type="number" tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }} />
          <YAxis dataKey="name" type="category" tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }} width={120} />
          {settings.showTooltips ? (
            <Tooltip
              contentStyle={{
                background: 'rgba(var(--bg-900), 0.96)',
                border: '1px solid rgba(var(--bg-700), 0.7)',
                borderRadius: '10px',
                color: '#e2e8f0',
              }}
              labelStyle={{ color: 'rgb(var(--muted))', fontSize: 12 }}
              itemStyle={{ color: '#e2e8f0' }}
            />
          ) : null}
          <Bar dataKey="value" fill="rgb(var(--chart-primary))" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
