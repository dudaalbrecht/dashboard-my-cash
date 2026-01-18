import { useState, useCallback } from 'react'

interface UseSidebarReturn {
  isExpanded: boolean
  toggle: () => void
  expand: () => void
  collapse: () => void
}

/**
 * Hook para gerenciar estado da sidebar
 */
export function useSidebar(initialExpanded = true): UseSidebarReturn {
  const [isExpanded, setIsExpanded] = useState(initialExpanded)

  const toggle = useCallback(() => {
    setIsExpanded(prev => !prev)
  }, [])

  const expand = useCallback(() => {
    setIsExpanded(true)
  }, [])

  const collapse = useCallback(() => {
    setIsExpanded(false)
  }, [])

  return {
    isExpanded,
    toggle,
    expand,
    collapse,
  }
}
