import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Header from './Header'

interface UniversalLayoutProps {
  children: ReactNode
  footer?: ReactNode
  headerProps?: {
    onAddContext?: () => void
    onShowContextPanel?: () => void
  }
}

/**
 * Universal layout: Header + Content + Optional Footer
 * Used by: All pages except standalone (onboarding)
 * 
 * Layout structure:
 * - Header: Fixed at top
 * - Content: Flexible middle (expands to fill available space)
 * - Footer: Fixed at bottom (TabBar, MessageComposer, or nothing)
 */
const UniversalLayout = ({ children, footer, headerProps }: UniversalLayoutProps) => {
  return (
    <div className="h-screen h-dvh bg-gray-50 flex flex-col">
      <Header {...headerProps} />
      
      <motion.main 
        className="flex-1 min-h-0 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>

      {footer && (
        <motion.div
          className="flex-shrink-0"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {footer}
        </motion.div>
      )}
    </div>
  )
}

export default UniversalLayout