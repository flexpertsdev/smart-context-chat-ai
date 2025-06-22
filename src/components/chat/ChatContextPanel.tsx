
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Context } from '../../types'
import AdaptiveContextCard from '../context/AdaptiveContextCard'

interface ChatContextPanelProps {
  isOpen: boolean
  onClose: () => void
  attachedContexts: Context[]
  onRemoveContext: (contextId: string) => void
  onAddContext: () => void
}

const ChatContextPanel = ({
  isOpen,
  onClose,
  attachedContexts,
  onRemoveContext,
  onAddContext
}: ChatContextPanelProps) => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleContextClick = (contextId: string) => {
    navigate(`/contexts/${contextId}`)
  }

  const filteredContexts = attachedContexts.filter(context =>
    context.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    context.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Chat Contexts</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contexts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Add Context Button */}
            <div className="p-4 border-b border-gray-100">
              <button
                onClick={onAddContext}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Context</span>
              </button>
            </div>

            {/* Contexts List */}
            <div className="flex-1 overflow-y-auto p-4">
              {attachedContexts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No contexts attached</h3>
                  <p className="text-gray-500 mb-4">Add contexts to get more relevant responses from AI.</p>
                  <button
                    onClick={onAddContext}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add First Context
                  </button>
                </div>
              ) : filteredContexts.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No contexts match your search.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredContexts.map((context) => (
                    <AdaptiveContextCard
                      key={context.id}
                      context={context}
                      onClick={() => handleContextClick(context.id)}
                      variant="compact"
                      showUsage={false}
                      showActions={false}
                      onDelete={() => {
                        onRemoveContext(context.id)
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ChatContextPanel
