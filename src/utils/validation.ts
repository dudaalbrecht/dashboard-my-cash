/**
 * Utilitários para validação
 */

/**
 * Valida formato de email
 * @param email - String do email
 * @returns boolean
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida estrutura de CPF brasileiro (apenas formato, não consulta)
 * @param cpf - String do CPF (com ou sem formatação)
 * @returns boolean
 */
export function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '')
  
  if (cleaned.length !== 11) return false
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleaned)) return false
  
  // Validação dos dígitos verificadores
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i)
  }
  let remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned[9])) return false
  
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) remainder = 0
  if (remainder !== parseInt(cleaned[10])) return false
  
  return true
}

/**
 * Verifica se data é válida e não é futura
 * @param date - Objeto Date ou string
 * @param allowFuture - Permitir datas futuras (default: false)
 * @returns boolean
 */
export function isValidDate(date: Date | string, allowFuture: boolean = false): boolean {
  const d = new Date(date)
  
  // Verifica se é uma data válida
  if (isNaN(d.getTime())) return false
  
  // Verifica se não é futura (se não permitido)
  if (!allowFuture && d > new Date()) return false
  
  return true
}

/**
 * Verifica se valor é número positivo maior que zero
 * @param value - Valor a verificar
 * @returns boolean
 */
export function isPositiveNumber(value: unknown): boolean {
  if (typeof value !== 'number') return false
  return !isNaN(value) && value > 0
}

/**
 * Verifica se string tem comprimento mínimo
 * @param value - String a verificar
 * @param minLength - Comprimento mínimo
 * @returns boolean
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength
}

/**
 * Verifica se valor está dentro de um intervalo
 * @param value - Valor numérico
 * @param min - Valor mínimo
 * @param max - Valor máximo
 * @returns boolean
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}
