import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import {
  Transaction,
  Goal,
  CreditCard,
  BankAccount,
  FamilyMember,
  Category,
  GlobalFilters,
  TransactionType,
  ExpenseByCategory,
  FlowChartData,
} from '../types'

// ============================================
// Mock Data
// ============================================

const defaultCategories: Category[] = [
  // Categorias de Despesa
  { id: 'cat-1', name: 'Moradia', type: 'expense', color: '#D7FF00' },
  { id: 'cat-2', name: 'Alimentação', type: 'expense', color: '#080B12' },
  { id: 'cat-3', name: 'Transporte', type: 'expense', color: '#9CA3AF' },
  { id: 'cat-4', name: 'Saúde', type: 'expense', color: '#2A89EF' },
  { id: 'cat-5', name: 'Educação', type: 'expense', color: '#15BE78' },
  { id: 'cat-6', name: 'Lazer', type: 'expense', color: '#E61E32' },
  { id: 'cat-7', name: 'Manutenção', type: 'expense', color: '#C4E703' },
  { id: 'cat-8', name: 'Vestuário', type: 'expense', color: '#E7E8EA' },
  // Categorias de Receita
  { id: 'cat-9', name: 'Salário', type: 'income', color: '#15BE78' },
  { id: 'cat-10', name: 'Freelance', type: 'income', color: '#2A89EF' },
  { id: 'cat-11', name: 'Investimentos', type: 'income', color: '#D7FF00' },
  { id: 'cat-12', name: 'Outros', type: 'income', color: '#9CA3AF' },
]

const defaultMembers: FamilyMember[] = [
  {
    id: 'member-1',
    name: 'Eduardo G Albrecht',
    role: 'Pai',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eduardo',
    email: 'eduardogalbrecht@gmail.com',
    monthlyIncome: 12000,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'member-2',
    name: 'Maria Albrecht',
    role: 'Mãe',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    email: 'maria@gmail.com',
    monthlyIncome: 8000,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'member-3',
    name: 'Lucas Albrecht',
    role: 'Filho',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas',
    email: 'lucas@gmail.com',
    monthlyIncome: 0,
    createdAt: new Date('2024-01-01'),
  },
]

const defaultAccounts: BankAccount[] = [
  {
    id: 'account-1',
    name: 'Nubank Conta',
    holderId: 'member-1',
    balance: 5000,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'account-2',
    name: 'Inter Conta',
    holderId: 'member-2',
    balance: 3500,
    createdAt: new Date('2024-01-01'),
  },
]

const defaultCards: CreditCard[] = [
  {
    id: 'card-1',
    name: 'Nubank',
    holderId: 'member-1',
    limit: 15000,
    currentBill: 120,
    closingDay: 10,
    dueDay: 17,
    theme: 'black',
    lastDigits: '5897',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'card-2',
    name: 'Inter',
    holderId: 'member-1',
    limit: 10000,
    currentBill: 2300,
    closingDay: 21,
    dueDay: 28,
    theme: 'lime',
    lastDigits: '1234',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'card-3',
    name: 'Picpay',
    holderId: 'member-2',
    limit: 8000,
    currentBill: 17000,
    closingDay: 12,
    dueDay: 19,
    theme: 'white',
    lastDigits: '9876',
    createdAt: new Date('2024-01-01'),
  },
]

// Gerar transações mock
const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = []
  const now = new Date()
  
  // Transações dos últimos 3 meses
  for (let i = 0; i < 30; i++) {
    const daysAgo = Math.floor(Math.random() * 90)
    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    
    const isExpense = Math.random() > 0.3
    const type: TransactionType = isExpense ? 'expense' : 'income'
    
    const expenseCategories = defaultCategories.filter(c => c.type === 'expense')
    const incomeCategories = defaultCategories.filter(c => c.type === 'income')
    const category = isExpense 
      ? expenseCategories[Math.floor(Math.random() * expenseCategories.length)]
      : incomeCategories[Math.floor(Math.random() * incomeCategories.length)]
    
    const descriptions = isExpense
      ? ['Supermercado', 'Conta de Luz', 'Conta de Água', 'Internet', 'Gasolina', 'Restaurante', 'Farmácia', 'Academia', 'Streaming', 'Passeio no parque']
      : ['Salário', 'Freelance', 'Dividendos', 'Venda', 'Reembolso']
    
    const amount = isExpense
      ? Math.floor(Math.random() * 500) + 50
      : Math.floor(Math.random() * 5000) + 1000
    
    const accountOrCard = isExpense && Math.random() > 0.5
      ? defaultCards[Math.floor(Math.random() * defaultCards.length)].id
      : defaultAccounts[Math.floor(Math.random() * defaultAccounts.length)].id
    
    const member = Math.random() > 0.3
      ? defaultMembers[Math.floor(Math.random() * defaultMembers.length)].id
      : null
    
    transactions.push({
      id: uuidv4(),
      type,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      amount,
      categoryId: category.id,
      accountId: accountOrCard,
      memberId: member,
      date,
      dueDate: isExpense ? new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000) : undefined,
      installments: 1,
      status: 'completed',
      isRecurring: Math.random() > 0.8,
      isPaid: Math.random() > 0.2,
      createdAt: date,
    })
  }
  
  // Adicionar algumas despesas pendentes para "Próximas Despesas"
  for (let i = 0; i < 5; i++) {
    const dueDate = new Date(now)
    dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 14) + 1)
    
    transactions.push({
      id: uuidv4(),
      type: 'expense',
      description: ['Conta de Luz', 'Conta de Água', 'Internet', 'Aluguel', 'Condomínio'][i],
      amount: Math.floor(Math.random() * 300) + 100,
      categoryId: 'cat-7',
      accountId: defaultCards[Math.floor(Math.random() * defaultCards.length)].id,
      memberId: null,
      date: now,
      dueDate,
      installments: 1,
      status: 'pending',
      isRecurring: true,
      isPaid: false,
      createdAt: now,
    })
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
}

