import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  TooltipProps
} from 'recharts'
import { useFinance } from '../../contexts/FinanceContext'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`
  }
  return `R$ ${value}`
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
    color: string
  }>
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="
      bg-surface-500 border border-neutral-300
      rounded-shape-20 shadow-elevated
      p-4
    ">
      <p className="text-label-medium text-neutral-1100 mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p 
          key={index}
          className="text-paragraph-small"
          style={{ color: entry.dataKey === 'income' ? 'var(--color-green-600)' : 'var(--color-neutral-1100)' }}
        >
          {entry.dataKey === 'income' ? 'Receitas' : 'Despesas'}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  )
}

export default function FlowChart() {
  const { getFlowChartData } = useFinance()
  const data = getFlowChartData()

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.5 18.49L9.5 12.48L13.5 16.48L22 6.92L20.59 5.51L13.5 13.48L9.5 9.48L2 16.99L3.5 18.49Z"/>
          </svg>
          <h3 className="text-heading-x-small font-bold text-neutral-1100">
            Fluxo Financeiro
          </h3>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-500" />
            <span className="text-paragraph-x-small text-neutral-500">Receitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-600" />
            <span className="text-paragraph-x-small text-neutral-500">Despesas</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D7FF00" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#D7FF00" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E61E32" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#E61E32" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="var(--color-neutral-300)" 
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-neutral-500)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-neutral-500)', fontSize: 12 }}
              tickFormatter={formatCompactCurrency}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="#D7FF00"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorIncome)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="#E61E32"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
