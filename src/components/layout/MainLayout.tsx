import { ReactNode, useState } from 'react'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import Sidebar from './Sidebar'
import HeaderMobile from './HeaderMobile'

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const isDesktop = useIsDesktop()
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleSidebar = () => setSidebarExpanded(prev => !prev)
  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="min-h-screen w-full bg-background-400">
      {/* Desktop: Sidebar */}
      {isDesktop && (
        <Sidebar 
          isExpanded={sidebarExpanded} 
          onToggle={toggleSidebar} 
        />
      )}

      {/* Mobile/Tablet: Header */}
      {!isDesktop && (
        <HeaderMobile 
          isMenuOpen={mobileMenuOpen}
          onToggleMenu={toggleMobileMenu}
          onCloseMenu={closeMobileMenu}
        />
      )}

      {/* Main Content */}
      <main
        className="w-full min-h-screen transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isDesktop 
            ? sidebarExpanded 
              ? 'var(--sidebar-width-expanded)' 
              : 'var(--sidebar-width-collapsed)'
            : 0,
          paddingTop: !isDesktop ? '72px' : 0,
        }}
      >
        <div className="w-full h-full px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-8">
          <div className="w-full max-w-container-desktop lg:max-w-container-wide mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
