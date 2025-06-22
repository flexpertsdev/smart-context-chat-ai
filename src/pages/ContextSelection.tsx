
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Search, ArrowRight } from 'lucide-react'
import { useContextStore } from '../stores/contextStore'
import ContextCard from '../components/context/ContextCard'

const ContextSelection = () => {
  const { chatId } = useParams<{ chatId: string }>()
  const navigate = useNavigate()
  const { contexts, attachContextsToChat, searchContexts, searchQuery, filteredContexts } = useContextStore()
  const [selectedContexts, setSelectedContexts] = useState<string[]>([])

  const displayContexts = searchQuery ? filteredContexts : contexts

  const handleContextToggle = (contextId: string) => {
    setSelectedContexts(prev =>
      prev.includes(contextId)
        ? prev.filter(id => id !== contextId)
        : [...prev, contextId]
    )
  }

  const handleApplyContexts = () => {
    if (chatId && selectedContexts.length > 0) {
      attachContextsToChat(chatId, selectedContexts)
    }
    navigate(`/chat/${chatId}`)
  }

  const handleSelectAll = () => {
    const allIds = displayContexts.map(context => context.id)
    setSelectedContexts(allIds)
  }

  const handleClearAll = () => {
    setSelectedContexts([])
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <motion.div
        className="bg-white border-b border-gray-200 px-4 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Select Contexts
          </h2>
          <div className="flex space-x-2">
            <motion.button
              onClick={handleClearAll}
              className="text-sm text-gray-600 hover:text-gray-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear All
            </motion.button>
            <motion.button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Select All
            </motion.button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search contexts..."
            value={searchQuery}
            onChange={(e) => searchContexts(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Selected Contexts Summary */}
      {selectedContexts.length > 0 && (
        <motion.div
          className="bg-green-50 border-b border-green-100 px-4 py-3"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-700">
              {selectedContexts.length} context{selectedContexts.length !== 1 ? 's' : ''} selected
            </span>
            <motion.button
              onClick={handleApplyContexts}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Apply</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Contexts List */}
      <div className="flex-1 overflow-y-auto p-4">
        {displayContexts.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No contexts found
            </h3>
            
            <p className="text-gray-600 max-w-sm">
              Try adjusting your search terms or create new contexts in the library.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {displayContexts.map((context, index) => (
              <motion.div
                key={context.id}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ContextCard
                  context={context}
                  onClick={() => handleContextToggle(context.id)}
                  isSelected={selectedContexts.includes(context.id)}
                  showUsage={true}
                />
                
                {selectedContexts.includes(context.id) && (
                  <motion.div
                    className="absolute top-4 right-4 bg-green-600 text-white rounded-full p-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <Check className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ContextSelection
