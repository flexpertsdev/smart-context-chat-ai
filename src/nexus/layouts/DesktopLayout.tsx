import React from 'react'
import { motion } from 'framer-motion'
import NexusNavigation from '../components/NexusNavigation'

interface DesktopLayoutProps {
  children: React.ReactNode
  onNewChat?: () => void
  showSidebar?: boolean
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({
  children,
  onNewChat,
  showSidebar = true
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      {showSidebar && (
        <NexusNavigation variant="desktop" onNewChat={onNewChat} />
      )}
      
      <motion.main 
        className="flex-1 overflow-y-auto"
        style={{ marginLeft: showSidebar ? '256px' : '0' }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container mx-auto max-w-6xl p-6">
          {children}
        </div>
      </motion.main>
    </div>
  )
}

export default DesktopLayout