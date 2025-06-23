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
    <div className="fixed inset-0 flex flex-col bg-gray-50">
      {showHeader && (
        <NexusNavigation variant="mobile" />
      )}
      
      <motion.main 
        className="flex-1 overflow-y-auto overscroll-contain"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        style={{
          paddingTop: showHeader ? 'env(safe-area-inset-top, 0px)' : '0',
          paddingBottom: showBottomNav ? 'calc(56px + env(safe-area-inset-bottom, 0px))' : '0',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div style={{ paddingTop: showHeader ? '56px' : '0' }}>
          {children}
        </div>
      </motion.main>
    </div>
  )
}

export default MobileLayout