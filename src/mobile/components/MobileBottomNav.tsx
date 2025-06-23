import React from 'react'
import { MessageCircle, Users, Phone, Settings } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'

interface NavItem {
  icon: React.ElementType
  label: string
  path: string
  badge?: number
}

const MobileBottomNav: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems: NavItem[] = [
    { icon: MessageCircle, label: 'Chats', path: '/mobile', badge: 3 },
    { icon: Users, label: 'Contexts', path: '/mobile/contexts' },
    { icon: Phone, label: 'Calls', path: '/mobile/calls' },
    { icon: Settings, label: 'Settings', path: '/mobile/settings' }
  ]

  const isActive = (path: string) => {
    if (path === '/mobile' && location.pathname === '/mobile') return true
    if (path !== '/mobile' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom z-40"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center w-full py-2 min-h-[56px]"
              whileTap={{ scale: 0.95 }}
            >
              {/* Icon Container */}
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    active ? 'text-green-600' : 'text-gray-600'
                  }`}
                  strokeWidth={active ? 2.5 : 2}
                />
                
                {/* Badge */}
                {item.badge && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-green-600 text-white text-xs rounded-full flex items-center justify-center font-medium px-1"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.div>
                )}
              </div>

              {/* Label */}
              <span 
                className={`text-xs mt-1 transition-colors ${
                  active ? 'text-green-600 font-medium' : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>

              {/* Active Indicator */}
              {active && (
                <motion.div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-green-600 rounded-b-full"
                  layoutId="activeTab"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.nav>
  )
}

export default MobileBottomNav