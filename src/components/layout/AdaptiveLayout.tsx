import React, { ReactNode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBreakpoints } from '@/hooks/use-breakpoints'
import { cn } from '@/lib/utils'
import Header from './Header'
import TabBar from './TabBar'
import { useLocation } from 'react-router-dom'

interface AdaptiveLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
  contextPanel?: ReactNode
  footer?: ReactNode
  headerProps?: any
  className?: string
  // Layout behavior options
  showTabBar?: boolean
  persistentSidebar?: boolean
  collapsibleContextPanel?: boolean
}

interface LayoutConfig {
  showSidebar: boolean
  showContextPanel: boolean
  sidebarCollapsed: boolean
  contextPanelCollapsed: boolean
  layoutType: 'mobile' | 'tablet' | 'desktop'
}

/**
 * Adaptive layout component that intelligently switches between mobile, tablet, and desktop layouts
 * 
 * Mobile (< 768px):
 * - Single column layout
 * - Bottom tab navigation
 * - Full-screen modals for sidebar/context
 * 
 * Tablet (768px - 1024px):
 * - Flexible sidebar that can slide in/out
 * - Context panel as slide-over
 * - Adaptive navigation
 * 
 * Desktop (>= 1024px):
 * - Multi-column layout with persistent sidebars
 * - Resizable panels
 * - Enhanced navigation
 */
