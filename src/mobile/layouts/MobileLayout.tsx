import React, { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MobileHeader from '../components/MobileHeader'
import MobileBottomNav from '../components/MobileBottomNav'

interface MobileLayoutProps {
  children: ReactNode
  headerProps?: {
    title?: string
    subtitle?: string
    onBack?: () => void
    variant?: 'home' | 'chat' | 'settings'
    actions?: Array<{
      icon: React.ElementType
      onClick: () => void
      label: string
    }>
    profileImage?: string
    isOnline?: boolean
  }
  showBottomNav?: boolean
  showHeader?: boolean
  className?: string
}

const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  headerProps = {},
  showBottomNav = true,
  showHeader = true,
  className = ''
}) => {
  return (
    <div className="h-screen h-dvh bg-gray-50 flex flex-col overflow-hidden">
      {/* Status Bar Space */}
      <div className="safe-area-top bg-green-600" />

      {/* Header */}
      <AnimatePresence>
        {showHeader && (
          <MobileHeader {...headerProps} />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main 
        className={`flex-1 overflow-hidden ${showHeader ? 'pt-14' : ''} ${showBottomNav ? 'pb-14' : ''} ${className}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.main>

      {/* Bottom Navigation */}
      <AnimatePresence>
        {showBottomNav && (
          <MobileBottomNav />
        )}
      </AnimatePresence>

      {/* Safe Area Bottom */}
      <div className="safe-area-bottom bg-white" />
    </div>
  )
}

export default MobileLayout