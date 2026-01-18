import { useFinance } from '../../contexts/FinanceContext'

interface DonutChartProps {
    percentage: number
    color: string
    size?: number
}

function DonutChart({ percentage, color, size = 64 }: DonutChartProps) {
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
                    strokeWidth="6"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-label-x-small font-semibold text-neutral-1100">
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

export default function CategoryGrid() {
    const { calculateExpensesByCategory } = useFinance()

    const categories = calculateExpensesByCategory()

    // Specific colors/categories map based on design node 6:5970
    // "Aluguel" (Yellow/Lime), "Alimentação"(Yellow), "Mercado"(Lime), "Academia" (Lime)
    // Actually design uses a gradient of greens/yellows.
    // We will dynamic colors or map them if names match.
    const colorMap: Record<string, string> = {
        'Aluguel': 'var(--color-primary-500)', // Lime/Yellow
        'Alimentação': '#EAB308', // Yellow-500
        'Mercado': '#84CC16', // Lime-500
        'Academia': '#22C55E', // Green-500
    }

    // Fallback colors
    const defaultColors = [
        'var(--color-primary-500)',
        '#EAB308',
        '#84CC16',
        '#22C55E',
        '#3B82F6',
        '#EF4444',
    ]

    if (categories.length === 0) {
        return (
            <div className="card col-span-4">
                <p className="text-paragraph-small text-neutral-500 text-center py-4">
                    Nenhuma despesa registrada.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 min-[1400px]:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((category, index) => (
                <div
                    key={category.categoryId}
                    className="
            card flex flex-col items-center justify-center gap-3 py-6
            hover:border-primary-500 transition-colors cursor-pointer
          "
                >
                    <DonutChart
                        percentage={Math.min(category.percentage, 100)}
                        color={colorMap[category.categoryName] || defaultColors[index % defaultColors.length]}
                    />
                    <div className="text-center">
                        <p className="text-paragraph-small text-neutral-500 mb-1 truncate max-w-[120px]">
                            {category.categoryName}
                        </p>
                        <p className="text-heading-x-small font-bold text-neutral-1100">
                            {formatCurrency(category.total)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )
}
