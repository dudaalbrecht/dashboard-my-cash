/**
 * Utilitários para formatação de datas
 */

/**
 * Formata data como DD/MM/AAAA
 * @param date - Objeto Date
 * @returns String formatada como "15/01/2024"
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

/**
 * Formata data em formato extenso
 * @param date - Objeto Date
 * @returns String formatada como "15 de Janeiro de 2024"
 */
export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

/**
 * Formata intervalo de datas
 * @param startDate - Data inicial
 * @param endDate - Data final
 * @returns String formatada como "01 jan - 31 jan, 2024"
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  const startStr = start.toLocaleDateString('pt-BR', options)
  const endStr = end.toLocaleDateString('pt-BR', options)
  const year = end.getFullYear()
  
  // Se cruzar anos, inclui ano em ambas
  if (start.getFullYear() !== end.getFullYear()) {
    return `${startStr}, ${start.getFullYear()} - ${endStr}, ${year}`
  }
  
  return `${startStr} - ${endStr}, ${year}`
}

/**
 * Retorna data relativa (Hoje, Ontem, Há X dias)
 * @param date - Objeto Date
 * @returns String relativa
 */
export function formatRelativeDate(date: Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffTime = now.getTime() - target.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  if (diffDays < 7) return `Há ${diffDays} dias`
  if (diffDays < 14) return 'Há 1 semana'
  if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 60) return 'Há 1 mês'
  return `Há ${Math.floor(diffDays / 30)} meses`
}

/**
 * Retorna o primeiro dia do mês
 * @param date - Objeto Date (opcional, default: hoje)
 * @returns Date do primeiro dia do mês
 */
export function getFirstDayOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * Retorna o último dia do mês
 * @param date - Objeto Date (opcional, default: hoje)
 * @returns Date do último dia do mês
 */
export function getLastDayOfMonth(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/**
 * Verifica se uma data está dentro de um intervalo
 * @param date - Data a verificar
 * @param startDate - Início do intervalo
 * @param endDate - Fim do intervalo
 * @returns boolean
 */
export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  const d = new Date(date).getTime()
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  return d >= start && d <= end
}
