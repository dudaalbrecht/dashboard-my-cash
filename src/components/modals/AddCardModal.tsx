import { useState, useEffect } from 'react'
import { useFinance } from '../../contexts/FinanceContext'
import { CardTheme } from '../../types'

interface AddCardModalProps {
  isOpen: boolean
  onClose: () => void
}

type AccountType = 'account' | 'card'

export default function AddCardModal({ isOpen, onClose }: AddCardModalProps) {
  const { addBankAccount, addCreditCard, familyMembers } = useFinance()

  const [accountType, setAccountType] = useState<AccountType>('account')
  const [name, setName] = useState('')
  const [holderId, setHolderId] = useState('')
  
  // Bank account fields
  const [balance, setBalance] = useState('')
  
  // Credit card fields
  const [closingDay, setClosingDay] = useState('')
  const [dueDay, setDueDay] = useState('')
  const [limit, setLimit] = useState('')
  const [lastDigits, setLastDigits] = useState('')
  const [theme, setTheme] = useState<CardTheme>('black')
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setAccountType('account')
      setName('')
      setHolderId('')
      setBalance('')
      setClosingDay('')
      setDueDay('')
      setLimit('')
      setLastDigits('')
      setTheme('black')
      setErrors({})
    }
  }, [isOpen])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name || name.trim().length < 3) {
      newErrors.name = 'Nome deve ter pelo menos 3 caracteres'
    }

    if (!holderId) {
      newErrors.holderId = 'Selecione um titular'
    }

    if (accountType === 'account') {
      if (!balance) {
        newErrors.balance = 'Informe o saldo inicial'
      }
    } else {
      const closingNum = parseInt(closingDay)
      if (!closingDay || closingNum < 1 || closingNum > 31) {
        newErrors.closingDay = 'Dia deve ser entre 1 e 31'
      }
      
      const dueNum = parseInt(dueDay)
      if (!dueDay || dueNum < 1 || dueNum > 31) {
        newErrors.dueDay = 'Dia deve ser entre 1 e 31'
      }
      
      if (!limit || parseFloat(limit.replace(/\D/g, '')) <= 0) {
        newErrors.limit = 'Limite deve ser maior que zero'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    if (accountType === 'account') {
      addBankAccount({
        name: name.trim(),
        holderId,
        balance: parseFloat(balance.replace(/\D/g, '')) / 100,
      })
    } else {
      addCreditCard({
        name: name.trim(),
        holderId,
        closingDay: parseInt(closingDay),
        dueDay: parseInt(dueDay),
        limit: parseFloat(limit.replace(/\D/g, '')) / 100,
        currentBill: 0,
        theme,
        lastDigits: lastDigits || undefined,
      })
    }

    onClose()
  }

  const formatCurrency = (value: string) => {
    if (!value) return ''
    const numValue = parseInt(value.replace(/\D/g, '')) / 100
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue)
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-neutral-1100/50" onClick={onClose} />
      
      <div className="
        fixed inset-x-4 top-1/2 -translate-y-1/2 z-50
        max-w-lg mx-auto max-h-[90vh] overflow-y-auto
        bg-surface-500 rounded-shape-20 shadow-elevated
        animate-fade-in
      ">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-300 sticky top-0 bg-surface-500">
          <h2 className="text-heading-x-small font-bold text-neutral-1100">
            Adicionar Conta/Cartão
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
          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setAccountType('account')}
              className={`
                flex-1 py-3 rounded-shape-20 text-label-medium
                transition-all duration-200
                ${accountType === 'account' 
                  ? 'bg-neutral-1100 text-neutral-0' 
                  : 'bg-neutral-0 border border-neutral-300 text-neutral-500'
                }
              `}
            >
              Conta Bancária
            </button>
            <button
              onClick={() => setAccountType('card')}
              className={`
                flex-1 py-3 rounded-shape-20 text-label-medium
                transition-all duration-200
                ${accountType === 'card' 
                  ? 'bg-neutral-1100 text-neutral-0' 
                  : 'bg-neutral-0 border border-neutral-300 text-neutral-500'
                }
              `}
            >
              Cartão de Crédito
            </button>
          </div>

          {/* Name */}
          <div>
            <label className="block text-label-small text-neutral-1100 mb-2">
              {accountType === 'account' ? 'Nome da Conta' : 'Nome do Cartão'} *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={accountType === 'account' ? 'Ex: Nubank Conta' : 'Ex: Nubank Mastercard'}
              className={`input ${errors.name ? 'border-red-600' : ''}`}
            />
            {errors.name && (
              <p className="text-paragraph-x-small text-red-600 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Holder */}
          <div>
            <label className="block text-label-small text-neutral-1100 mb-2">
              Titular *
            </label>
            <select
              value={holderId}
              onChange={(e) => setHolderId(e.target.value)}
              className={`input ${errors.holderId ? 'border-red-600' : ''}`}
            >
              <option value="">Selecione o titular</option>
              {familyMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            {errors.holderId && (
              <p className="text-paragraph-x-small text-red-600 mt-1">{errors.holderId}</p>
            )}
          </div>

          {/* Bank Account Fields */}
          {accountType === 'account' && (
            <div>
              <label className="block text-label-small text-neutral-1100 mb-2">
                Saldo Inicial *
              </label>
              <input
                type="text"
                value={formatCurrency(balance)}
                onChange={(e) => setBalance(e.target.value.replace(/\D/g, ''))}
                placeholder="R$ 0,00"
                className={`input ${errors.balance ? 'border-red-600' : ''}`}
              />
              {errors.balance && (
                <p className="text-paragraph-x-small text-red-600 mt-1">{errors.balance}</p>
              )}
            </div>
          )}

          {/* Credit Card Fields */}
          {accountType === 'card' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-small text-neutral-1100 mb-2">
                    Dia de Fechamento *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={closingDay}
                    onChange={(e) => setClosingDay(e.target.value)}
                    placeholder="1 a 31"
                    className={`input ${errors.closingDay ? 'border-red-600' : ''}`}
                  />
                  {errors.closingDay && (
                    <p className="text-paragraph-x-small text-red-600 mt-1">{errors.closingDay}</p>
                  )}
                </div>
                <div>
                  <label className="block text-label-small text-neutral-1100 mb-2">
                    Dia de Vencimento *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    placeholder="1 a 31"
                    className={`input ${errors.dueDay ? 'border-red-600' : ''}`}
                  />
                  {errors.dueDay && (
                    <p className="text-paragraph-x-small text-red-600 mt-1">{errors.dueDay}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-label-small text-neutral-1100 mb-2">
                  Limite Total *
                </label>
                <input
                  type="text"
                  value={formatCurrency(limit)}
                  onChange={(e) => setLimit(e.target.value.replace(/\D/g, ''))}
                  placeholder="R$ 0,00"
                  className={`input ${errors.limit ? 'border-red-600' : ''}`}
                />
                {errors.limit && (
                  <p className="text-paragraph-x-small text-red-600 mt-1">{errors.limit}</p>
                )}
              </div>

              <div>
                <label className="block text-label-small text-neutral-1100 mb-2">
                  Últimos 4 Dígitos (opcional)
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={lastDigits}
                  onChange={(e) => setLastDigits(e.target.value.replace(/\D/g, ''))}
                  placeholder="0000"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-label-small text-neutral-1100 mb-2">
                  Tema Visual *
                </label>
                <div className="flex gap-3">
                  {(['black', 'lime', 'white'] as CardTheme[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`
                        flex-1 h-16 rounded-shape-20
                        transition-all duration-200
                        ${t === 'black' ? 'bg-neutral-1100' : ''}
                        ${t === 'lime' ? 'bg-primary-500' : ''}
                        ${t === 'white' ? 'bg-neutral-0 border border-neutral-300' : ''}
                        ${theme === t ? 'ring-2 ring-blue-600 ring-offset-2' : ''}
                      `}
                    >
                      <span className={`
                        text-label-x-small
                        ${t === 'black' ? 'text-neutral-0' : 'text-neutral-1100'}
                      `}>
                        {t === 'black' ? 'Black' : t === 'lime' ? 'Lime' : 'White'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-300 sticky bottom-0 bg-surface-500">
          <button onClick={onClose} className="btn btn-ghost">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="btn btn-primary">
            Adicionar
          </button>
        </div>
      </div>
    </>
  )
}
