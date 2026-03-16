import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const StrategyBar = ({ data }: { data: { name: string; value: number }[] }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis dataKey="name" type="category" tick={{ fill: '#94a3b8', fontSize: 12 }} width={120} />
          <Tooltip
            contentStyle={{ background: '#0b1220', border: '1px solid #1f2a44', borderRadius: '8px' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Bar dataKey="value" fill="#7c83ff" radius={[0, 6, 6, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
