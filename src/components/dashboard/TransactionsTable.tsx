import { useState, useMemo } from 'react'
import { useFinance } from '../../contexts/FinanceContext'

interface TransactionsTableProps {
  compact?: boolean
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

export default function TransactionsTable({ compact = false }: TransactionsTableProps) {
  const { 
    getFilteredTransactions, 
    getCategoryById, 
    getMemberById, 
    creditCards,
    bankAccounts,
  } = useFinance()
  
  const [localSearch, setLocalSearch] = useState('')
  const [localType, setLocalType] = useState<'all' | 'income' | 'expense'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  
  const itemsPerPage = compact ? 5 : 10

  const filteredTransactions = useMemo(() => {
    return getFilteredTransactions().filter(t => {
      // Local search filter
      if (localSearch) {
        const searchLower = localSearch.toLowerCase()
        const category = getCategoryById(t.categoryId)
        const matchesDescription = t.description.toLowerCase().includes(searchLower)
        const matchesCategory = category?.name.toLowerCase().includes(searchLower)
        if (!matchesDescription && !matchesCategory) return false
      }
      
      // Local type filter
      if (localType !== 'all' && t.type !== localType) return false
      
      return true
    })
  }, [getFilteredTransactions, localSearch, localType, getCategoryById])

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getAccountName = (accountId: string) => {
    const account = bankAccounts.find(a => a.id === accountId)
    if (account) return account.name
    
    const card = creditCards.find(c => c.id === accountId)
    if (card) return card.name
    
    return 'Desconhecido'
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const renderPagination = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1, 2, 3)
      if (currentPage > 4) pages.push('...')
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage)
      }
      if (currentPage < totalPages - 3) pages.push('...')
      pages.push(totalPages - 1, totalPages)
    }

    return pages
  }

  return (
    <div className="card">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM7 10H9V17H7V10ZM11 7H13V17H11V7ZM15 13H17V17H15V13Z"/>
          </svg>
          <h3 className="text-heading-x-small font-bold text-neutral-1100">
            Extrato detalhado
          </h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <svg 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar lançamentos"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="input pl-10 w-full sm:w-52"
            />
          </div>
          
          {/* Type filter */}
          <div className="flex items-center gap-2">
            <span className="text-paragraph-small text-neutral-500">
              {localType === 'all' ? 'Todos' : localType === 'income' ? 'Receitas' : 'Despesas'}
            </span>
            <select
              value={localType}
              onChange={(e) => {
                setLocalType(e.target.value as 'all' | 'income' | 'expense')
                setCurrentPage(1)
              }}
              className="
                w-4 h-4 opacity-0 absolute
              "
            />
            <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10L12 15L17 10H7Z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-neutral-300">
              <th className="text-left py-3 px-2 text-label-small text-neutral-500 font-semibold">
                Membro
              </th>
              <th className="text-left py-3 px-2 text-label-small text-neutral-500 font-semibold">
                Datas
              </th>
              <th className="text-left py-3 px-2 text-label-small text-neutral-500 font-semibold">
                Descrição
              </th>
              <th className="text-left py-3 px-2 text-label-small text-neutral-500 font-semibold">
                Categorias
              </th>
              <th className="text-left py-3 px-2 text-label-small text-neutral-500 font-semibold">
                Conta/cartão
              </th>
              <th className="text-left py-3 px-2 text-label-small text-neutral-500 font-semibold">
                Parcelas
              </th>
              <th className="text-right py-3 px-2 text-label-small text-neutral-500 font-semibold">
                Valor
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-paragraph-small text-neutral-500">
                  Nenhum lançamento encontrado.
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((t, index) => {
                const category = getCategoryById(t.categoryId)
                const member = t.memberId ? getMemberById(t.memberId) : null
                
                return (
                  <tr 
                    key={t.id} 
                    className={`
                      border-b border-neutral-300 last:border-0
                      hover:bg-neutral-300/30 transition-colors
                      ${index % 2 === 0 ? 'bg-neutral-0' : 'bg-neutral-300/10'}
                    `}
                  >
                    <td className="py-3 px-2">
                      {member ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-6 h-6 rounded-full"
                          title={member.name}
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-neutral-300 flex items-center justify-center">
                          <svg className="w-3 h-3 text-neutral-500" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-paragraph-small text-neutral-500">
                      {formatDate(t.date)}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className={`
                          w-4 h-4 rounded-full flex items-center justify-center
                          ${t.type === 'income' ? 'bg-green-600/10' : 'bg-red-600/10'}
                        `}>
                          <svg 
                            className={`w-2.5 h-2.5 ${t.type === 'income' ? 'text-green-600 rotate-180' : 'text-red-600'}`} 
                            viewBox="0 0 24 24" 
                            fill="currentColor"
                          >
                            <path d="M4 12L5.41 13.41L11 7.83V20H13V7.83L18.59 13.41L20 12L12 4L4 12Z"/>
                          </svg>
                        </div>
                        <span className="text-paragraph-small text-neutral-1100">
                          {t.description}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-paragraph-small text-neutral-500">
                      {category?.name || 'Sem categoria'}
                    </td>
                    <td className="py-3 px-2 text-paragraph-small text-neutral-500">
                      {getAccountName(t.accountId)}
                    </td>
                    <td className="py-3 px-2 text-paragraph-small text-neutral-500">
                      {t.installments > 1 ? `${t.currentInstallment || 1}/${t.installments}` : '-'}
                    </td>
                    <td className={`
                      py-3 px-2 text-right text-label-small
                      ${t.type === 'income' ? 'text-green-600' : 'text-neutral-1100'}
                    `}>
                      {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-neutral-300">
          <p className="text-paragraph-small text-neutral-500">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} de {filteredTransactions.length}
          </p>
          
          <div className="flex items-center gap-1">
            {/* Previous */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${currentPage === 1 
                  ? 'text-neutral-400 cursor-not-allowed' 
                  : 'text-neutral-1100 hover:bg-neutral-300'
                }
              `}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"/>
              </svg>
            </button>
            
            {/* Page numbers */}
            {renderPagination().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-paragraph-small
                  ${page === currentPage 
                    ? 'bg-neutral-1100 text-neutral-0' 
                    : page === '...'
                      ? 'text-neutral-500 cursor-default'
                      : 'text-neutral-500 hover:bg-neutral-300'
                  }
                `}
              >
                {page}
              </button>
            ))}
            
            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${currentPage === totalPages 
                  ? 'text-neutral-400 cursor-not-allowed' 
                  : 'text-neutral-1100 hover:bg-neutral-300'
                }
              `}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