const AdaptiveLayout: React.FC<AdaptiveLayoutProps> = ({
  children,
  sidebar,
  contextPanel,
  footer,
  headerProps,
  className,
  showTabBar = true,
  persistentSidebar = true,
  collapsibleContextPanel = true
}) => {
  const { deviceType, isMobile, isTablet, isDesktop } = useBreakpoints()
  const location = useLocation()
  
  // Layout state management
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(() => ({
    showSidebar: isDesktop && persistentSidebar,
    showContextPanel: false,
    sidebarCollapsed: false,
    contextPanelCollapsed: !isDesktop,
    layoutType: deviceType === 'large-desktop' ? 'desktop' : deviceType
  }))

  // Stored panel sizes for desktop
  const [panelSizes, setPanelSizes] = useState({
    sidebar: 280,
    contextPanel: 320,
    main: 0 // Calculated
  })

  // Update layout when breakpoint changes
  useEffect(() => {
    setLayoutConfig(prev => ({
      ...prev,
      showSidebar: isDesktop && persistentSidebar,
      contextPanelCollapsed: !isDesktop && collapsibleContextPanel,
      layoutType: deviceType === 'large-desktop' ? 'desktop' : deviceType
    }))
  }, [deviceType, isDesktop, persistentSidebar, collapsibleContextPanel])

  // Tab bar visibility logic
  const shouldShowTabBar = showTabBar && getTabBarVisibility(location.pathname)

  // Layout toggle functions
  const toggleSidebar = () => {
    setLayoutConfig(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed
    }))
  }

  const toggleContextPanel = () => {
    setLayoutConfig(prev => ({
      ...prev,
      showContextPanel: !prev.showContextPanel,
      contextPanelCollapsed: isMobile ? false : !prev.contextPanelCollapsed
    }))
  }

  // Panel resize handler for desktop
  const handlePanelResize = (panel: 'sidebar' | 'contextPanel', size: number) => {
    setPanelSizes(prev => ({ ...prev, [panel]: size }))
    // Store in localStorage for persistence
    localStorage.setItem(`panel-size-${panel}`, size.toString())
  }

  // Load saved panel sizes
  useEffect(() => {
    const savedSidebarSize = localStorage.getItem('panel-size-sidebar')
    const savedContextSize = localStorage.getItem('panel-size-contextPanel')
    
    if (savedSidebarSize || savedContextSize) {
      setPanelSizes(prev => ({
        ...prev,
        sidebar: savedSidebarSize ? parseInt(savedSidebarSize) : prev.sidebar,
        contextPanel: savedContextSize ? parseInt(savedContextSize) : prev.contextPanel
      }))
    }
  }, [])

  // Render mobile layout
  if (isMobile) {
    return (
      <div className={cn("h-screen h-dvh bg-gray-50 flex flex-col", className)}>
        <Header {...headerProps} onToggleContextPanel={toggleContextPanel} />
        
        <motion.main 
          className="flex-1 min-h-0 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>

        {footer && (
          <motion.div
            className="flex-shrink-0"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {footer}
          </motion.div>
        )}

        {shouldShowTabBar && <TabBar />}

        {/* Mobile Context Panel - Full Screen Modal */}
        <AnimatePresence>
          {layoutConfig.showContextPanel && contextPanel && (
            <motion.div
              className="fixed inset-0 z-50 bg-white"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              {contextPanel}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Render tablet layout
  if (isTablet) {
    return (
      <div className={cn("h-screen h-dvh bg-gray-50 flex flex-col", className)}>
        <Header {...headerProps} onToggleSidebar={toggleSidebar} onToggleContextPanel={toggleContextPanel} />
        
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Tablet Sidebar - Slide In/Out */}
          <AnimatePresence>
            {layoutConfig.showSidebar && sidebar && !layoutConfig.sidebarCollapsed && (
              <motion.aside
                className="w-80 bg-white border-r border-gray-200 flex-shrink-0"
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                {sidebar}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <motion.main 
            className="flex-1 min-w-0 overflow-hidden"
            layout
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.main>

          {/* Tablet Context Panel - Slide Over */}
          <AnimatePresence>
            {layoutConfig.showContextPanel && contextPanel && (
              <motion.div
                className="w-96 bg-white border-l border-gray-200 flex-shrink-0"
                initial={{ x: 384 }}
                animate={{ x: 0 }}
                exit={{ x: 384 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              >
                {contextPanel}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {footer && (
          <motion.div
            className="flex-shrink-0"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {footer}
          </motion.div>
        )}

        {shouldShowTabBar && <TabBar />}
      </div>
    )
  }

  // Render desktop layout
  return (
    <div className={cn("h-screen h-dvh bg-gray-50 flex flex-col", className)}>
      <Header {...headerProps} onToggleSidebar={toggleSidebar} onToggleContextPanel={toggleContextPanel} />
      
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Desktop Sidebar - Persistent with Resize */}
        <AnimatePresence>
          {layoutConfig.showSidebar && sidebar && !layoutConfig.sidebarCollapsed && (
            <motion.aside
              className="bg-white border-r border-gray-200 flex-shrink-0 relative"
              style={{ width: panelSizes.sidebar }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: panelSizes.sidebar, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {sidebar}
              
              {/* Resize Handle */}
              <div
                className="absolute right-0 top-0 bottom-0 w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize transition-colors"
                onMouseDown={(e) => {
                  const startX = e.clientX
                  const startWidth = panelSizes.sidebar
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    const newWidth = Math.max(200, Math.min(400, startWidth + (e.clientX - startX)))
                    handlePanelResize('sidebar', newWidth)
                  }
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                  }
                  
                  document.addEventListener('mousemove', handleMouseMove)
                  document.addEventListener('mouseup', handleMouseUp)
                }}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.main 
          className="flex-1 min-w-0 overflow-hidden"
          layout
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.main>

        {/* Desktop Context Panel - Persistent with Resize */}
        <AnimatePresence>
          {layoutConfig.showContextPanel && contextPanel && !layoutConfig.contextPanelCollapsed && (
            <motion.aside
              className="bg-white border-l border-gray-200 flex-shrink-0 relative"
              style={{ width: panelSizes.contextPanel }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: panelSizes.contextPanel, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {contextPanel}
              
              {/* Resize Handle */}
              <div
                className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize transition-colors"
                onMouseDown={(e) => {
                  const startX = e.clientX
                  const startWidth = panelSizes.contextPanel
                  
                  const handleMouseMove = (e: MouseEvent) => {
                    const newWidth = Math.max(250, Math.min(500, startWidth - (e.clientX - startX)))
                    handlePanelResize('contextPanel', newWidth)
                  }
                  
                  const handleMouseUp = () => {
                    document.removeEventListener('mousemove', handleMouseMove)
                    document.removeEventListener('mouseup', handleMouseUp)
                  }
                  
                  document.addEventListener('mousemove', handleMouseMove)
                  document.addEventListener('mouseup', handleMouseUp)
                }}
              />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {footer && (
        <motion.div
          className="flex-shrink-0"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {footer}
        </motion.div>
      )}
    </div>
  )
}

// Tab bar visibility logic (extracted from AppLayout)
const getTabBarVisibility = (pathname: string): boolean => {
  const hiddenRoutes = [
    /^\/onboarding$/,      // Onboarding page
    /^\/chat\//,           // All chat routes (/chat/:id)
    /^\/contexts\/\w+$/,   // Context details (/contexts/:id)
    /^\/contexts\/new$/,   // Context creation
    /^\/contexts\/select/, // Context selection
    /^\/settings\/tags$/,  // Tag management
    /^\/tag-management$/   // Legacy tag management
  ]
  
  return !hiddenRoutes.some(pattern => pattern.test(pathname))
}

export default AdaptiveLayout
export type { AdaptiveLayoutProps, LayoutConfig }