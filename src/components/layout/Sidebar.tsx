import { NavLink, useLocation } from 'react-router-dom'
import { useFinance } from '../../contexts/FinanceContext'

// Icons as SVG components
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

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.3 1.3L9 0L2 7L9 14L10.3 12.7L4.6 7L10.3 1.3Z"/>
  </svg>
)

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.7 1.3L7 0L14 7L7 14L5.7 12.7L11.4 7L5.7 1.3Z"/>
  </svg>
)

interface NavItemProps {
  to: string
  icon: React.ReactNode
  label: string
  isExpanded: boolean
  isActive: boolean
}

function NavItem({ to, icon, label, isExpanded, isActive }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={`
        group relative flex items-center gap-space-8 w-full
        px-space-16 py-space-12 rounded-shape-100
        transition-all duration-200 ease-in-out
        ${isActive 
          ? 'bg-primary-500 text-neutral-1100' 
          : 'text-neutral-1100 hover:bg-neutral-300'
        }
      `}
      title={!isExpanded ? label : undefined}
    >
      <span className="w-4 h-4 flex-shrink-0">
        {icon}
      </span>
      {isExpanded && (
        <span className="text-label-large whitespace-nowrap">
          {label}
        </span>
      )}
      
      {/* Tooltip for collapsed state */}
      {!isExpanded && (
        <div className="
          absolute left-full ml-2 px-3 py-2
          bg-neutral-1100 text-neutral-0 text-paragraph-small
          rounded-shape-20 whitespace-nowrap
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-all duration-200 delay-300
          z-50 shadow-elevated
        ">
          {label}
        </div>
      )}
    </NavLink>
  )
}

interface SidebarProps {
  isExpanded: boolean
  onToggle: () => void
}

export default function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const location = useLocation()
  const { familyMembers } = useFinance()
  const currentUser = familyMembers[0] // Primeiro membro é o usuário principal

  const navItems = [
    { to: '/dashboard', icon: <HomeIcon className="w-full h-full" />, label: 'Home' },
    { to: '/cartoes', icon: <CardIcon className="w-full h-full" />, label: 'Cartões' },
  ]

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen
        bg-surface-500 border-r border-neutral-300
        flex flex-col justify-between
        p-space-32
        transition-all duration-300 ease-in-out
        z-40
      `}
      style={{
        width: isExpanded 
          ? 'var(--sidebar-width-expanded)' 
          : 'var(--sidebar-width-collapsed)',
      }}
    >
      {/* Top Section: Logo + Navigation */}
      <div className="flex flex-col gap-space-56">
        {/* Logo */}
        <div className="flex items-center gap-2 overflow-hidden">
          {isExpanded ? (
            <h1 className="text-heading-x-small font-bold text-neutral-1100 whitespace-nowrap">
              Mycash<span className="text-primary-500">+</span>
            </h1>
          ) : (
            <span className="text-heading-x-small font-bold text-primary-500">M+</span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-space-8">
          {navItems.map(item => (
            <NavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isExpanded={isExpanded}
              isActive={location.pathname === item.to}
            />
          ))}
        </nav>
      </div>

      {/* Bottom Section: User Info */}
      <div className="flex flex-col gap-space-12">
        {/* Avatar */}
        <img
          src={currentUser?.avatarUrl}
          alt={currentUser?.name}
          className="w-6 h-6 rounded-full object-cover"
        />
        
        {/* User Details (only when expanded) */}
        {isExpanded && currentUser && (
          <div className="flex flex-col gap-1 overflow-hidden">
            <p className="text-label-medium text-neutral-1100 truncate">
              {currentUser.name}
            </p>
            <p className="text-paragraph-small text-neutral-1100 truncate">
              {currentUser.email}
            </p>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="
          absolute top-8 -right-3
          w-6 h-6 rounded-full
          bg-surface-500 border border-neutral-300
          shadow-card
          flex items-center justify-center
          hover:bg-neutral-300
          transition-colors duration-200
          z-50
        "
        aria-label={isExpanded ? 'Recolher sidebar' : 'Expandir sidebar'}
      >
        {isExpanded ? (
          <ChevronLeftIcon className="w-3 h-3 text-neutral-1100" />
        ) : (
          <ChevronRightIcon className="w-3 h-3 text-neutral-1100" />
        )}
      </button>
    </aside>
  )
}
