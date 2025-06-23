import React from 'react'
import { motion } from 'framer-motion'
import NexusNavigation from '../components/NexusNavigation'

interface MobileLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showBottomNav?: boolean
  headerTitle?: string
  onBack?: () => void
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  showHeader = true,
  showBottomNav = true,
  headerTitle,
  onBack
}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {showHeader && (
        <NexusNavigation variant="mobile" />
      )}
      
      <motion.main 
        className="flex-1 overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          paddingTop: showHeader ? '56px' : '0',
          paddingBottom: showBottomNav ? '56px' : '0'
        }}
      >
        {children}
      </motion.main>
    </div>
  )
}

export default MobileLayout