import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useSettings } from '../../hooks/useSettings'

const COLORS = ['rgb(var(--chart-tertiary))', 'rgb(var(--chart-danger))', 'rgb(var(--warning))']

export const WinLossPie = ({ data }: { data: { name: string; value: number }[] }) => {
  const { settings } = useSettings()
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
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
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={92} paddingAngle={4}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
