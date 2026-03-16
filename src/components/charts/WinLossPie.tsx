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
