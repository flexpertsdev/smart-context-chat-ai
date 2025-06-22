
import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './Header'
import TabBar from './TabBar'

// Smart tab bar visibility logic
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

const AppLayout = () => {
  const location = useLocation()
  const [showContextDrawer, setShowContextDrawer] = useState(false)
  const [showContextPanelHeader, setShowContextPanelHeader] = useState<(() => void) | null>(null)
  const showTabBar = getTabBarVisibility(location.pathname)
  const isChat = location.pathname.startsWith('/chat/')

  const handleAddContext = () => {
    setShowContextDrawer(true)
  }

  const handleShowContextPanel = () => {
    if (showContextPanelHeader) {
      showContextPanelHeader()
    }
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col app-container">
      <Header 
        onAddContext={isChat ? handleAddContext : undefined}
        onShowContextPanel={isChat ? handleShowContextPanel : undefined}
      />
      
      <motion.main 
        className="flex-1 min-h-0 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet context={{ 
          showContextDrawer, 
          setShowContextDrawer,
          setShowContextPanelHeader
        }} />
      </motion.main>

      {showTabBar && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <TabBar />
        </motion.div>
      )}
    </div>
  )
}

export default AppLayout
