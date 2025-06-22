import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Library, 
  Settings, 
  Home,
  Plus,
  Search,
  Menu,
  X,
  ChevronRight,
  User
} from 'lucide-react'
import { useBreakpoints } from '@/hooks/use-breakpoints'
import { cn } from '@/lib/utils'

interface NavigationItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  badge?: number
  children?: NavigationItem[]
}

interface ResponsiveNavigationProps {
  className?: string
  onNavigate?: (path: string) => void
}

const navigationItems: NavigationItem[] = [
  { 
    id: 'home', 
    label: 'Chats', 
    icon: MessageCircle, 
    path: '/',
    children: [
      { id: 'new-chat', label: 'New Chat', icon: Plus, path: '/chat/new' },
      { id: 'search-chats', label: 'Search Chats', icon: Search, path: '/chats/search' }
    ]
  },
  { 
    id: 'contexts', 
    label: 'Library', 
    icon: Library, 
    path: '/contexts',
    children: [
      { id: 'new-context', label: 'New Context', icon: Plus, path: '/contexts/new' },
      { id: 'search-contexts', label: 'Search Library', icon: Search, path: '/contexts/search' }
    ]
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    path: '/settings',
    children: [
      { id: 'profile', label: 'Profile', icon: User, path: '/settings/profile' }
    ]
  }
]

/**
 * Responsive navigation component that adapts to different screen sizes:
 * - Mobile: Bottom tab bar (current behavior)
 * - Tablet: Collapsible side navigation with icons + labels
 * - Desktop: Full sidebar navigation with expanded items and sub-navigation
 */
const ResponsiveNavigation: React.FC<ResponsiveNavigationProps> = ({
  className,
  onNavigate
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isMobile, isTablet, isDesktop } = useBreakpoints()
  
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleNavigate = (path: string) => {
    navigate(path)
    onNavigate?.(path)
  }

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/chat')
    }
    return location.pathname.startsWith(path)
  }

  // Mobile Navigation (Bottom Tab Bar)
  if (isMobile) {
    return (
      <motion.nav 
        className={cn(
          "bg-white border-t border-gray-200 px-4 py-2 flex justify-around safe-area-bottom",
          className
        )}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={cn(
                "flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors min-h-touch",
                active 
                  ? "text-green-600 bg-green-50" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Icon className={cn("w-6 h-6", active && "text-green-600")} />
              <span className={cn(
                "text-xs font-medium",
                active ? "text-green-600" : "text-gray-600"
              )}>
                {item.label}
              </span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </motion.nav>
    )
  }

  // Tablet Navigation (Collapsible Side Navigation)
  if (isTablet) {
    return (
      <motion.nav 
        className={cn(
          "bg-white border-r border-gray-200 flex flex-col h-full",
          isCollapsed ? "w-16" : "w-64",
          className
        )}
        initial={{ x: -256, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        layout
      >
        {/* Header with collapse toggle */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            const hasChildren = item.children && item.children.length > 0
            const isExpanded = expandedItems.has(item.id)
            
            return (
              <div key={item.id} className="px-3 mb-1">
                <button
                  onClick={() => {
                    if (hasChildren && !isCollapsed) {
                      toggleExpanded(item.id)
                    } else {
                      handleNavigate(item.path)
                    }
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors min-h-touch",
                    active 
                      ? "text-green-600 bg-green-50" 
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className={cn("w-5 h-5 flex-shrink-0", active && "text-green-600")} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left font-medium">{item.label}</span>
                      {hasChildren && (
                        <ChevronRight 
                          className={cn(
                            "w-4 h-4 transition-transform",
                            isExpanded && "rotate-90"
                          )} 
                        />
                      )}
                    </>
                  )}
                  {item.badge && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>

                {/* Sub-navigation */}
                {hasChildren && !isCollapsed && (
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-8 mt-1 space-y-1"
                      >
                        {item.children!.map((child) => {
                          const ChildIcon = child.icon
                          const childActive = isActive(child.path)
                          
                          return (
                            <button
                              key={child.id}
                              onClick={() => handleNavigate(child.path)}
                              className={cn(
                                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm",
                                childActive 
                                  ? "text-green-600 bg-green-50" 
                                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                              )}
                            >
                              <ChildIcon className="w-4 h-4" />
                              <span>{child.label}</span>
                            </button>
                          )
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            )
          })}
        </div>
      </motion.nav>
    )
  }

  // Desktop Navigation (Full Sidebar)
  return (
    <motion.nav 
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col h-full w-sidebar",
        className
      )}
      initial={{ x: -280, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Smart Context Chat</h1>
        <p className="text-sm text-gray-500 mt-1">AI-powered conversations</p>
      </div>

      {/* Quick Actions */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleNavigate('/chat/new')}
            className="flex items-center justify-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
          <button
            onClick={() => handleNavigate('/contexts/new')}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Context</span>
          </button>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedItems.has(item.id) || active
          
          return (
            <div key={item.id} className="px-4 mb-2">
              <button
                onClick={() => {
                  if (hasChildren) {
                    toggleExpanded(item.id)
                  }
                  handleNavigate(item.path)
                }}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                  active 
                    ? "text-green-600 bg-green-50 border border-green-200" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <Icon className={cn("w-5 h-5", active && "text-green-600")} />
                <span className="flex-1 text-left font-medium">{item.label}</span>
                {hasChildren && (
                  <ChevronRight 
                    className={cn(
                      "w-4 h-4 transition-transform",
                      isExpanded && "rotate-90"
                    )} 
                  />
                )}
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>

              {/* Sub-navigation */}
              {hasChildren && (
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-9 mt-2 space-y-1"
                    >
                      {item.children!.map((child) => {
                        const ChildIcon = child.icon
                        const childActive = isActive(child.path)
                        
                        return (
                          <button
                            key={child.id}
                            onClick={() => handleNavigate(child.path)}
                            className={cn(
                              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-sm",
                              childActive 
                                ? "text-green-600 bg-green-50" 
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                            )}
                          >
                            <ChildIcon className="w-4 h-4" />
                            <span>{child.label}</span>
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Smart Context Chat AI
        </div>
      </div>
    </motion.nav>
  )
}

export default ResponsiveNavigation
export type { NavigationItem, ResponsiveNavigationProps }