import { useEffect, useState } from 'react'

interface BalanceCardProps {
  value: number
  previousValue?: number
}

function useAnimatedValue(targetValue: number, duration: number = 800) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const startTime = Date.now()
    const startValue = displayValue

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing: ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = startValue + (targetValue - startValue) * easeOut
      
      setDisplayValue(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [targetValue, duration])

  return displayValue
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function BalanceCard({ value, previousValue = 0 }: BalanceCardProps) {
  const animatedValue = useAnimatedValue(value)
  
  // Calcular variação percentual
  const percentChange = previousValue > 0 
    ? ((value - previousValue) / previousValue) * 100 
    : 0
  const isPositive = percentChange >= 0

  return (
    <div className="
      card relative overflow-hidden
      bg-neutral-1100 text-neutral-0
      col-span-1 lg:col-span-1
    ">
      {/* Decorative blur circle */}
      <div className="
        absolute -top-16 -right-16
        w-48 h-48
        bg-primary-500 rounded-full
        blur-3xl opacity-30
        pointer-events-none
      " />
      
      {/* Content */}
      <div className="relative z-10">
        <p className="text-paragraph-small text-neutral-400 mb-2">
          Saldo Total
        </p>
        <p className="text-heading-medium font-bold">
          {formatCurrency(animatedValue)}
        </p>
        
        {/* Growth indicator */}
        {previousValue > 0 && (
          <div className={`
            inline-flex items-center gap-1 mt-3
            px-3 py-1.5 rounded-shape-100
            ${isPositive 
              ? 'bg-green-600/20 text-green-600' 
              : 'bg-red-600/20 text-red-600'
            }
          `}>
            <svg 
              className={`w-4 h-4 ${!isPositive ? 'rotate-180' : ''}`} 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M7 14L12 9L17 14H7Z"/>
            </svg>
            <span className="text-label-x-small font-semibold">
              {isPositive ? '+' : ''}{percentChange.toFixed(1)}% esse mês
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