const defaultGoals: Goal[] = [
  {
    id: 'goal-1',
    name: 'Viagem para Europa',
    description: 'Férias em família',
    targetAmount: 30000,
    currentAmount: 12000,
    deadline: new Date('2025-06-01'),
    memberId: null,
    iconName: 'plane',
    color: '#2A89EF',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'goal-2',
    name: 'Carro Novo',
    description: 'Trocar o carro da família',
    targetAmount: 80000,
    currentAmount: 25000,
    deadline: new Date('2025-12-01'),
    memberId: null,
    iconName: 'car',
    color: '#15BE78',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'goal-3',
    name: 'Reserva de Emergência',
    description: '6 meses de despesas',
    targetAmount: 50000,
    currentAmount: 35000,
    deadline: undefined,
    memberId: null,
    iconName: 'shield',
    color: '#D7FF00',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'goal-4',
    name: 'Faculdade Lucas',
    description: 'Fundo para educação',
    targetAmount: 100000,
    currentAmount: 15000,
    deadline: new Date('2030-01-01'),
    memberId: 'member-3',
    iconName: 'graduation',
    color: '#E61E32',
    createdAt: new Date('2024-01-01'),
  },
]

// ============================================
// Context Types
// ============================================

interface FinanceContextType {
  // State
  transactions: Transaction[]
  goals: Goal[]
  creditCards: CreditCard[]
  bankAccounts: BankAccount[]
  familyMembers: FamilyMember[]
  categories: Category[]
  filters: GlobalFilters
  
  // CRUD - Transactions
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void
  updateTransaction: (id: string, data: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  markTransactionAsPaid: (id: string) => void
  
  // CRUD - Goals
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void
  updateGoal: (id: string, data: Partial<Goal>) => void
  deleteGoal: (id: string) => void
  
  // CRUD - Credit Cards
  addCreditCard: (card: Omit<CreditCard, 'id' | 'createdAt'>) => void
  updateCreditCard: (id: string, data: Partial<CreditCard>) => void
  deleteCreditCard: (id: string) => void
  
  // CRUD - Bank Accounts
  addBankAccount: (account: Omit<BankAccount, 'id' | 'createdAt'>) => void
  updateBankAccount: (id: string, data: Partial<BankAccount>) => void
  deleteBankAccount: (id: string) => void
  
  // CRUD - Family Members
  addFamilyMember: (member: Omit<FamilyMember, 'id' | 'createdAt'>) => void
  updateFamilyMember: (id: string, data: Partial<FamilyMember>) => void
  deleteFamilyMember: (id: string) => void
  
  // CRUD - Categories
  addCategory: (category: Omit<Category, 'id'>) => void
  deleteCategory: (id: string) => void
  
  // Filters
  setFilters: (filters: Partial<GlobalFilters>) => void
  resetFilters: () => void
  
  // Computed values
  getFilteredTransactions: () => Transaction[]
  calculateTotalBalance: () => number
  calculateIncomeForPeriod: () => number
  calculateExpensesForPeriod: () => number
  calculateExpensesByCategory: () => ExpenseByCategory[]
  calculateCategoryPercentage: (categoryTotal: number) => number
  calculateSavingsRate: () => number
  getFlowChartData: () => FlowChartData[]
  getPendingExpenses: () => Transaction[]
  getCategoryById: (id: string) => Category | undefined
  getMemberById: (id: string) => FamilyMember | undefined
  getAccountById: (id: string) => BankAccount | CreditCard | undefined
}

const defaultFilters: GlobalFilters = {
  selectedMemberId: null,
  dateRange: {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
  },
  transactionType: 'all',
  searchText: '',
}

// ============================================
// Context
// ============================================

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(generateMockTransactions())
  const [goals, setGoals] = useState<Goal[]>(defaultGoals)
  const [creditCards, setCreditCards] = useState<CreditCard[]>(defaultCards)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(defaultAccounts)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(defaultMembers)
  const [categories, setCategories] = useState<Category[]>(defaultCategories)
  const [filters, setFiltersState] = useState<GlobalFilters>(defaultFilters)

