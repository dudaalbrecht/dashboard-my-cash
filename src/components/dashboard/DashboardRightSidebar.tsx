import CreditCardsWidget from './CreditCardsWidget'
import NextExpensesWidget from './NextExpensesWidget'

interface DashboardRightSidebarProps {
    onAddCard: () => void
    onAddExpense: () => void
    onCardClick: (id: string) => void
}

export default function DashboardRightSidebar({
    onAddCard,
    onAddExpense,
    onCardClick
}: DashboardRightSidebarProps) {
    return (
        <div className="flex flex-col gap-6">
            <CreditCardsWidget
                onAddCard={onAddCard}
                onCardClick={onCardClick}
            />
            <NextExpensesWidget
                onAddExpense={onAddExpense}
            />
        </div>
    )
}
