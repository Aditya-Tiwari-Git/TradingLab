import { ResponsiveContainer, LineChart, Tooltip, XAxis, YAxis, CartesianGrid, Area } from 'recharts'
import { useSettings } from '../../hooks/useSettings'

export const EquityCurve = ({ data }: { data: { date: string; equity: number }[] }) => {
  const { settings } = useSettings()
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgb(var(--chart-primary))" stopOpacity={0.45} />
              <stop offset="95%" stopColor="rgb(var(--chart-primary))" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          {settings.showChartGrid ? (
            <CartesianGrid stroke="rgba(var(--chart-grid), 0.25)" strokeDasharray="3 3" vertical={false} />
          ) : null}
          <XAxis dataKey="date" hide />
          <YAxis hide />
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
          <Area
            type="monotone"
            dataKey="equity"
            stroke="rgb(var(--chart-primary))"
            strokeWidth={2}
            fill="url(#equityGradient)"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
