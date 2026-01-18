import { useState, useEffect } from 'react'

/**
 * Hook para detectar media queries
 * @param query - Media query string (ex: '(min-width: 1280px)')
 * @returns boolean indicando se a query corresponde
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)
    
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Set initial value
    setMatches(mediaQuery.matches)

    // Add listener
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

/**
 * Hook para detectar se está em desktop (>= 1280px)
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1280px)')
}

/**
 * Hook para detectar se está em tablet (>= 768px e < 1280px)
 */
export function useIsTablet(): boolean {
  const isMinTablet = useMediaQuery('(min-width: 768px)')
  const isMaxTablet = useMediaQuery('(max-width: 1279px)')
  return isMinTablet && isMaxTablet
}

/**
 * Hook para detectar se está em mobile (< 768px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}
