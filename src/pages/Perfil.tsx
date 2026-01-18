import { useState } from 'react'
import { useFinance } from '../contexts/FinanceContext'
import AddMemberModal from '../components/modals/AddMemberModal'

type TabType = 'info' | 'settings'

function formatCurrency(value: number | undefined): string {
  if (!value) return 'Não informado'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function Perfil() {
  const [activeTab, setActiveTab] = useState<TabType>('info')
  const [showAddMemberModal, setShowAddMemberModal] = useState(false)
  const { familyMembers, categories } = useFinance()
  const currentUser = familyMembers[0]

  // Settings state
  const [notifications, setNotifications] = useState({
    dueReminder: true,
    limitAlert: true,
    monthlyReport: false,
    goalAchieved: true,
  })

  const incomeCategories = categories.filter(c => c.type === 'income')
  const expenseCategories = categories.filter(c => c.type === 'expense')

  return (
    <div className="w-full flex flex-col gap-6">
      <h1 className="text-heading-small text-neutral-1100">Perfil</h1>

      {/* Tabs */}
      <div className="flex border-b border-neutral-300">
        <button
          onClick={() => setActiveTab('info')}
          className={`
            px-6 py-3 text-label-medium transition-colors
            ${activeTab === 'info' 
              ? 'text-neutral-1100 border-b-2 border-neutral-1100' 
              : 'text-neutral-500 hover:text-neutral-1100'
            }
          `}
        >
          Informações
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`
            px-6 py-3 text-label-medium transition-colors
            ${activeTab === 'settings' 
              ? 'text-neutral-1100 border-b-2 border-neutral-1100' 
              : 'text-neutral-500 hover:text-neutral-1100'
            }
          `}
        >
          Configurações
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="flex flex-col gap-6">
          {/* User Profile Card */}
          <div className="card">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <img
                src={currentUser?.avatarUrl}
                alt={currentUser?.name}
                className="w-28 h-28 rounded-full object-cover"
              />
              <div className="flex flex-col items-center md:items-start gap-2 flex-1">
                <h2 className="text-heading-x-small text-neutral-1100">{currentUser?.name}</h2>
                <p className="text-paragraph-small text-neutral-500">{currentUser?.role}</p>
                <div className="flex items-center gap-2 text-paragraph-small text-neutral-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z"/>
                  </svg>
                  {currentUser?.email}
                </div>
                <div className="flex items-center gap-2 text-paragraph-small text-neutral-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.52 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.48 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.49 11.8 10.9Z"/>
                  </svg>
                  Renda mensal: {formatCurrency(currentUser?.monthlyIncome)}
                </div>
              </div>
              <button className="btn btn-ghost">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z"/>
                </svg>
                Editar
              </button>
            </div>
          </div>

          {/* Family Members */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-label-large text-neutral-1100">Membros da Família</h3>
              <button 
                onClick={() => setShowAddMemberModal(true)}
                className="btn btn-ghost text-paragraph-small"
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C7.4 0 7 0.4 7 1V7H1C0.4 7 0 7.4 0 8C0 8.6 0.4 9 1 9H7V15C7 15.6 7.4 16 8 16C8.6 16 9 15.6 9 15V9H15C15.6 9 16 8.6 16 8C16 7.4 15.6 7 15 7H9V1C9 0.4 8.6 0 8 0Z"/>
                </svg>
                Adicionar
              </button>
            </div>
            
            {familyMembers.length === 1 ? (
              <div className="text-center py-8 border-2 border-dashed border-neutral-300 rounded-shape-20">
                <p className="text-paragraph-small text-neutral-500 mb-4">
                  Adicione outros membros da família para gerenciar as finanças juntos
                </p>
                <button 
                  onClick={() => setShowAddMemberModal(true)}
                  className="btn btn-primary"
                >
                  Adicionar Membro
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {familyMembers.map(member => (
                  <div 
                    key={member.id}
                    className="flex items-center justify-between p-3 rounded-shape-20 bg-background-400 hover:bg-neutral-300 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-label-small text-neutral-1100">{member.name}</p>
                        <p className="text-paragraph-x-small text-neutral-500">{member.role}</p>
                      </div>
                    </div>
                    <p className="text-paragraph-small text-neutral-500">
                      {formatCurrency(member.monthlyIncome)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <button className="btn w-full bg-red-600 text-neutral-0 hover:opacity-90">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"/>
            </svg>
            Sair
          </button>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="flex flex-col gap-6">
          {/* Display Preferences */}
          <div className="card">
            <h3 className="text-label-large text-neutral-1100 mb-4">Preferências de Exibição</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label-small text-neutral-1100">Modo Escuro</p>
                  <p className="text-paragraph-x-small text-neutral-500">Em breve</p>
                </div>
                <div className="w-12 h-6 bg-neutral-300 rounded-full opacity-50 cursor-not-allowed" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-label-small text-neutral-1100">Moeda</p>
                <p className="text-paragraph-small text-neutral-500">Real Brasileiro (R$)</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-label-small text-neutral-1100">Formato de Data</p>
                <p className="text-paragraph-small text-neutral-500">DD/MM/AAAA</p>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <h3 className="text-label-large text-neutral-1100 mb-4">Notificações</h3>
            <div className="space-y-4">
              {[
                { key: 'dueReminder', label: 'Lembrete de vencimento de contas' },
                { key: 'limitAlert', label: 'Alerta de aproximação do limite' },
                { key: 'monthlyReport', label: 'Resumo mensal por email' },
                { key: 'goalAchieved', label: 'Objetivos alcançados' },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <p className="text-label-small text-neutral-1100">{item.label}</p>
                  <button
                    onClick={() => setNotifications(prev => ({ 
                      ...prev, 
                      [item.key]: !prev[item.key as keyof typeof prev] 
                    }))}
                    className={`
                      w-12 h-6 rounded-full cursor-pointer transition-colors
                      ${notifications[item.key as keyof typeof notifications] ? 'bg-primary-500' : 'bg-neutral-300'}
                    `}
                  >
                    <div 
                      className={`
                        w-5 h-5 bg-neutral-0 rounded-full shadow-sm
                        transform transition-transform mt-0.5
                        ${notifications[item.key as keyof typeof notifications] ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}
                      `}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="card">
            <h3 className="text-label-large text-neutral-1100 mb-4">Gerenciar Categorias</h3>
            
            <div className="mb-6">
              <h4 className="text-label-small text-neutral-500 mb-3">Categorias de Receita</h4>
              <div className="flex flex-wrap gap-2">
                {incomeCategories.map(cat => (
                  <span 
                    key={cat.id}
                    className="px-3 py-1 rounded-shape-100 bg-green-600/10 text-green-600 text-paragraph-small"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-label-small text-neutral-500 mb-3">Categorias de Despesa</h4>
              <div className="flex flex-wrap gap-2">
                {expenseCategories.map(cat => (
                  <span 
                    key={cat.id}
                    className="px-3 py-1 rounded-shape-100 bg-red-600/10 text-red-600 text-paragraph-small"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="card">
            <h3 className="text-label-large text-neutral-1100 mb-4">Dados e Privacidade</h3>
            <div className="space-y-3">
              <button className="btn btn-ghost w-full justify-start">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 9H15V3H9V9H5L12 16L19 9ZM5 18V20H19V18H5Z"/>
                </svg>
                Exportar Todos os Dados
              </button>
              <button className="btn w-full justify-start bg-red-600/10 text-red-600 hover:bg-red-600/20">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z"/>
                </svg>
                Limpar Todos os Dados
              </button>
              <p className="text-paragraph-x-small text-neutral-500">
                Esta ação não pode ser desfeita
              </p>
            </div>
          </div>

          {/* About */}
          <div className="card">
            <h3 className="text-label-large text-neutral-1100 mb-4">Sobre o mycash+</h3>
            <div className="space-y-2">
              <p className="text-paragraph-small text-neutral-500">Versão: 1.0.0</p>
              <p className="text-paragraph-small text-neutral-500">
                Sistema de gestão financeira familiar
              </p>
              <div className="flex gap-4 mt-4">
                <a href="#" className="text-paragraph-small text-blue-600 hover:underline">
                  Termos de Uso
                </a>
                <a href="#" className="text-paragraph-small text-blue-600 hover:underline">
                  Política de Privacidade
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <AddMemberModal 
        isOpen={showAddMemberModal} 
        onClose={() => setShowAddMemberModal(false)} 
      />
    </div>
  )
}
