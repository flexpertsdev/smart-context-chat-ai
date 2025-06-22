import { useState, useEffect } from 'react'

// Comprehensive breakpoint system matching Tailwind CSS defaults
const BREAKPOINTS = {
  sm: 640,   // Small devices (landscape phones)
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (laptops)
  xl: 1280,  // Extra large devices (desktops)
  '2xl': 1536 // 2X Extra large devices (large desktops)
} as const

type BreakpointKey = keyof typeof BREAKPOINTS
type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'large-desktop'
type Orientation = 'portrait' | 'landscape'

interface BreakpointState {
  // Current viewport dimensions
  width: number
  height: number
  
  // Device classification
  deviceType: DeviceType
  orientation: Orientation
  
  // Breakpoint checks
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
  
  // Touch device detection
  isTouchDevice: boolean
  
  // Specific breakpoint checks
  isAbove: (breakpoint: BreakpointKey) => boolean
  isBelow: (breakpoint: BreakpointKey) => boolean
  isBetween: (min: BreakpointKey, max: BreakpointKey) => boolean
}

/**
 * Enhanced breakpoint hook for comprehensive responsive design
 * Provides device type classification, orientation detection, and flexible breakpoint utilities
 */
export function useBreakpoints(): BreakpointState {
  const [state, setState] = useState<Omit<BreakpointState, 'isAbove' | 'isBelow' | 'isBetween'>>(() => {
    // Initialize with current window dimensions (SSR safe)
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024
    const height = typeof window !== 'undefined' ? window.innerHeight : 768
    
    return {
      width,
      height,
      deviceType: getDeviceType(width),
      orientation: getOrientation(width, height),
      isMobile: width < BREAKPOINTS.md,
      isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.lg && width < BREAKPOINTS['2xl'],
      isLargeDesktop: width >= BREAKPOINTS['2xl'],
      isTouchDevice: detectTouchDevice()
    }
  })

  useEffect(() => {
    const updateBreakpoints = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      
      setState({
        width,
        height,
        deviceType: getDeviceType(width),
        orientation: getOrientation(width, height),
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg && width < BREAKPOINTS['2xl'],
        isLargeDesktop: width >= BREAKPOINTS['2xl'],
        isTouchDevice: detectTouchDevice()
      })
    }

    // Listen for resize events
    window.addEventListener('resize', updateBreakpoints)
    
    // Listen for orientation changes (mobile devices)
    window.addEventListener('orientationchange', updateBreakpoints)
    
    // Initial update
    updateBreakpoints()

    return () => {
      window.removeEventListener('resize', updateBreakpoints)
      window.removeEventListener('orientationchange', updateBreakpoints)
    }
  }, [])

  // Utility functions
  const isAbove = (breakpoint: BreakpointKey): boolean => {
    return state.width >= BREAKPOINTS[breakpoint]
  }

  const isBelow = (breakpoint: BreakpointKey): boolean => {
    return state.width < BREAKPOINTS[breakpoint]
  }

  const isBetween = (min: BreakpointKey, max: BreakpointKey): boolean => {
    return state.width >= BREAKPOINTS[min] && state.width < BREAKPOINTS[max]
  }

  return {
    ...state,
    isAbove,
    isBelow,
    isBetween
  }
}

/**
 * Determine device type based on viewport width
 */
function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.md) return 'mobile'
  if (width < BREAKPOINTS.lg) return 'tablet'
  if (width < BREAKPOINTS['2xl']) return 'desktop'
  return 'large-desktop'
}

/**
 * Determine orientation based on viewport dimensions
 */
function getOrientation(width: number, height: number): Orientation {
  return width > height ? 'landscape' : 'portrait'
}

/**
 * Detect if the device supports touch input
 */
function detectTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - Legacy IE support
    navigator.msMaxTouchPoints > 0
  )
}

/**
 * Hook for simple mobile detection (backward compatibility)
 */
export function useIsMobile(): boolean {
  const { isMobile } = useBreakpoints()
  return isMobile
}

/**
 * Hook for tablet detection
 */
export function useIsTablet(): boolean {
  const { isTablet } = useBreakpoints()
  return isTablet
}

/**
 * Hook for desktop detection
 */
export function useIsDesktop(): boolean {
  const { isDesktop, isLargeDesktop } = useBreakpoints()
  return isDesktop || isLargeDesktop
}

/**
 * Hook for touch device detection
 */
export function useIsTouchDevice(): boolean {
  const { isTouchDevice } = useBreakpoints()
  return isTouchDevice
}

// Export breakpoint constants for use in other components
export { BREAKPOINTS }
export type { BreakpointKey, DeviceType, Orientation, BreakpointState }