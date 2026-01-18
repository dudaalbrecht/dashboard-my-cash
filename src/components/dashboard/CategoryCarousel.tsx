import { useRef } from 'react'
import { useFinance } from '../../contexts/FinanceContext'

interface DonutChartProps {
  percentage: number
  color: string
  size?: number
}

function DonutChart({ percentage, color, size = 72 }: DonutChartProps) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-neutral-300)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-paragraph-x-small font-semibold text-neutral-1100">
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  )
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function CategoryCarousel() {
  const { calculateExpensesByCategory } = useFinance()
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const categories = calculateExpensesByCategory()
  
  // Cores rotativas para as categorias
  const colors = [
    'var(--color-primary-500)',
    'var(--color-neutral-1100)',
    'var(--color-neutral-500)',
    'var(--color-blue-600)',
    'var(--color-green-600)',
    'var(--color-red-600)',
  ]

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (categories.length === 0) {
    return (
      <div className="card">
        <p className="text-paragraph-small text-neutral-500 text-center py-8">
          Nenhuma despesa registrada no período.
        </p>
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll('left')}
        className="
          absolute left-0 top-1/2 -translate-y-1/2 z-10
          w-10 h-10 rounded-full
          bg-surface-500 shadow-elevated
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          hover:bg-neutral-300
          -ml-5
        "
      >
        <svg className="w-5 h-5 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"/>
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll('right')}
        className="
          absolute right-0 top-1/2 -translate-y-1/2 z-10
          w-10 h-10 rounded-full
          bg-surface-500 shadow-elevated
          flex items-center justify-center
          opacity-0 group-hover:opacity-100
          transition-opacity duration-200
          hover:bg-neutral-300
          -mr-5
        "
      >
        <svg className="w-5 h-5 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z"/>
        </svg>
      </button>

      {/* Gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background-400 to-transparent z-[5] pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background-400 to-transparent z-[5] pointer-events-none" />

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="
          flex gap-4 overflow-x-auto
          scrollbar-hide scroll-smooth
          px-2 py-2
        "
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => (
          <div
            key={category.categoryId}
            className="
              flex-shrink-0 w-[160px]
              card hover:border-primary-500
              transition-all duration-200
              cursor-pointer
              animate-fade-in
            "
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col items-center gap-3">
              <DonutChart 
                percentage={Math.min(category.percentage, 100)} 
                color={category.color || colors[index % colors.length]}
              />
              <p className="text-paragraph-small text-neutral-1100 text-center truncate w-full">
                {category.categoryName}
              </p>
              <p className="text-heading-x-small font-bold text-neutral-1100 text-center">
                {formatCurrency(category.total)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
