import * as React from "react"
import { useBreakpoints } from './use-breakpoints'

// Legacy mobile breakpoint for backward compatibility
const MOBILE_BREAKPOINT = 768

/**
 * Legacy mobile detection hook - maintained for backward compatibility
 * @deprecated Use useBreakpoints() for enhanced responsive design
 */
export function useIsMobile() {
  const { isMobile } = useBreakpoints()
  return isMobile
}

/**
 * Enhanced mobile detection with fallback for SSR
 * Uses the new breakpoint system internally
 */
export function useIsMobileLegacy() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
