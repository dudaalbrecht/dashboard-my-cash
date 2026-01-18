import { useEffect, useState } from 'react'

interface ExpenseCardProps {
  value: number
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

export default function ExpenseCard({ value }: ExpenseCardProps) {
  const animatedValue = useAnimatedValue(value)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <p className="text-label-medium text-neutral-500">
          Despesas
        </p>
        <div className="
          w-10 h-10 rounded-full
          bg-red-600/10
          flex items-center justify-center
        ">
          <svg 
            className="w-5 h-5 text-red-600" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M4 12L5.41 13.41L11 7.83V20H13V7.83L18.59 13.41L20 12L12 4L4 12Z"/>
          </svg>
        </div>
      </div>
      <p className="text-heading-small font-bold text-neutral-1100">
        {formatCurrency(animatedValue)}
      </p>
    </div>
  )
}
