import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Header from './Header'
import TabBar from './TabBar'

interface StandardLayoutProps {
  children: ReactNode
  headerProps?: {
    onAddContext?: () => void
    onShowContextPanel?: () => void
  }
}

/**
 * Standard layout with Header + Content + TabBar
 * Used by: Home, ContextLibrary, Settings
 */
const StandardLayout = ({ children, headerProps }: StandardLayoutProps) => {
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

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <TabBar />
      </motion.div>
    </div>
  )
}

export default StandardLayout