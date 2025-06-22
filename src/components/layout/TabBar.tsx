
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { MessageCircle, Library, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

const TabBar = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { id: 'chats', label: 'Chats', icon: MessageCircle, path: '/' },
    { id: 'contexts', label: 'Library', icon: Library, path: '/contexts' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
  ]

  return (
    <motion.div 
      className="bg-white border-t border-gray-200 px-4 py-2 flex justify-around"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path
        const Icon = tab.icon

        return (
          <motion.button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              isActive 
                ? 'text-green-600 bg-green-50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{tab.label}</span>
            
            {isActive && (
              <motion.div
                className="absolute bottom-0 left-1/2 w-1 h-1 bg-green-600 rounded-full"
                layoutId="activeTab"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        )
      })}
    </motion.div>
  )
}

export default TabBar
