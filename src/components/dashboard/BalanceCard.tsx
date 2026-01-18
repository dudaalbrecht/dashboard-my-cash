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

export default function BalanceCard({ value }: BalanceCardProps) {
  const animatedValue = useAnimatedValue(value)

  // Calcular variação percentual



  return (
    <div className="
      card relative overflow-hidden
      bg-surface-500 text-neutral-1100
      col-span-1 border border-neutral-300
    ">
      <div className="flex flex-col gap-2">
        <div className="w-10 h-10 rounded-full bg-neutral-300/30 flex items-center justify-center">
          <span className="text-xl font-semibold">$</span>
        </div>

        <div>
          <p className="text-paragraph-small text-neutral-500">
            Saldo total
          </p>
          <p className="text-heading-medium font-bold text-blue-600">
            {formatCurrency(animatedValue)}
          </p>
        </div>
      </div>
    </div>
  )
}
