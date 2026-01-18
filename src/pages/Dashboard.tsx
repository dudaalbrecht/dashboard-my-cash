import { useState } from 'react'
import { useFinance } from '../contexts/FinanceContext'
import BalanceCard from '../components/dashboard/BalanceCard'
import IncomeCard from '../components/dashboard/IncomeCard'
import ExpenseCard from '../components/dashboard/ExpenseCard'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import CategoryCarousel from '../components/dashboard/CategoryCarousel'
import FlowChart from '../components/dashboard/FlowChart'
import CreditCardsWidget from '../components/dashboard/CreditCardsWidget'
import NextExpensesWidget from '../components/dashboard/NextExpensesWidget'
import TransactionsTable from '../components/dashboard/TransactionsTable'
import NewTransactionModal from '../components/modals/NewTransactionModal'
import AddCardModal from '../components/modals/AddCardModal'
import CardDetailsModal from '../components/modals/CardDetailsModal'

export default function Dashboard() {
  const { 
    calculateTotalBalance, 
    calculateIncomeForPeriod, 
    calculateExpensesForPeriod 
  } = useFinance()

  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false)
  const [showAddCardModal, setShowAddCardModal] = useState(false)
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)

  const balance = calculateTotalBalance()
  const income = calculateIncomeForPeriod()
  const expenses = calculateExpensesForPeriod()

  // Mock previous balance for growth calculation
  const previousBalance = balance * 0.9

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page Title - Hidden visually but accessible */}
      <h1 className="sr-only">Dashboard</h1>

      {/* Dashboard Header with filters */}
      <DashboardHeader onNewTransaction={() => setShowNewTransactionModal(true)} />

      {/* Top Section: Categories + Summary Cards + Credit Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Categories + Summary */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          {/* Category Carousel */}
          <CategoryCarousel />

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BalanceCard value={balance} previousValue={previousBalance} />
            <IncomeCard value={income} />
            <ExpenseCard value={expenses} />
          </div>
        </div>

        {/* Right Column: Credit Cards Widget */}
        <div className="lg:col-span-5 xl:col-span-4">
          <CreditCardsWidget 
            onAddCard={() => setShowAddCardModal(true)}
            onCardClick={(id) => setSelectedCardId(id)}
          />
        </div>
      </div>

      {/* Middle Section: Flow Chart + Next Expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flow Chart */}
        <div className="lg:col-span-7 xl:col-span-8">
          <FlowChart />
        </div>

        {/* Next Expenses */}
        <div className="lg:col-span-5 xl:col-span-4">
          <NextExpensesWidget onAddExpense={() => setShowNewTransactionModal(true)} />
        </div>
      </div>

      {/* Bottom Section: Transactions Table */}
      <TransactionsTable compact />

      {/* Modals */}
      <NewTransactionModal 
        isOpen={showNewTransactionModal} 
        onClose={() => setShowNewTransactionModal(false)} 
      />
      
      <AddCardModal 
        isOpen={showAddCardModal} 
        onClose={() => setShowAddCardModal(false)} 
      />
      
      <CardDetailsModal 
        isOpen={!!selectedCardId} 
        cardId={selectedCardId}
        onClose={() => setSelectedCardId(null)} 
      />
    </div>
  )
}
