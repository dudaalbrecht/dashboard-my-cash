/**
 * Utilitários do mycash+
 */

export * from './currency'
export * from './date'
export * from './validation'

/**
 * Gera ID único
 * @returns String UUID
 */
export function generateUniqueId(): string {
  return crypto.randomUUID()
}

/**
 * Calcula percentual com tratamento de divisão por zero
 * @param partial - Valor parcial
 * @param total - Valor total
 * @returns Percentual com uma casa decimal
 */
export function calculatePercentage(partial: number, total: number): number {
  if (total === 0) return 0
  return Number(((partial / total) * 100).toFixed(1))
}

/**
 * Calcula diferença e variação percentual entre dois valores
 * @param current - Valor atual
 * @param previous - Valor anterior
 * @returns Objeto com diferença absoluta e percentual
 */
export function calculateDifference(current: number, previous: number): {
  absolute: number
  percentage: number
} {
  const absolute = current - previous
  const percentage = previous === 0 ? 0 : ((current - previous) / previous) * 100
  return {
    absolute,
    percentage: Number(percentage.toFixed(1)),
  }
}

/**
 * Calcula valor de cada parcela
 * @param total - Valor total
 * @param installments - Número de parcelas
 * @returns Valor de cada parcela (arredondado para 2 casas)
 */
export function calculateInstallmentValue(total: number, installments: number): number {
  if (installments <= 0) return total
  return Number((total / installments).toFixed(2))
}

/**
 * Agrupa array por chave
 * @param array - Array a agrupar
 * @param key - Chave para agrupamento
 * @returns Objeto agrupado
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const groupKey = String(item[key])
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

/**
 * Ordena array por data
 * @param array - Array com objetos que têm propriedade date
 * @param order - Ordem: 'asc' ou 'desc'
 * @returns Array ordenado
 */
export function sortByDate<T extends { date: Date }>(
  array: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] {
  return [...array].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return order === 'desc' ? dateB - dateA : dateA - dateB
  })
}

/**
 * Debounce function
 * @param fn - Função a ser executada
 * @param delay - Delay em ms
 * @returns Função com debounce
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

/**
 * Clamp value between min and max
 * @param value - Valor a limitar
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @returns Valor limitado
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