  // ========== CRUD - Transactions ==========
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date(),
    }
    setTransactions(prev => [newTransaction, ...prev])
  }, [])

  const updateTransaction = useCallback((id: string, data: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
  }, [])

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  const markTransactionAsPaid = useCallback((id: string) => {
    setTransactions(prev => prev.map(t => 
      t.id === id ? { ...t, isPaid: true, status: 'completed' as const } : t
    ))
  }, [])

  // ========== CRUD - Goals ==========
  const addGoal = useCallback((goal: Omit<Goal, 'id' | 'createdAt'>) => {
    const newGoal: Goal = {
      ...goal,
      id: uuidv4(),
      createdAt: new Date(),
    }
    setGoals(prev => [...prev, newGoal])
  }, [])

  const updateGoal = useCallback((id: string, data: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...data } : g))
  }, [])

  const deleteGoal = useCallback((id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }, [])

  // ========== CRUD - Credit Cards ==========
  const addCreditCard = useCallback((card: Omit<CreditCard, 'id' | 'createdAt'>) => {
    const newCard: CreditCard = {
      ...card,
      id: uuidv4(),
      createdAt: new Date(),
    }
    setCreditCards(prev => [...prev, newCard])
  }, [])

  const updateCreditCard = useCallback((id: string, data: Partial<CreditCard>) => {
    setCreditCards(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }, [])

  const deleteCreditCard = useCallback((id: string) => {
    setCreditCards(prev => prev.filter(c => c.id !== id))
  }, [])

  // ========== CRUD - Bank Accounts ==========
  const addBankAccount = useCallback((account: Omit<BankAccount, 'id' | 'createdAt'>) => {
    const newAccount: BankAccount = {
      ...account,
      id: uuidv4(),
      createdAt: new Date(),
    }
    setBankAccounts(prev => [...prev, newAccount])
  }, [])

  const updateBankAccount = useCallback((id: string, data: Partial<BankAccount>) => {
    setBankAccounts(prev => prev.map(a => a.id === id ? { ...a, ...data } : a))
  }, [])

  const deleteBankAccount = useCallback((id: string) => {
    setBankAccounts(prev => prev.filter(a => a.id !== id))
  }, [])

  // ========== CRUD - Family Members ==========
  const addFamilyMember = useCallback((member: Omit<FamilyMember, 'id' | 'createdAt'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: uuidv4(),
      createdAt: new Date(),
    }
    setFamilyMembers(prev => [...prev, newMember])
  }, [])

  const updateFamilyMember = useCallback((id: string, data: Partial<FamilyMember>) => {
    setFamilyMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m))
  }, [])

  const deleteFamilyMember = useCallback((id: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id))
  }, [])

  // ========== CRUD - Categories ==========
  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: uuidv4(),
    }
    setCategories(prev => [...prev, newCategory])
  }, [])

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id))
  }, [])

  // ========== Filters ==========
  const setFilters = useCallback((newFilters: Partial<GlobalFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }))
  }, [])

  const resetFilters = useCallback(() => {
    setFiltersState(defaultFilters)
  }, [])

  // ========== Computed Values ==========
  const getFilteredTransactions = useCallback(() => {
    return transactions.filter(t => {
      // Filtro por membro
      if (filters.selectedMemberId && t.memberId !== filters.selectedMemberId) {
        return false
      }
      
      // Filtro por período
      const transactionDate = new Date(t.date)
      if (transactionDate < filters.dateRange.startDate || transactionDate > filters.dateRange.endDate) {
        return false
      }
      
      // Filtro por tipo
      if (filters.transactionType !== 'all' && t.type !== filters.transactionType) {
        return false
      }
      
      // Filtro por texto
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase()
        const category = categories.find(c => c.id === t.categoryId)
        const matchesDescription = t.description.toLowerCase().includes(searchLower)
        const matchesCategory = category?.name.toLowerCase().includes(searchLower)
        if (!matchesDescription && !matchesCategory) {
          return false
        }
      }
      
      return true
    })
  }, [transactions, filters, categories])

  const calculateTotalBalance = useCallback(() => {
    const accountsBalance = bankAccounts.reduce((sum, acc) => sum + acc.balance, 0)
    const cardsDebt = creditCards.reduce((sum, card) => sum + card.currentBill, 0)
    return accountsBalance - cardsDebt
  }, [bankAccounts, creditCards])

  const calculateIncomeForPeriod = useCallback(() => {
    const filtered = getFilteredTransactions()
    return filtered
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [getFilteredTransactions])

  const calculateExpensesForPeriod = useCallback(() => {
    const filtered = getFilteredTransactions()
    return filtered
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  }, [getFilteredTransactions])

  const calculateExpensesByCategory = useCallback((): ExpenseByCategory[] => {
    const filtered = getFilteredTransactions().filter(t => t.type === 'expense')
    const totalIncome = calculateIncomeForPeriod()
    
    const grouped = filtered.reduce((acc, t) => {
      if (!acc[t.categoryId]) {
        acc[t.categoryId] = 0
      }
      acc[t.categoryId] += t.amount
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(grouped)
      .map(([categoryId, total]) => {
        const category = categories.find(c => c.id === categoryId)
        return {
          categoryId,
          categoryName: category?.name || 'Outros',
          total,
          percentage: totalIncome > 0 ? (total / totalIncome) * 100 : 0,
          color: category?.color,
        }
      })
      .sort((a, b) => b.total - a.total)
  }, [getFilteredTransactions, calculateIncomeForPeriod, categories])

  const calculateCategoryPercentage = useCallback((categoryTotal: number) => {
    const totalIncome = calculateIncomeForPeriod()
    if (totalIncome === 0) return 0
    return (categoryTotal / totalIncome) * 100
  }, [calculateIncomeForPeriod])

  const calculateSavingsRate = useCallback(() => {
    const income = calculateIncomeForPeriod()
    const expenses = calculateExpensesForPeriod()
    if (income === 0) return 0
    return ((income - expenses) / income) * 100
  }, [calculateIncomeForPeriod, calculateExpensesForPeriod])

  const getFlowChartData = useCallback((): FlowChartData[] => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const now = new Date()
    const data: FlowChartData[] = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)
      
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.date)
        return tDate >= date && tDate <= monthEnd
      })
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)
      
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)
      
      data.push({
        month: months[date.getMonth()],
        income,
        expense,
      })
    }
    
    return data
  }, [transactions])

  const getPendingExpenses = useCallback(() => {
    return transactions
      .filter(t => t.type === 'expense' && !t.isPaid && t.dueDate)
      .sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
  }, [transactions])

  const getCategoryById = useCallback((id: string) => {
    return categories.find(c => c.id === id)
  }, [categories])

  const getMemberById = useCallback((id: string) => {
    return familyMembers.find(m => m.id === id)
  }, [familyMembers])

  const getAccountById = useCallback((id: string): BankAccount | CreditCard | undefined => {
    const account = bankAccounts.find(a => a.id === id)
    if (account) return account
    return creditCards.find(c => c.id === id)
  }, [bankAccounts, creditCards])

  // ========== Context Value ==========
  const value = useMemo<FinanceContextType>(() => ({
    // State
    transactions,
    goals,
    creditCards,
    bankAccounts,
    familyMembers,
    categories,
    filters,
    
    // CRUD - Transactions
    addTransaction,
    updateTransaction,
    deleteTransaction,
    markTransactionAsPaid,
    
    // CRUD - Goals
    addGoal,
    updateGoal,
    deleteGoal,
    
    // CRUD - Credit Cards
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    
    // CRUD - Bank Accounts
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    
    // CRUD - Family Members
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    
    // CRUD - Categories
    addCategory,
    deleteCategory,
    
    // Filters
    setFilters,
    resetFilters,
    
    // Computed values
    getFilteredTransactions,
    calculateTotalBalance,
    calculateIncomeForPeriod,
    calculateExpensesForPeriod,
    calculateExpensesByCategory,
    calculateCategoryPercentage,
    calculateSavingsRate,
    getFlowChartData,
    getPendingExpenses,
    getCategoryById,
    getMemberById,
    getAccountById,
  }), [
    transactions,
    goals,
    creditCards,
    bankAccounts,
    familyMembers,
    categories,
    filters,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    markTransactionAsPaid,
    addGoal,
    updateGoal,
    deleteGoal,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    addCategory,
    deleteCategory,
    setFilters,
    resetFilters,
    getFilteredTransactions,
    calculateTotalBalance,
    calculateIncomeForPeriod,
    calculateExpensesForPeriod,
    calculateExpensesByCategory,
    calculateCategoryPercentage,
    calculateSavingsRate,
    getFlowChartData,
    getPendingExpenses,
    getCategoryById,
    getMemberById,
    getAccountById,
  ])

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}

// ============================================
// Custom Hook
// ============================================

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
