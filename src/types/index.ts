// ============================================
// mycash+ Type Definitions
// ============================================

/**
 * Tipo de transação: receita ou despesa
 */
export type TransactionType = 'income' | 'expense';

/**
 * Status de uma transação
 */
export type TransactionStatus = 'completed' | 'pending';

/**
 * Tema visual do cartão de crédito
 */
export type CardTheme = 'black' | 'lime' | 'white';

/**
 * Membro da família
 */
export interface FamilyMember {
  id: string;
  name: string;
  role: string; // Ex: "Pai", "Mãe", "Filho"
  avatarUrl: string;
  email?: string;
  monthlyIncome?: number;
  createdAt: Date;
}

/**
 * Conta bancária
 */
export interface BankAccount {
  id: string;
  name: string;
  holderId: string; // ID do membro titular
  balance: number;
  createdAt: Date;
}

/**
 * Cartão de crédito
 */
export interface CreditCard {
  id: string;
  name: string;
  holderId: string; // ID do membro titular
  limit: number;
  currentBill: number;
  closingDay: number; // Dia do fechamento (1-31)
  dueDay: number; // Dia do vencimento (1-31)
  theme: CardTheme;
  lastDigits?: string; // Últimos 4 dígitos
  createdAt: Date;
}

/**
 * Categoria de transação
 */
export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color?: string;
}

/**
 * Transação financeira
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  categoryId: string;
  accountId: string; // ID da conta ou cartão
  memberId: string | null; // ID do membro responsável (null = família)
  date: Date;
  dueDate?: Date; // Data de vencimento (para despesas)
  installments: number; // Número de parcelas (1 = à vista)
  currentInstallment?: number; // Parcela atual
  status: TransactionStatus;
  isRecurring: boolean;
  isPaid: boolean;
  createdAt: Date;
}

/**
 * Objetivo financeiro
 */
export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: Date;
  memberId: string | null; // ID do membro (null = família)
  iconName?: string;
  color?: string;
  createdAt: Date;
}

/**
 * Filtros globais da aplicação
 */
export interface GlobalFilters {
  selectedMemberId: string | null;
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
  transactionType: 'all' | TransactionType;
  searchText: string;
}

/**
 * Despesa agrupada por categoria
 */
export interface ExpenseByCategory {
  categoryId: string;
  categoryName: string;
  total: number;
  percentage: number;
  color?: string;
}

/**
 * Dados do gráfico de fluxo financeiro
 */
export interface FlowChartData {
  month: string;
  income: number;
  expense: number;
}

/**
 * Item de navegação
 */
export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
}
