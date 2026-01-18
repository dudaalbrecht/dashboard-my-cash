import { useState } from 'react'
import { useFinance } from '../contexts/FinanceContext'
import AddCardModal from '../components/modals/AddCardModal'
import CardDetailsModal from '../components/modals/CardDetailsModal'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function Cartoes() {
  const { creditCards, getMemberById } = useFinance()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  const getUsagePercentage = (currentBill: number, limit: number) => {
    return Math.round((currentBill / limit) * 100)
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-heading-small text-neutral-1100">Cartões de Crédito</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary w-full sm:w-auto"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7H9V1C9 0.4 8.6 0 8 0Z"/>
          </svg>
          Novo Cartão
        </button>
      </div>

      {creditCards.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-neutral-300/50 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-neutral-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"/>
            </svg>
          </div>
          <h3 className="text-label-large text-neutral-1100 mb-2">Nenhum cartão cadastrado</h3>
          <p className="text-paragraph-small text-neutral-500 mb-4">
            Adicione seu primeiro cartão de crédito
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            Cadastrar Primeiro Cartão
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {creditCards
            .sort((a, b) => b.currentBill - a.currentBill)
            .map(card => {
              const holder = getMemberById(card.holderId)
              const usage = getUsagePercentage(card.currentBill, card.limit)
              const availableLimit = card.limit - card.currentBill
              
              return (
                <div 
                  key={card.id} 
                  onClick={() => setSelectedCardId(card.id)}
                  className={`
                    card cursor-pointer
                    transition-all duration-200
                    hover:-translate-y-2 hover:shadow-elevated
                    ${card.theme === 'black' ? 'border-l-4 border-l-neutral-1100' : ''}
                    ${card.theme === 'lime' ? 'border-l-4 border-l-primary-500' : ''}
                    ${card.theme === 'white' ? 'border-l-4 border-l-neutral-300' : ''}
                  `}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-label-large text-neutral-1100">{card.name}</h3>
                      <p className="text-paragraph-x-small text-neutral-500">
                        {holder?.name || 'Sem titular'}
                      </p>
                    </div>
                    <div 
                      className={`
                        w-12 h-8 rounded-shape-2
                        ${card.theme === 'black' ? 'bg-neutral-1100' : ''}
                        ${card.theme === 'lime' ? 'bg-primary-500' : ''}
                        ${card.theme === 'white' ? 'bg-neutral-0 border border-neutral-300' : ''}
                      `}
                    />
                  </div>

                  {/* Values */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <p className="text-paragraph-x-small text-neutral-500">Fatura Atual</p>
                      <p className={`text-heading-small font-bold ${usage > 80 ? 'text-red-600' : 'text-neutral-1100'}`}>
                        {formatCurrency(card.currentBill)}
                      </p>
                    </div>
                    <div className="flex justify-between text-paragraph-small">
                      <span className="text-neutral-500">Limite disponível</span>
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(availableLimit)}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-paragraph-x-small mb-1">
                      <span className="text-neutral-500">Uso do limite</span>
                      <span className="text-neutral-1100">{usage}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-300 rounded-full overflow-hidden">
                      <div 
                        className={`
                          h-full rounded-full transition-all duration-500
                          ${usage > 80 ? 'bg-red-600' : usage > 50 ? 'bg-primary-500' : 'bg-green-600'}
                        `}
                        style={{ width: `${Math.min(usage, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-neutral-300 flex flex-wrap justify-between gap-2 text-paragraph-x-small text-neutral-500">
                    <span>Fecha dia {card.closingDay}</span>
                    <span>Vence dia {card.dueDay}</span>
                    {card.lastDigits && <span>•••• {card.lastDigits}</span>}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedCardId(card.id)
                      }}
                      className="btn btn-ghost flex-1 text-paragraph-small"
                    >
                      Ver Detalhes
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        // TODO: Open new transaction modal with card pre-selected
                      }}
                      className="btn btn-primary flex-1 text-paragraph-small"
                    >
                      Adicionar Despesa
                    </button>
                  </div>
                </div>
              )
            })}
        </div>
      )}

      {/* Modals */}
      <AddCardModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
      />
      
      <CardDetailsModal 
        isOpen={!!selectedCardId} 
        cardId={selectedCardId}
        onClose={() => setSelectedCardId(null)} 
      />
    </div>
  )
}
