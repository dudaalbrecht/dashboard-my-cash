import { useState } from 'react'
import { useFinance } from '../contexts/FinanceContext'
import BalanceCard from '../components/dashboard/BalanceCard'
import IncomeCard from '../components/dashboard/IncomeCard'
import ExpenseCard from '../components/dashboard/ExpenseCard'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import CategoryGrid from '../components/dashboard/CategoryGrid'
import FlowChart from '../components/dashboard/FlowChart'
import DashboardRightSidebar from '../components/dashboard/DashboardRightSidebar'
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
    <div className="w-full h-full">
      {/* Page Title - Hidden visually but accessible */}
      <h1 className="sr-only">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Main Content */}
        <div className="lg:col-span-8 flex flex-col gap-8">

          {/* Header */}
          <DashboardHeader onNewTransaction={() => setShowNewTransactionModal(true)} />

          {/* Categories Grid */}
          <CategoryGrid />

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BalanceCard value={balance} previousValue={previousBalance} />
            <IncomeCard value={income} />
            <ExpenseCard value={expenses} />
          </div>

          {/* Flow Chart */}
          <FlowChart />

        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 sticky top-6">
          <DashboardRightSidebar
            onAddCard={() => setShowAddCardModal(true)}
            onAddExpense={() => setShowNewTransactionModal(true)}
            onCardClick={(id) => setSelectedCardId(id)}
          />
        </div>
      </div>

      {/* Bottom Section: Transactions Table (Optional, or moved? Design seemed to show transactions in sidebar or separate? 
          Actually the design screenshot shows "Extrato detalhado" at the bottom.
          Let's keep it at the bottom but inside the left column or separate?
          The Figma screenshot shows "Extrato detalhado" taking full width at the bottom.
          So let's keep it below the grid.
      */}
      <div className="mt-8">
        <TransactionsTable compact />
      </div>

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
