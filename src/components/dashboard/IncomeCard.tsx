import { useEffect, useState } from 'react'

interface IncomeCardProps {
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

export default function IncomeCard({ value }: IncomeCardProps) {
  const animatedValue = useAnimatedValue(value)

  return (
    <div className="card">
      <div className="flex flex-col gap-2">
        <div className="
          w-10 h-10 rounded-full
          bg-green-600/10
          flex items-center justify-center
        ">
          <svg
            className="w-5 h-5 text-green-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M20 12L18.59 10.59L13 16.17V4H11V16.17L5.41 10.59L4 12L12 20L20 12Z" />
          </svg>
        </div>

        <div>
          <p className="text-paragraph-small text-neutral-500">
            Receitas
          </p>
          <p className="text-heading-small font-bold text-neutral-1100">
            {formatCurrency(animatedValue)}
          </p>
        </div>
      </div>
    </div>
  )
}
