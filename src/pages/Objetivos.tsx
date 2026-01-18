import { useFinance } from '../contexts/FinanceContext'

export default function Objetivos() {
  const { goals, getMemberById } = useFinance()

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Sem prazo'
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(new Date(date))
  }

  const getProgress = (current: number, target: number) => {
    return Math.round((current / target) * 100)
  }

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-heading-small text-neutral-1100">Objetivos</h1>
        <button className="btn btn-primary">
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7H9V1C9 0.4 8.6 0 8 0Z"/>
          </svg>
          Novo Objetivo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {goals.map(goal => {
          const member = goal.memberId ? getMemberById(goal.memberId) : null
          const progress = getProgress(goal.currentAmount, goal.targetAmount)
          
          return (
            <div 
              key={goal.id} 
              className="card cursor-pointer hover:-translate-y-1 hover:shadow-elevated transition-all duration-200"
            >
              {/* Icon */}
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: `${goal.color}20` }}
              >
                <svg 
                  className="w-6 h-6" 
                  viewBox="0 0 24 24" 
                  fill={goal.color}
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z"/>
                </svg>
              </div>

              {/* Info */}
              <h3 className="text-label-medium text-neutral-1100 mb-1">{goal.name}</h3>
              {goal.description && (
                <p className="text-paragraph-x-small text-neutral-500 mb-4">{goal.description}</p>
              )}

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-paragraph-x-small">
                  <span className="text-neutral-500">Progresso</span>
                  <span className="text-neutral-1100 font-semibold">{progress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-300 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: goal.color,
                    }}
                  />
                </div>
                <div className="flex justify-between text-paragraph-x-small text-neutral-500">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span>{formatCurrency(goal.targetAmount)}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-neutral-300 flex justify-between items-center">
                <span className="text-paragraph-x-small text-neutral-500">
                  {formatDate(goal.deadline)}
                </span>
                {member && (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-6 h-6 rounded-full"
                    title={member.name}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
