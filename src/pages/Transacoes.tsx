import { useState, useMemo } from 'react'
import { useFinance } from '../contexts/FinanceContext'
import NewTransactionModal from '../components/modals/NewTransactionModal'

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export default function Transacoes() {
  const { 
    getFilteredTransactions, 
    getCategoryById, 
    getMemberById,
    categories,
    familyMembers,
    bankAccounts,
    creditCards,
  } = useFinance()
  
  const [showNewModal, setShowNewModal] = useState(false)
  const [localSearch, setLocalSearch] = useState('')
  const [localType, setLocalType] = useState<'all' | 'income' | 'expense'>('all')
  const [localCategoryId, setLocalCategoryId] = useState('')
  const [localAccountId, setLocalAccountId] = useState('')
  const [localMemberId, setLocalMemberId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  const itemsPerPage = 10

  const filteredTransactions = useMemo(() => {
    return getFilteredTransactions().filter(t => {
      if (localSearch) {
        const searchLower = localSearch.toLowerCase()
        const category = getCategoryById(t.categoryId)
        const matchesDescription = t.description.toLowerCase().includes(searchLower)
        const matchesCategory = category?.name.toLowerCase().includes(searchLower)
        if (!matchesDescription && !matchesCategory) return false
      }
      
      if (localType !== 'all' && t.type !== localType) return false
      if (localCategoryId && t.categoryId !== localCategoryId) return false
      if (localAccountId && t.accountId !== localAccountId) return false
      if (localMemberId && t.memberId !== localMemberId) return false
      
      return true
    })
  }, [getFilteredTransactions, localSearch, localType, localCategoryId, localAccountId, localMemberId, getCategoryById])

  // Statistics
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const difference = totalIncome - totalExpenses

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

  const resetFilters = () => {
    setLocalSearch('')
    setLocalType('all')
    setLocalCategoryId('')
    setLocalAccountId('')
    setLocalMemberId('')
    setCurrentPage(1)
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-heading-small text-neutral-1100">Transações</h1>
        <button 
          onClick={() => setShowNewModal(true)}
          className="btn btn-primary w-full sm:w-auto"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7H9V1C9 0.4 8.6 0 8 0Z"/>
          </svg>
          Nova Transação
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <input
              type="text"
              placeholder="Buscar lançamentos..."
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="input w-full"
            />
          </div>
          
          {/* Type */}
          <select
            value={localType}
            onChange={(e) => {
              setLocalType(e.target.value as 'all' | 'income' | 'expense')
              setCurrentPage(1)
            }}
            className="input"
          >
            <option value="all">Todos os tipos</option>
            <option value="income">Receitas</option>
            <option value="expense">Despesas</option>
          </select>
          
          {/* Category */}
          <select
            value={localCategoryId}
            onChange={(e) => {
              setLocalCategoryId(e.target.value)
              setCurrentPage(1)
            }}
            className="input"
          >
            <option value="">Todas categorias</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          
          {/* Account */}
          <select
            value={localAccountId}
            onChange={(e) => {
              setLocalAccountId(e.target.value)
              setCurrentPage(1)
            }}
            className="input"
          >
            <option value="">Todas contas</option>
            <optgroup label="Contas">
              {bankAccounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name}</option>
              ))}
            </optgroup>
            <optgroup label="Cartões">
              {creditCards.map(card => (
                <option key={card.id} value={card.id}>{card.name}</option>
              ))}
            </optgroup>
          </select>
          
          {/* Member */}
          <select
            value={localMemberId}
            onChange={(e) => {
              setLocalMemberId(e.target.value)
              setCurrentPage(1)
            }}
            className="input"
          >
            <option value="">Todos membros</option>
            {familyMembers.map(member => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
        </div>
        
        {/* Reset filters */}
        {(localSearch || localType !== 'all' || localCategoryId || localAccountId || localMemberId) && (
          <button 
            onClick={resetFilters}
            className="text-paragraph-small text-blue-600 mt-4 hover:underline"
          >
            Limpar filtros
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card bg-green-600/10">
          <p className="text-paragraph-x-small text-neutral-500 mb-1">Total Receitas</p>
          <p className="text-label-large text-green-600">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="card bg-red-600/10">
          <p className="text-paragraph-x-small text-neutral-500 mb-1">Total Despesas</p>
          <p className="text-label-large text-red-600">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className={`card ${difference >= 0 ? 'bg-green-600/10' : 'bg-red-600/10'}`}>
          <p className="text-paragraph-x-small text-neutral-500 mb-1">Diferença</p>
          <p className={`text-label-large ${difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(difference)}
          </p>
        </div>
        <div className="card bg-blue-600/10">
          <p className="text-paragraph-x-small text-neutral-500 mb-1">Transações</p>
          <p className="text-label-large text-blue-600">{filteredTransactions.length}</p>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-neutral-300">
              <th className="text-left py-3 px-2 text-label-small text-neutral-500">Membro</th>
              <th className="text-left py-3 px-2 text-label-small text-neutral-500">Data</th>
              <th className="text-left py-3 px-2 text-label-small text-neutral-500">Descrição</th>
              <th className="text-left py-3 px-2 text-label-small text-neutral-500">Categoria</th>
              <th className="text-left py-3 px-2 text-label-small text-neutral-500">Conta</th>
              <th className="text-left py-3 px-2 text-label-small text-neutral-500">Parcelas</th>
              <th className="text-right py-3 px-2 text-label-small text-neutral-500">Valor</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-paragraph-small text-neutral-500">
                  Nenhuma transação encontrada.
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
                        <span className="text-paragraph-small text-neutral-1100">{t.description}</span>
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-paragraph-small text-neutral-500">
            Mostrando {(currentPage - 1) * itemsPerPage + 1} a {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} de {filteredTransactions.length}
          </p>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage === 1 ? 'text-neutral-400' : 'hover:bg-neutral-300'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z"/>
              </svg>
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = currentPage <= 3 ? i + 1 : currentPage + i - 2
              if (page > totalPages) return null
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-paragraph-small ${page === currentPage ? 'bg-neutral-1100 text-neutral-0' : 'hover:bg-neutral-300'}`}
                >
                  {page}
                </button>
              )
            })}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${currentPage === totalPages ? 'text-neutral-400' : 'hover:bg-neutral-300'}`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.59 16.59L10 18L16 12L10 6L8.59 7.41L13.17 12L8.59 16.59Z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <NewTransactionModal 
        isOpen={showNewModal} 
        onClose={() => setShowNewModal(false)} 
      />
    </div>
  )
}
