import { useFinance } from '../../contexts/FinanceContext'

interface CreditCardsWidgetProps {
  onAddCard?: () => void
  onCardClick?: (cardId: string) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function CreditCardsWidget({ onAddCard, onCardClick }: CreditCardsWidgetProps) {
  const { creditCards } = useFinance()

  return (
    <div className="card bg-background-400">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"/>
          </svg>
          <h3 className="text-heading-x-small font-bold text-neutral-1100">
            Cards & contas
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onAddCard}
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
          <button className="
            w-8 h-8 rounded-full
            bg-surface-500 border border-neutral-300
            flex items-center justify-center
            hover:bg-neutral-300
            transition-colors
          ">
            <svg className="w-4 h-4 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {creditCards.slice(0, 3).map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => onCardClick?.(card.id)}
              className="
                bg-surface-500 rounded-shape-20
                p-4 cursor-pointer
                transition-all duration-200
                hover:-translate-y-1 hover:shadow-elevated
              "
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className={`
                        w-4 h-4 rounded-shape-2
                        ${card.theme === 'black' ? 'bg-neutral-1100' : ''}
                        ${card.theme === 'lime' ? 'bg-primary-500' : ''}
                        ${card.theme === 'white' ? 'bg-neutral-0 border border-neutral-300' : ''}
                      `}
                    />
                    <span className="text-paragraph-small text-neutral-1100">
                      {card.name}
                    </span>
                  </div>
                  <p className="text-heading-small font-bold text-neutral-1100">
                    {formatCurrency(card.currentBill)}
                  </p>
                  <p className="text-label-x-small text-neutral-500">
                    Vence dia {card.dueDay}
                  </p>
                </div>
                
                <span className="text-label-x-small text-neutral-500">
                  **** {card.lastDigits || '0000'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
