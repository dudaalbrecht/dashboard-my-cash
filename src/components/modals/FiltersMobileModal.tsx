import { useState, useEffect } from 'react'
import { useFinance } from '../../contexts/FinanceContext'
import { TransactionType } from '../../types'

interface FiltersMobileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function FiltersMobileModal({ isOpen, onClose }: FiltersMobileModalProps) {
  const { filters, setFilters, familyMembers } = useFinance()

  // Local state for temporary filters
  const [localType, setLocalType] = useState<'all' | TransactionType>(filters.transactionType)
  const [localMemberId, setLocalMemberId] = useState<string | null>(filters.selectedMemberId)
  const [localStartDate, setLocalStartDate] = useState(filters.dateRange.startDate)
  const [localEndDate, setLocalEndDate] = useState(filters.dateRange.endDate)

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalType(filters.transactionType)
      setLocalMemberId(filters.selectedMemberId)
      setLocalStartDate(filters.dateRange.startDate)
      setLocalEndDate(filters.dateRange.endDate)
    }
  }, [isOpen, filters])

  const handleApply = () => {
    setFilters({
      transactionType: localType,
      selectedMemberId: localMemberId,
      dateRange: {
        startDate: localStartDate,
        endDate: localEndDate,
      },
    })
    onClose()
  }

  const handleQuickPeriod = (period: 'thisMonth' | 'lastMonth' | 'last3Months' | 'thisYear') => {
    const now = new Date()
    let start: Date
    let end: Date

    switch (period) {
      case 'thisMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1)
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case 'lastMonth':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        end = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      case 'last3Months':
        start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case 'thisYear':
        start = new Date(now.getFullYear(), 0, 1)
        end = new Date(now.getFullYear(), 11, 31)
        break
    }

    setLocalStartDate(start)
    setLocalEndDate(end)
  }

  if (!isOpen) return null

  return (
    <div className="
      fixed inset-0 z-50
      flex flex-col
      bg-surface-500
      animate-slide-up
    ">
      {/* Header */}
      <header className="
        flex items-center justify-between
        px-4 py-4 border-b border-neutral-300
      ">
        <h2 className="text-heading-x-small font-bold text-neutral-1100">
          Filtros
        </h2>
        <button
          onClick={onClose}
          className="w-11 h-11 rounded-full flex items-center justify-center hover:bg-neutral-300 touch-target"
        >
          <svg className="w-6 h-6 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        {/* Transaction Type */}
        <section className="mb-8">
          <h3 className="text-label-medium text-neutral-1100 mb-4">
            Tipo de Transação
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {(['all', 'income', 'expense'] as const).map(t => (
              <button
                key={t}
                onClick={() => setLocalType(t)}
                className={`
                  py-3 rounded-shape-20 text-label-small
                  transition-all duration-200 touch-target
                  ${localType === t 
                    ? 'bg-neutral-1100 text-neutral-0' 
                    : 'bg-neutral-0 border border-neutral-300 text-neutral-500'
                  }
                `}
              >
                {t === 'all' ? 'Todos' : t === 'income' ? 'Receitas' : 'Despesas'}
              </button>
            ))}
          </div>
        </section>

        {/* Family Member */}
        <section className="mb-8">
          <h3 className="text-label-medium text-neutral-1100 mb-4">
            Membro da Família
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLocalMemberId(null)}
              className={`
                px-4 py-3 rounded-shape-100 text-label-small
                transition-all duration-200 touch-target
                ${localMemberId === null 
                  ? 'bg-neutral-1100 text-neutral-0' 
                  : 'bg-neutral-0 border border-neutral-300 text-neutral-500'
                }
              `}
            >
              Todos
            </button>
            {familyMembers.map(member => (
              <button
                key={member.id}
                onClick={() => setLocalMemberId(member.id)}
                className={`
                  flex items-center gap-2
                  px-4 py-2 rounded-shape-100 text-label-small
                  transition-all duration-200 touch-target
                  ${localMemberId === member.id 
                    ? 'bg-neutral-1100 text-neutral-0' 
                    : 'bg-neutral-0 border border-neutral-300 text-neutral-500'
                  }
                `}
              >
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className={`
                    w-8 h-8 rounded-full
                    ${localMemberId === member.id ? 'border-2 border-neutral-0' : ''}
                  `}
                />
                {member.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </section>

        {/* Period */}
        <section className="mb-8">
          <h3 className="text-label-medium text-neutral-1100 mb-4">
            Período
          </h3>
          
          {/* Quick options */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => handleQuickPeriod('thisMonth')}
              className="py-3 rounded-shape-20 text-label-small bg-neutral-0 border border-neutral-300 text-neutral-500 hover:bg-neutral-300 touch-target"
            >
              Este mês
            </button>
            <button
              onClick={() => handleQuickPeriod('lastMonth')}
              className="py-3 rounded-shape-20 text-label-small bg-neutral-0 border border-neutral-300 text-neutral-500 hover:bg-neutral-300 touch-target"
            >
              Mês passado
            </button>
            <button
              onClick={() => handleQuickPeriod('last3Months')}
              className="py-3 rounded-shape-20 text-label-small bg-neutral-0 border border-neutral-300 text-neutral-500 hover:bg-neutral-300 touch-target"
            >
              Últimos 3 meses
            </button>
            <button
              onClick={() => handleQuickPeriod('thisYear')}
              className="py-3 rounded-shape-20 text-label-small bg-neutral-0 border border-neutral-300 text-neutral-500 hover:bg-neutral-300 touch-target"
            >
              Este ano
            </button>
          </div>

          {/* Date inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-paragraph-x-small text-neutral-500 mb-2">
                Data inicial
              </label>
              <input
                type="date"
                value={localStartDate.toISOString().split('T')[0]}
                onChange={(e) => setLocalStartDate(new Date(e.target.value))}
                className="input touch-target"
              />
            </div>
            <div>
              <label className="block text-paragraph-x-small text-neutral-500 mb-2">
                Data final
              </label>
              <input
                type="date"
                value={localEndDate.toISOString().split('T')[0]}
                onChange={(e) => setLocalEndDate(new Date(e.target.value))}
                className="input touch-target"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-4 py-4 border-t border-neutral-300">
        <button
          onClick={handleApply}
          className="btn btn-primary w-full h-14 text-label-large touch-target"
        >
          Aplicar Filtros
        </button>
      </footer>
    </div>
  )
}
