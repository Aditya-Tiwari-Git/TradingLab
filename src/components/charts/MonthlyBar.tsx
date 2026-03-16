import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useSettings } from '../../hooks/useSettings'

export const MonthlyBar = ({ data }: { data: { month: string; value: number }[] }) => {
  const { settings } = useSettings()
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          {settings.showChartGrid ? (
            <CartesianGrid stroke="rgba(var(--chart-grid), 0.25)" strokeDasharray="3 3" vertical={false} />
          ) : null}
          <XAxis dataKey="month" tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }} />
          <YAxis tick={{ fill: 'rgb(var(--muted))', fontSize: 12 }} />
          {settings.showTooltips ? (
            <Tooltip
              contentStyle={{
                background: 'transparent',
                border: 'none',
                boxShadow: 'none',
                color: '#e2e8f0',
              }}
              labelStyle={{ color: 'rgb(var(--muted))', fontSize: 12 }}
              itemStyle={{ color: '#e2e8f0' }}
              cursor={{ fill: 'transparent' }}
            />
          ) : null}
          <Bar dataKey="value" fill="rgb(var(--chart-secondary))" radius={[6, 6, 2, 2]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
