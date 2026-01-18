import { useFinance } from '../../contexts/FinanceContext'

interface CardDetailsModalProps {
  isOpen: boolean
  cardId: string | null
  onClose: () => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export default function CardDetailsModal({ isOpen, cardId, onClose }: CardDetailsModalProps) {
  const { creditCards, transactions, getCategoryById, getMemberById } = useFinance()

  if (!isOpen || !cardId) return null

  const card = creditCards.find(c => c.id === cardId)
  if (!card) return null

  const holder = getMemberById(card.holderId)
  const availableLimit = card.limit - card.currentBill
  const usagePercentage = Math.round((card.currentBill / card.limit) * 100)

  // Get transactions for this card
  const cardTransactions = transactions
    .filter(t => t.accountId === cardId && t.type === 'expense')
    .slice(0, 10)

  return (
    <>
      <div className="fixed inset-0 z-50 bg-neutral-1100/50" onClick={onClose} />
      
      <div className="
        fixed inset-x-4 top-1/2 -translate-y-1/2 z-50
        max-w-2xl mx-auto max-h-[90vh] overflow-y-auto
        bg-surface-500 rounded-shape-20 shadow-elevated
        animate-fade-in
      ">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-300 sticky top-0 bg-surface-500">
          <h2 className="text-heading-x-small font-bold text-neutral-1100">
            {card.name}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-300"
          >
            <svg className="w-5 h-5 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Card Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="card bg-background-400">
              <p className="text-paragraph-x-small text-neutral-500 mb-1">Limite Total</p>
              <p className="text-label-medium text-neutral-1100">{formatCurrency(card.limit)}</p>
            </div>
            <div className="card bg-background-400">
              <p className="text-paragraph-x-small text-neutral-500 mb-1">Fatura Atual</p>
              <p className="text-label-medium text-red-600">{formatCurrency(card.currentBill)}</p>
            </div>
            <div className="card bg-background-400">
              <p className="text-paragraph-x-small text-neutral-500 mb-1">Limite Disponível</p>
              <p className="text-label-medium text-green-600">{formatCurrency(availableLimit)}</p>
            </div>
            <div className="card bg-background-400">
              <p className="text-paragraph-x-small text-neutral-500 mb-1">Uso do Limite</p>
              <p className="text-label-medium text-neutral-1100">{usagePercentage}%</p>
            </div>
            <div className="card bg-background-400">
              <p className="text-paragraph-x-small text-neutral-500 mb-1">Fechamento</p>
              <p className="text-label-medium text-neutral-1100">Dia {card.closingDay}</p>
            </div>
            <div className="card bg-background-400">
              <p className="text-paragraph-x-small text-neutral-500 mb-1">Vencimento</p>
              <p className="text-label-medium text-neutral-1100">Dia {card.dueDay}</p>
            </div>
          </div>

          {/* Usage Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-paragraph-small mb-2">
              <span className="text-neutral-500">Uso do limite</span>
              <span className="text-neutral-1100">{usagePercentage}%</span>
            </div>
            <div className="w-full h-3 bg-neutral-300 rounded-full overflow-hidden">
              <div 
                className={`
                  h-full rounded-full transition-all duration-500
                  ${usagePercentage > 80 ? 'bg-red-600' : usagePercentage > 50 ? 'bg-primary-500' : 'bg-green-600'}
                `}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Holder Info */}
          {holder && (
            <div className="flex items-center gap-3 mb-6 p-3 bg-background-400 rounded-shape-20">
              <img
                src={holder.avatarUrl}
                alt={holder.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-label-small text-neutral-1100">{holder.name}</p>
                <p className="text-paragraph-x-small text-neutral-500">Titular</p>
              </div>
            </div>
          )}

          {/* Card Number */}
          {card.lastDigits && (
            <p className="text-paragraph-small text-neutral-500 mb-6">
              Cartão terminado em •••• {card.lastDigits}
            </p>
          )}

          {/* Transactions */}
          <div>
            <h3 className="text-label-medium text-neutral-1100 mb-4">
              Despesas Recentes
            </h3>
            
            {cardTransactions.length === 0 ? (
              <p className="text-paragraph-small text-neutral-500 text-center py-8">
                Nenhuma despesa registrada neste cartão ainda.
              </p>
            ) : (
              <div className="space-y-3">
                {cardTransactions.map(t => {
                  const category = getCategoryById(t.categoryId)
                  return (
                    <div 
                      key={t.id}
                      className="flex items-center justify-between p-3 bg-background-400 rounded-shape-20"
                    >
                      <div>
                        <p className="text-label-small text-neutral-1100">{t.description}</p>
                        <p className="text-paragraph-x-small text-neutral-500">
                          {formatDate(t.date)} • {category?.name || 'Sem categoria'}
                        </p>
                      </div>
                      <p className="text-label-small text-neutral-1100">
                        {formatCurrency(t.amount)}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-300 sticky bottom-0 bg-surface-500">
          <button onClick={onClose} className="btn btn-ghost">
            Fechar
          </button>
          <button className="btn btn-primary">
            Adicionar Despesa
          </button>
        </div>
      </div>
    </>
  )
}
