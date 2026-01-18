import { useFinance } from '../../contexts/FinanceContext'

interface NextExpensesWidgetProps {
  onAddExpense?: () => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(date))
}

export default function NextExpensesWidget({ onAddExpense }: NextExpensesWidgetProps) {
  const { getPendingExpenses, markTransactionAsPaid, getAccountById, creditCards } = useFinance()
  
  const pendingExpenses = getPendingExpenses().slice(0, 5)

  const getAccountInfo = (accountId: string) => {
    const account = getAccountById(accountId)
    if (!account) return 'Desconhecido'
    
    // Check if it's a credit card
    const isCard = creditCards.some(c => c.id === accountId)
    if (isCard) {
      const card = creditCards.find(c => c.id === accountId)
      return `Crédito ${card?.name} **** ${card?.lastDigits || '0000'}`
    }
    
    return account.name
  }

  const handleMarkAsPaid = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    markTransactionAsPaid(id)
  }

  if (pendingExpenses.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"/>
            </svg>
            <h3 className="text-heading-x-small font-bold text-neutral-1100">
              Próximas despesas
            </h3>
          </div>
          <button 
            onClick={onAddExpense}
            className="
              w-8 h-8 rounded-full
              bg-surface-500 border border-neutral-300
              flex items-center justify-center
              hover:bg-neutral-300
              transition-colors
            "
          >
            <svg className="w-4 h-4 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
            </svg>
          </button>
        </div>
        
        <div className="
          flex flex-col items-center justify-center
          py-8 border-2 border-dashed border-neutral-300
          rounded-shape-20
        ">
          <div className="w-12 h-12 rounded-full bg-green-600/10 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
            </svg>
          </div>
          <p className="text-paragraph-small text-neutral-500">
            Nenhuma despesa pendente
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"/>
          </svg>
          <h3 className="text-heading-x-small font-bold text-neutral-1100">
            Próximas despesas
          </h3>
        </div>
        <button 
          onClick={onAddExpense}
          className="
            w-8 h-8 rounded-full
            bg-surface-500 border border-neutral-300
            flex items-center justify-center
            hover:bg-neutral-300
            transition-colors
          "
        >
          <svg className="w-4 h-4 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
          </svg>
        </button>
      </div>

      {/* Expenses List */}
      <div className="space-y-4">
        {pendingExpenses.map((expense) => (
          <div
            key={expense.id}
            className="
              flex items-start justify-between
              pb-4 border-b border-neutral-300 last:border-0 last:pb-0
            "
          >
            <div className="flex-1">
              <p className="text-label-medium text-neutral-1100 mb-1">
                {expense.description}
              </p>
              <p className="text-paragraph-x-small text-neutral-500 mb-1">
                Vence dia {expense.dueDate ? formatDate(expense.dueDate) : '-'}
              </p>
              <p className="text-paragraph-x-small text-neutral-400">
                {getAccountInfo(expense.accountId)}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-label-medium text-neutral-1100">
                {formatCurrency(expense.amount)}
              </span>
              <button
                onClick={(e) => handleMarkAsPaid(expense.id, e)}
                className="
                  w-8 h-8 rounded-full
                  border border-neutral-300
                  flex items-center justify-center
                  hover:bg-green-600/10 hover:border-green-600
                  transition-colors
                  group
                "
                title="Marcar como pago"
              >
                <svg 
                  className="w-4 h-4 text-neutral-500 group-hover:text-green-600" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
