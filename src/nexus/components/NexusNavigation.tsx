import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Library, 
  Settings,
  Menu,
  X,
  Plus,
  Search,
  Brain,
  Home
} from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  path: string
  badge?: number
}

interface NexusNavigationProps {
  variant: 'mobile' | 'tablet' | 'desktop'
  onNewChat?: () => void
}

const NexusNavigation: React.FC<NexusNavigationProps> = ({ variant, onNewChat }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home, path: '/nexus' },
    { id: 'chats', label: 'Chats', icon: MessageSquare, path: '/nexus/chats', badge: 3 },
    { id: 'contexts', label: 'Contexts', icon: Library, path: '/nexus/contexts' },
    { id: 'thinking', label: 'AI Insights', icon: Brain, path: '/nexus/insights' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/nexus/settings' }
  ]

  const isActive = (path: string) => location.pathname.startsWith(path)

  // Mobile Bottom Navigation
  if (variant === 'mobile') {
    return (
      <>
        {/* Mobile Header Bar */}
        <header 
          className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40"
          style={{
            paddingTop: 'env(safe-area-inset-top, 0px)'
          }}
        >
          <div className="flex items-center justify-between px-4 h-14">
            <h1 className="text-lg font-semibold">Nexus AI</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Bottom Nav */}
        <nav 
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40"
          style={{
            paddingBottom: 'env(safe-area-inset-bottom, 0px)'
          }}
        >
          <div className="flex items-center justify-around py-2">
            {navItems.slice(0, 4).map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className="flex flex-col items-center justify-center p-2 min-w-[64px]"
                >
                  <div className="relative">
                    <Icon 
                      className={`w-6 h-6 ${active ? 'text-green-600' : 'text-gray-600'}`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs mt-1 ${active ? 'text-green-600' : 'text-gray-600'}`}>
                    {item.label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="fixed inset-0 bg-black/50 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <motion.div
                className="absolute right-0 top-0 bottom-0 w-80 bg-white"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-gray-200">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="p-4">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          navigate(item.path)
                          setMobileMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  // Tablet Side Navigation
  if (variant === 'tablet') {
    return (
      <nav 
        className="fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-gray-200 z-30"
      >
        <div className="flex flex-col h-full py-4">
          <div className="flex items-center justify-center mb-8">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center gap-2 px-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full p-3 rounded-lg relative group ${
                    active ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto" />
                  {item.badge && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap">
                    {item.label}
                  </div>
                </button>
              )
            })}
          </div>

          {onNewChat && (
            <div className="px-3 pb-4">
              <button
                onClick={onNewChat}
                className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-6 h-6 mx-auto" />
              </button>
            </div>
          )}
        </div>
      </nav>
    )
  }

  // Desktop Sidebar Navigation
  return (
    <nav 
      className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 z-30"
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">N</span>
            </div>
            <div>
              <h1 className="font-semibold">Nexus AI</h1>
              <p className="text-sm text-gray-600">Context-aware assistant</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    active 
                      ? 'bg-green-50 text-green-600' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {onNewChat && (
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-5 h-5" />
              <span>New Chat</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default NexusNavigation