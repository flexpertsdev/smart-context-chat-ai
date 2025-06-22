import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Header from './Header'

interface HeaderOnlyLayoutProps {
  children: ReactNode
  headerProps?: {
    onAddContext?: () => void
    onShowContextPanel?: () => void
  }
}

/**
 * Header-only layout with Header + Content (no TabBar)
 * Used by: Chat, ContextDetails, CreateContext, TagManagement
 */
const HeaderOnlyLayout = ({ children, headerProps }: HeaderOnlyLayoutProps) => {
  return (
    <div className="h-full bg-gray-50 flex flex-col">
      <Header {...headerProps} />
      
      <motion.main 
        className="flex-1 min-h-0 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </div>
  )
}

export default HeaderOnlyLayout