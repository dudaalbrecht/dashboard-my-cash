/**
 * Utilitários para formatação de valores monetários
 */

/**
 * Formata um número como moeda brasileira
 * @param value - Valor numérico
 * @returns String formatada como "R$ 1.234,56"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Formata valor de forma compacta para gráficos
 * @param value - Valor numérico
 * @returns String compacta como "R$ 2,5k" ou "R$ 1,2M"
 */
export function formatCompactCurrency(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`
  }
  return `R$ ${value.toFixed(0)}`
}

/**
 * Converte string de input do usuário em número
 * Remove "R$", pontos de milhar, troca vírgula por ponto
 * @param input - String do input (ex: "R$ 1.234,56")
 * @returns Número limpo (ex: 1234.56)
 */
export function parseCurrencyInput(input: string): number {
  const cleaned = input
    .replace(/R\$\s?/g, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .trim()
  
  const value = parseFloat(cleaned)
  return isNaN(value) ? 0 : value
}

/**
 * Formata input de moeda em tempo real
 * @param value - Valor em centavos (inteiro)
 * @returns String formatada sem o símbolo R$
 */
export function formatCurrencyInput(value: number): string {
  if (!value || value === 0) return ''
  return (value / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}
