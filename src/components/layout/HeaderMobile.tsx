import { NavLink, useLocation } from 'react-router-dom'
import { useFinance } from '../../contexts/FinanceContext'

// Icons
const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"/>
  </svg>
)

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
  </svg>
)

const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.7 6.3L8.7 0.3C8.5 0.1 8.3 0 8 0C7.7 0 7.5 0.1 7.3 0.3L1.3 6.3C1.1 6.5 1 6.7 1 7V15C1 15.6 1.4 16 2 16H6C6.6 16 7 15.6 7 15V11H9V15C9 15.6 9.4 16 10 16H14C14.6 16 15 15.6 15 15V7C15 6.7 14.9 6.5 14.7 6.3Z"/>
  </svg>
)

const CardIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H2C0.9 2 0 2.9 0 4V12C0 13.1 0.9 14 2 14H14C15.1 14 16 13.1 16 12V4C16 2.9 15.1 2 14 2ZM14 12H2V8H14V12ZM14 5H2V4H14V5Z"/>
  </svg>
)

const TransactionIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 5L12 1V4H0V6H12V9L16 5ZM4 12V9L0 13L4 17V14H16V12H4Z"/>
  </svg>
)

const GoalIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM8 14C4.7 14 2 11.3 2 8C2 4.7 4.7 2 8 2C11.3 2 14 4.7 14 8C14 11.3 11.3 14 8 14ZM8 4C5.8 4 4 5.8 4 8C4 10.2 5.8 12 8 12C10.2 12 12 10.2 12 8C12 5.8 10.2 4 8 4ZM8 10C6.9 10 6 9.1 6 8C6 6.9 6.9 6 8 6C9.1 6 10 6.9 10 8C10 9.1 9.1 10 8 10Z"/>
  </svg>
)

const ProfileIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 0C5.8 0 4 1.8 4 4C4 6.2 5.8 8 8 8C10.2 8 12 6.2 12 4C12 1.8 10.2 0 8 0ZM8 10C3.6 10 0 11.8 0 14V16H16V14C16 11.8 12.4 10 8 10Z"/>
  </svg>
)

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7ZM4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z"/>
  </svg>
)

interface HeaderMobileProps {
  isMenuOpen: boolean
  onToggleMenu: () => void
  onCloseMenu: () => void
}

export default function HeaderMobile({ isMenuOpen, onToggleMenu, onCloseMenu }: HeaderMobileProps) {
  const location = useLocation()
  const { familyMembers } = useFinance()
  const currentUser = familyMembers[0]

  const navItems = [
    { to: '/dashboard', icon: <HomeIcon className="w-5 h-5" />, label: 'Home' },
    { to: '/cartoes', icon: <CardIcon className="w-5 h-5" />, label: 'Cartões' },
    { to: '/transacoes', icon: <TransactionIcon className="w-5 h-5" />, label: 'Transações' },
    { to: '/objetivos', icon: <GoalIcon className="w-5 h-5" />, label: 'Objetivos' },
    { to: '/perfil', icon: <ProfileIcon className="w-5 h-5" />, label: 'Perfil' },
  ]

  return (
    <>
      {/* Header Bar */}
      <header className="
        fixed top-0 left-0 right-0 z-50
        h-[72px] px-4
        bg-surface-500 border-b border-neutral-300
        flex items-center justify-between
      ">
        {/* Logo */}
        <h1 className="text-heading-x-small font-bold text-neutral-1100">
          Mycash<span className="text-primary-500">+</span>
        </h1>

        {/* Avatar (triggers menu) */}
        <button
          onClick={onToggleMenu}
          className="
            w-11 h-11 rounded-full
            flex items-center justify-center
            hover:bg-neutral-300
            transition-colors duration-200
            touch-target
          "
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {isMenuOpen ? (
            <CloseIcon className="w-6 h-6 text-neutral-1100" />
          ) : currentUser?.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-neutral-300"
            />
          ) : (
            <MenuIcon className="w-6 h-6 text-neutral-1100" />
          )}
        </button>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="
            fixed inset-0 z-40
            bg-neutral-1100/50
            animate-fade-in
          "
          onClick={onCloseMenu}
        />
      )}

      {/* Dropdown Menu */}
      <div
        className={`
          fixed top-[72px] left-0 right-0 z-50
          bg-surface-500 border-b border-neutral-300
          shadow-elevated
          transform transition-all duration-300 ease-in-out
          ${isMenuOpen 
            ? 'translate-y-0 opacity-100 visible' 
            : '-translate-y-4 opacity-0 invisible'
          }
        `}
      >
        {/* User Info */}
        <div className="px-4 py-4 border-b border-neutral-300">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatarUrl}
              alt={currentUser?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="text-label-medium text-neutral-1100">
                {currentUser?.name}
              </p>
              <p className="text-paragraph-small text-neutral-500">
                {currentUser?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-2">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMenu}
              className={`
                flex items-center gap-3
                px-4 py-3
                transition-colors duration-200
                ${location.pathname === item.to
                  ? 'bg-neutral-1100 text-neutral-0'
                  : 'text-neutral-1100 hover:bg-neutral-300'
                }
              `}
            >
              {item.icon}
              <span className="text-label-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-neutral-300">
          <button
            onClick={() => {
              onCloseMenu()
              // TODO: Implement logout
            }}
            className="
              flex items-center gap-3 w-full
              px-4 py-3 rounded-shape-20
              bg-red-600 text-neutral-0
              hover:opacity-90
              transition-opacity duration-200
              touch-target
            "
          >
            <LogoutIcon className="w-5 h-5" />
            <span className="text-label-medium">Sair</span>
          </button>
        </div>
      </div>
    </>
  )
}
