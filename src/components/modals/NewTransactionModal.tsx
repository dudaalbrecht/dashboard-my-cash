import { useState, useEffect } from 'react'
import { useFinance } from '../../contexts/FinanceContext'
import { TransactionType } from '../../types'

interface NewTransactionModalProps {
  isOpen: boolean
  onClose: () => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function NewTransactionModal({ isOpen, onClose }: NewTransactionModalProps) {
  const { 
    addTransaction, 
    categories, 
    familyMembers, 
    bankAccounts, 
    creditCards,
    addCategory,
  } = useFinance()

  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [memberId, setMemberId] = useState<string | null>(null)
  const [accountId, setAccountId] = useState('')
  const [installments, setInstallments] = useState(1)
  const [isRecurring, setIsRecurring] = useState(false)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Filter categories by type
  const filteredCategories = categories.filter(c => c.type === type)
  
  // Check if selected account is a credit card
  const isCardSelected = creditCards.some(c => c.id === accountId)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setType('expense')
      setAmount('')
      setDescription('')
      setCategoryId('')
      setMemberId(null)
      setAccountId('')
      setInstallments(1)
      setIsRecurring(false)
      setErrors({})
    }
  }, [isOpen])

  // Reset installments when recurring is toggled
  useEffect(() => {
    if (isRecurring) {
      setInstallments(1)
    }
  }, [isRecurring])

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    const numValue = parseInt(value) / 100
    setAmount(numValue > 0 ? numValue.toString() : '')
  }

  const handleAddCategory = () => {
    if (newCategoryName.trim().length >= 3) {
      addCategory({
        name: newCategoryName.trim(),
        type,
      })
      setNewCategoryName('')
      setShowNewCategory(false)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Valor deve ser maior que zero'
    }

    if (!description || description.trim().length < 3) {
      newErrors.description = 'Descrição deve ter pelo menos 3 caracteres'
    }

    if (!categoryId) {
      newErrors.categoryId = 'Selecione uma categoria'
    }

    if (!accountId) {
      newErrors.accountId = 'Selecione uma conta ou cartão'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    addTransaction({
      type,
      amount: parseFloat(amount),
      description: description.trim(),
      categoryId,
      accountId,
      memberId,
      date: new Date(),
      installments,
      status: 'completed',
      isRecurring,
      isPaid: type === 'income',
    })

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface-500">
      {/* Header */}
      <header className="
        flex items-center justify-between
        px-6 py-4 border-b border-neutral-300
        bg-surface-500
      ">
        <div className="flex items-center gap-4">
          <div className={`
            w-16 h-16 rounded-full
            flex items-center justify-center
            ${type === 'income' ? 'bg-primary-500' : 'bg-neutral-1100'}
          `}>
            <svg 
              className={`w-8 h-8 ${type === 'income' ? 'text-neutral-1100 rotate-180' : 'text-neutral-0'}`} 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M4 12L5.41 13.41L11 7.83V20H13V7.83L18.59 13.41L20 12L12 4L4 12Z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-heading-small font-bold text-neutral-1100">
              Nova Transação
            </h2>
            <p className="text-paragraph-small text-neutral-500">
              {type === 'income' ? 'Registrar nova receita' : 'Registrar nova despesa'}
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="
            w-12 h-12 rounded-full
            flex items-center justify-center
            hover:bg-neutral-300
            transition-colors
          "
        >
          <svg className="w-6 h-6 text-neutral-1100" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
          </svg>
        </button>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto bg-background-400">
        <div className="max-w-2xl mx-auto px-6 py-8">
          {/* Type Toggle */}
          <div className="bg-neutral-300/50 rounded-shape-20 p-1 flex mb-6">
            <button
              onClick={() => setType('income')}
              className={`
                flex-1 py-3 rounded-shape-20 text-label-medium
                transition-all duration-200
                ${type === 'income' 
                  ? 'bg-surface-500 shadow-sm text-neutral-1100' 
                  : 'text-neutral-500'
                }
              `}
            >
              Receita
            </button>
            <button
              onClick={() => setType('expense')}
              className={`
                flex-1 py-3 rounded-shape-20 text-label-medium
                transition-all duration-200
                ${type === 'expense' 
                  ? 'bg-surface-500 shadow-sm text-neutral-1100' 
                  : 'text-neutral-500'
                }
              `}
            >
              Despesa
            </button>
          </div>

          {/* Amount */}
          <div className="mb-6">
            <label className="block text-label-small text-neutral-1100 mb-2">
              Valor da Transação *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                R$
              </span>
              <input
                type="text"
                value={amount ? formatCurrency(parseFloat(amount)).replace('R$', '').trim() : ''}
                onChange={handleAmountChange}
                placeholder="0,00"
                className={`
                  input pl-12 h-14 text-lg
                  ${errors.amount ? 'border-red-600' : ''}
                `}
              />
            </div>
            {errors.amount && (
              <p className="text-paragraph-x-small text-red-600 mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-label-small text-neutral-1100 mb-2">
              Descrição *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Supermercado Semanal"
              className={`
                input h-14
                ${errors.description ? 'border-red-600' : ''}
              `}
            />
            {errors.description && (
              <p className="text-paragraph-x-small text-red-600 mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-label-small text-neutral-1100 mb-2">
              Categoria *
            </label>
            {!showNewCategory ? (
              <>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={`
                    input h-14
                    ${errors.categoryId ? 'border-red-600' : ''}
                  `}
                >
                  <option value="">Selecione uma categoria</option>
                  {filteredCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowNewCategory(true)}
                  className="text-paragraph-small text-blue-600 mt-2 hover:underline"
                >
                  + Nova Categoria
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Nome da categoria"
                  className="input h-14 flex-1"
                />
                <button
                  onClick={handleAddCategory}
                  className="btn btn-primary h-14"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => {
                    setShowNewCategory(false)
                    setNewCategoryName('')
                  }}
                  className="btn btn-ghost h-14"
                >
                  Cancelar
                </button>
              </div>
            )}
            {errors.categoryId && (
              <p className="text-paragraph-x-small text-red-600 mt-1">{errors.categoryId}</p>
            )}
          </div>

          {/* Member and Account */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Member */}
            <div>
              <label className="block text-label-small text-neutral-1100 mb-2">
                Membro
              </label>
              <select
                value={memberId || ''}
                onChange={(e) => setMemberId(e.target.value || null)}
                className="input h-14"
              >
                <option value="">Família (Geral)</option>
                {familyMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>

            {/* Account */}
            <div>
              <label className="block text-label-small text-neutral-1100 mb-2">
                Conta / Cartão *
              </label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className={`
                  input h-14
                  ${errors.accountId ? 'border-red-600' : ''}
                `}
              >
                <option value="">Selecione</option>
                <optgroup label="Contas Bancárias">
                  {bankAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </optgroup>
                <optgroup label="Cartões de Crédito">
                  {creditCards.map(card => (
                    <option key={card.id} value={card.id}>{card.name}</option>
                  ))}
                </optgroup>
              </select>
              {errors.accountId && (
                <p className="text-paragraph-x-small text-red-600 mt-1">{errors.accountId}</p>
              )}
            </div>
          </div>

          {/* Installments (only for credit card expenses) */}
          {isCardSelected && type === 'expense' && !isRecurring && (
            <div className="mb-6">
              <label className="block text-label-small text-neutral-1100 mb-2">
                Parcelamento
              </label>
              <select
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value))}
                className="input h-14"
              >
                <option value={1}>À vista (1x)</option>
                {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                  <option key={n} value={n}>{n}x</option>
                ))}
              </select>
            </div>
          )}

          {/* Recurring (only for expenses) */}
          {type === 'expense' && (
            <div className={`
              p-4 rounded-shape-20 mb-6
              ${installments > 1 ? 'bg-neutral-300/50' : 'bg-blue-600/10 border border-blue-600/20'}
            `}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  disabled={installments > 1}
                  className="w-5 h-5 mt-0.5 rounded"
                />
                <div>
                  <p className={`text-label-small ${installments > 1 ? 'text-neutral-500' : 'text-neutral-1100'}`}>
                    Despesa Recorrente
                  </p>
                  <p className="text-paragraph-x-small text-neutral-500">
                    {installments > 1 
                      ? 'Não disponível para compras parceladas'
                      : 'Esta despesa se repete mensalmente'
                    }
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="
        flex items-center justify-end gap-4
        px-6 py-4 border-t border-neutral-300
        bg-surface-500
      ">
        <button
          onClick={onClose}
          className="btn btn-ghost"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="btn btn-primary px-8"
        >
          Salvar Transação
        </button>
      </footer>
    </div>
  )
}
