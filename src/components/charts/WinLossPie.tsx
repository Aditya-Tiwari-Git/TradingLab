import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#10b981', '#ef4444', '#f59e0b']

export const WinLossPie = ({ data }: { data: { name: string; value: number }[] }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{ background: '#0b1220', border: '1px solid #1f2a44', borderRadius: '8px' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
