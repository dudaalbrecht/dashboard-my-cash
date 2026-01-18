import { useState, useEffect } from 'react'
import { useFinance } from '../../contexts/FinanceContext'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
}

const ROLE_SUGGESTIONS = ['Pai', 'Mãe', 'Filho', 'Filha', 'Avô', 'Avó', 'Tio', 'Tia']

export default function AddMemberModal({ isOpen, onClose }: AddMemberModalProps) {
  const { addFamilyMember } = useFinance()

  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [monthlyIncome, setMonthlyIncome] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setName('')
      setRole('')
      setAvatarUrl('')
      setMonthlyIncome('')
      setErrors({})
    }
  }, [isOpen])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name || name.trim().length < 3) {
      newErrors.name = 'Por favor, insira um nome válido'
    }

    if (!role || role.trim().length < 2) {
      newErrors.role = 'Por favor, informe a função na família'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`

    addFamilyMember({
      name: name.trim(),
      role: role.trim(),
      avatarUrl: avatarUrl.trim() || defaultAvatar,
      monthlyIncome: monthlyIncome ? parseFloat(monthlyIncome.replace(/\D/g, '')) / 100 : 0,
    })

    onClose()
  }

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setMonthlyIncome(value)
  }

  const formatIncome = (value: string) => {
    if (!value) return ''
    const numValue = parseInt(value) / 100
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-50 bg-neutral-1100/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="
        fixed inset-x-4 top-1/2 -translate-y-1/2 z-50
        max-w-lg mx-auto
        bg-surface-500 rounded-shape-20 shadow-elevated
        animate-fade-in
      ">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-300">
          <h2 className="text-heading-x-small font-bold text-neutral-1100">
            Adicionar Membro da Família
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-300"
          >
            <svg className="w-5 h-5 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-label-small text-neutral-1100 mb-2">
              Nome Completo *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: João Silva"
              className={`input ${errors.name ? 'border-red-600' : ''}`}
            />
            {errors.name && (
              <p className="text-paragraph-x-small text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-label-small text-neutral-1100 mb-2">
              Função na Família *
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Ex: Pai, Mãe, Filho..."
              list="role-suggestions"
              className={`input ${errors.role ? 'border-red-600' : ''}`}
            />
            <datalist id="role-suggestions">
              {ROLE_SUGGESTIONS.map(r => (
                <option key={r} value={r} />
              ))}
            </datalist>
            {errors.role && (
              <p className="text-paragraph-x-small text-red-600 mt-1">{errors.role}</p>
            )}
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-label-small text-neutral-1100 mb-2">
              URL do Avatar (opcional)
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
              className="input"
            />
            <p className="text-paragraph-x-small text-neutral-500 mt-1">
              Deixe em branco para usar avatar padrão
            </p>
          </div>

          {/* Monthly Income */}
          <div>
            <label className="block text-label-small text-neutral-1100 mb-2">
              Renda Mensal Estimada (opcional)
            </label>
            <input
              type="text"
              value={formatIncome(monthlyIncome)}
              onChange={handleIncomeChange}
              placeholder="R$ 0,00"
              className="input"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-300">
          <button onClick={onClose} className="btn btn-ghost">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            Adicionar Membro
          </button>
        </div>
      </div>
    </>
  )
}
