import { useState } from 'react'
import { useFinance } from '../../contexts/FinanceContext'

interface DashboardHeaderProps {
  onNewTransaction: () => void
}

export default function DashboardHeader({ onNewTransaction }: DashboardHeaderProps) {
  const { familyMembers, filters, setFilters } = useFinance()
  const [showDatePicker, setShowDatePicker] = useState(false)

  const formatDateRange = () => {
    const start = filters.dateRange.startDate
    const end = filters.dateRange.endDate
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }
    const startStr = start.toLocaleDateString('pt-BR', options)
    const endStr = end.toLocaleDateString('pt-BR', options)
    const year = end.getFullYear()
    return `${startStr} - ${endStr}, ${year}`
  }

  const handleMemberClick = (memberId: string | null) => {
    if (filters.selectedMemberId === memberId) {
      setFilters({ selectedMemberId: null })
    } else {
      setFilters({ selectedMemberId: memberId })
    }
  }

  const handleQuickDateRange = (range: 'thisMonth' | 'lastMonth' | 'last3Months' | 'thisYear') => {
    const now = new Date()
    let startDate: Date
    let endDate: Date

    switch (range) {
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        endDate = new Date(now.getFullYear(), now.getMonth(), 0)
        break
      case 'last3Months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
        break
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1)
        endDate = new Date(now.getFullYear(), 11, 31)
        break
    }

    setFilters({ dateRange: { startDate, endDate } })
    setShowDatePicker(false)
  }

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      {/* Left side: Search, Filter, Date */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search */}
        <div className="relative">
          <svg 
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"/>
          </svg>
          <input
            type="text"
            placeholder="Pesquisar"
            value={filters.searchText}
            onChange={(e) => setFilters({ searchText: e.target.value })}
            className="input pl-11 w-full sm:w-44"
          />
        </div>

        {/* Filter button */}
        <button className="
          p-3 rounded-shape-100
          border border-neutral-500
          hover:bg-neutral-300
          transition-colors
          flex items-center justify-center
        ">
          <svg className="w-4 h-4 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 17V19H9V17H3ZM3 5V7H13V5H3ZM13 21V19H21V17H13V15H11V21H13ZM7 9V11H3V13H7V15H9V9H7ZM21 13V11H11V13H21ZM15 9H17V7H21V5H17V3H15V9Z"/>
          </svg>
        </button>

        {/* Date Range Picker */}
        <div className="relative">
          <button 
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="
              flex items-center gap-2
              px-4 py-3 rounded-shape-100
              border border-neutral-500
              hover:bg-neutral-300
              transition-colors
              text-paragraph-small text-neutral-1100
            "
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3.01 3.9 3.01 5L3 19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V8H19V19ZM9 12H7V10H9V12ZM13 12H11V10H13V12ZM17 12H15V10H17V12ZM9 16H7V14H9V16ZM13 16H11V14H13V16ZM17 16H15V14H17V16Z"/>
            </svg>
            <span>{formatDateRange()}</span>
          </button>

          {/* Date Picker Dropdown */}
          {showDatePicker && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowDatePicker(false)} 
              />
              <div className="
                absolute top-full left-0 mt-2 z-50
                bg-surface-500 border border-neutral-300
                rounded-shape-20 shadow-elevated
                p-4 min-w-[200px]
              ">
                <p className="text-label-small text-neutral-500 mb-3">Atalhos</p>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleQuickDateRange('thisMonth')}
                    className="text-left px-3 py-2 rounded-shape-20 hover:bg-neutral-300 text-paragraph-small"
                  >
                    Este mês
                  </button>
                  <button 
                    onClick={() => handleQuickDateRange('lastMonth')}
                    className="text-left px-3 py-2 rounded-shape-20 hover:bg-neutral-300 text-paragraph-small"
                  >
                    Mês passado
                  </button>
                  <button 
                    onClick={() => handleQuickDateRange('last3Months')}
                    className="text-left px-3 py-2 rounded-shape-20 hover:bg-neutral-300 text-paragraph-small"
                  >
                    Últimos 3 meses
                  </button>
                  <button 
                    onClick={() => handleQuickDateRange('thisYear')}
                    className="text-left px-3 py-2 rounded-shape-20 hover:bg-neutral-300 text-paragraph-small"
                  >
                    Este ano
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Members */}
        <div className="flex items-center -space-x-2">
          {familyMembers.slice(0, 3).map((member) => (
            <button
              key={member.id}
              onClick={() => handleMemberClick(member.id)}
              className={`
                relative w-11 h-11 rounded-full
                border-2 transition-all duration-200
                hover:scale-110 hover:z-10
                ${filters.selectedMemberId === member.id 
                  ? 'border-neutral-1100 ring-2 ring-primary-500' 
                  : 'border-neutral-0'
                }
              `}
              title={member.name}
            >
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-full h-full rounded-full object-cover"
              />
              {filters.selectedMemberId === member.id && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-neutral-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"/>
                  </svg>
                </div>
              )}
            </button>
          ))}
          
          {/* Add member button */}
          <button className="
            w-11 h-11 rounded-full
            border-2 border-dashed border-neutral-400
            flex items-center justify-center
            hover:border-neutral-1100 hover:bg-neutral-300
            transition-colors
          ">
            <svg className="w-4 h-4 text-neutral-500" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Right side: New Transaction button */}
      <button 
        onClick={onNewTransaction}
        className="btn btn-primary w-full lg:w-auto"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
        </svg>
        Nova transação
      </button>
    </div>
  )
}
