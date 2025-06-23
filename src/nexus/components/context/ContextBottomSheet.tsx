import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import ContextSelector from './ContextSelector'
import { Heading4 } from '../../foundations/Typography'

interface Context {
  id: string
  title: string
  category: string
  tags: string[]
}

interface ContextBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  contexts: Context[]
  selectedContexts: string[]
  onToggleContext: (contextId: string) => void
  onClearAll: () => void
}

const ContextBottomSheet: React.FC<ContextBottomSheetProps> = ({
  isOpen,
  onClose,
  contexts,
  selectedContexts,
  onToggleContext,
  onClearAll
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-xl md:hidden"
            style={{ maxHeight: '90vh' }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-12 h-1 bg-gray-300 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-3 border-b border-gray-200">
              <Heading4>Select Contexts</Heading4>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="h-full" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              <ContextSelector
                contexts={contexts}
                selectedContexts={selectedContexts}
                onToggleContext={onToggleContext}
                onClearAll={onClearAll}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ContextBottomSheet