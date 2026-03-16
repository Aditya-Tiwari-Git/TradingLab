import { ResponsiveContainer, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

export const EquityCurve = ({ data }: { data: { date: string; equity: number }[] }) => {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip
            contentStyle={{ background: '#0b1220', border: '1px solid #1f2a44', borderRadius: '8px' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Line type="monotone" dataKey="equity" stroke="#7c83ff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
