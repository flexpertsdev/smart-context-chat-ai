import React from 'react'
import { motion } from 'framer-motion'
import NexusNavigation from '../components/NexusNavigation'

interface MobileLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showBottomNav?: boolean
  headerTitle?: string
  onBack?: () => void
  fullHeight?: boolean
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  showHeader = true,
  showBottomNav = true,
  headerTitle,
  onBack,
  fullHeight = false
}) => {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {showHeader && (
        <NexusNavigation variant="mobile" />
      )}
      
      {fullHeight ? (
        <div className="flex-1 flex flex-col" style={{
          paddingTop: showHeader ? 'calc(56px + env(safe-area-inset-top, 0px))' : '0',
          paddingBottom: showBottomNav ? 'calc(56px + env(safe-area-inset-bottom, 0px))' : '0'
        }}>
          {children}
        </div>
      ) : (
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
      )}
    </div>
  )
}

export default MobileLayout