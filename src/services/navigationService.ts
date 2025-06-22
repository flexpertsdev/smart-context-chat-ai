import { NavigateFunction } from 'react-router-dom'

interface NavigationState {
  navigate?: NavigateFunction
  history: string[]
  routeContext: Record<string, any>
}

class NavigationManager {
  private state: NavigationState = {
    navigate: undefined,
    history: [],
    routeContext: {}
  }

  private readonly routeHierarchy: Record<string, string> = {
    // Chat routes
    '/chat': '/',
    // Context routes  
    '/contexts/new': '/contexts',
    '/contexts/select': '/contexts',
    // Settings routes
    '/settings/tags': '/settings',
    // Default fallbacks
    '/': '/',
  }

  private readonly routeFallbacks: Record<string, string> = {
    // If we can't go back from these routes, go to these defaults
    '/chat/': '/',
    '/contexts/': '/contexts', 
    '/settings/': '/settings',
    '/tag-management': '/settings'
  }

  /**
   * Initialize the navigation service with the router's navigate function
   */
  initialize(navigate: NavigateFunction) {
    this.state.navigate = navigate
  }

  /**
   * Navigate to a new route and track it in history
   */
  navigateTo(path: string, options?: { replace?: boolean, state?: any }) {
    if (!this.state.navigate) {
      console.error('NavigationService not initialized!')
      return
    }

    const currentPath = window.location.pathname
    
    // Don't track replaced routes in history
    // Only push to history if we're not replacing and not navigating to the same path
    if (!options?.replace && currentPath !== path) {
      this.state.history.push(currentPath)
    }

    this.state.navigate(path, options)
  }

  /**
   * Smart back navigation with fallback logic
   */
  goBack() {
    if (!this.state.navigate) {
      console.error('NavigationService not initialized!')
      return
    }

    const currentPath = window.location.pathname

    // First try: Use our tracked history
    if (this.state.history.length > 0) {
      const previousPath = this.state.history.pop()!
      
      // Ensure we're not going back to the same page
      if (previousPath !== currentPath) {
        this.state.navigate(previousPath)
        return
      }
    }

    // Second try: Use route hierarchy
    const hierarchicalParent = this.getHierarchicalParent(currentPath)
    if (hierarchicalParent && hierarchicalParent !== currentPath) {
      this.state.navigate(hierarchicalParent)
      return
    }

    // Third try: Use route-specific fallbacks
    const fallbackRoute = this.getRouteFallback(currentPath)
    if (fallbackRoute) {
      this.state.navigate(fallbackRoute)
      return
    }

    // Final fallback: Home page
    this.state.navigate('/')
  }

  /**
   * Clear navigation history (useful for logout, etc.)
   */
  clearHistory() {
    this.state.history = []
  }

  /**
   * Get the logical parent route based on hierarchy
   */
  private getHierarchicalParent(currentPath: string): string | null {
    // Exact match in hierarchy
    if (this.routeHierarchy[currentPath]) {
      return this.routeHierarchy[currentPath]
    }

    // Pattern match for dynamic routes
    for (const [pattern, parent] of Object.entries(this.routeHierarchy)) {
      if (pattern.includes(':') || pattern.includes('*')) {
        const regexPattern = pattern
          .replace(/:[^/]+/g, '[^/]+')  // Replace :param with regex
          .replace(/\*/g, '.*')          // Replace * with regex
        
        if (new RegExp(`^${regexPattern}$`).test(currentPath)) {
          return parent
        }
      }
    }

    // For nested paths, try parent directory
    const pathParts = currentPath.split('/').filter(Boolean)
    if (pathParts.length > 1) {
      const parentPath = '/' + pathParts.slice(0, -1).join('/')
      return parentPath
    }

    return null
  }

  /**
   * Get fallback route for current path
   */
  private getRouteFallback(currentPath: string): string | null {
    for (const [pattern, fallback] of Object.entries(this.routeFallbacks)) {
      if (currentPath.startsWith(pattern)) {
        return fallback
      }
    }
    return null
  }

  /**
   * Check if back navigation is available
   */
  canGoBack(): boolean {
    const currentPath = window.location.pathname
    return (
      this.state.history.length > 0 ||
      this.getHierarchicalParent(currentPath) !== null ||
      this.getRouteFallback(currentPath) !== null ||
      currentPath !== '/'
    )
  }

  /**
   * Get the expected back destination without navigating
   */
  getBackDestination(): string {
    const currentPath = window.location.pathname

    // Check history first
    if (this.state.history.length > 0) {
      return this.state.history[this.state.history.length - 1]
    }

    // Check hierarchy
    const hierarchicalParent = this.getHierarchicalParent(currentPath)
    if (hierarchicalParent) {
      return hierarchicalParent
    }

    // Check fallbacks
    const fallbackRoute = this.getRouteFallback(currentPath)
    if (fallbackRoute) {
      return fallbackRoute
    }

    return '/'
  }

  /**
   * Add context to current route (e.g., for breadcrumbs)
   */
  setRouteContext(key: string, value: any) {
    this.state.routeContext[key] = value
  }

  /**
   * Get context for current route
   */
  getRouteContext(key: string) {
    return this.state.routeContext[key]
  }

  /**
   * Clear route context
   */
  clearRouteContext() {
    this.state.routeContext = {}
  }
}

// Export singleton instance
export const navigationService = new NavigationManager()

// Hook for easy usage in components
export const useNavigationService = () => {
  return {
    navigateTo: navigationService.navigateTo.bind(navigationService),
    goBack: navigationService.goBack.bind(navigationService),
    canGoBack: navigationService.canGoBack.bind(navigationService),
    getBackDestination: navigationService.getBackDestination.bind(navigationService),
    clearHistory: navigationService.clearHistory.bind(navigationService),
    setRouteContext: navigationService.setRouteContext.bind(navigationService),
    getRouteContext: navigationService.getRouteContext.bind(navigationService),
  }
}

export default navigationService
