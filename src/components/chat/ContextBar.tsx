
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { Context } from '../../types'

interface ContextBarProps {
  contexts: Context[]
  onRemoveContext: (contextId: string) => void
  onAddContext: () => void
}

const ContextBar = ({ contexts, onRemoveContext, onAddContext }: ContextBarProps) => {
  if (contexts.length === 0) {
    return (
      <motion.div
        className="bg-blue-50 border-b border-blue-100 px-4 py-3"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
      >
        <motion.button
          onClick={onAddContext}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add context to improve responses</span>
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="bg-green-50 border-b border-green-100 px-4 py-3"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-green-700">Active Contexts</span>
        <motion.button
          onClick={onAddContext}
          className="p-1 rounded-full hover:bg-green-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-3 h-3 text-green-600" />
        </motion.button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {contexts.map((context) => (
            <motion.div
              key={context.id}
              className="flex items-center space-x-2 bg-white border border-green-200 rounded-full px-3 py-1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <span className="text-xs font-medium text-gray-700 truncate max-w-20">
                {context.title}
              </span>
              <motion.button
                onClick={() => onRemoveContext(context.id)}
                className="p-0.5 rounded-full hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
              >
                <X className="w-3 h-3 text-gray-400" />
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default ContextBar
