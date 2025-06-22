
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Context } from '../../types'
import ContextCard from '../context/ContextCard'

interface ContextPickerProps {
  isOpen: boolean
  onClose: () => void
  onSelectContexts: (contextIds: string[]) => void
  availableContexts: Context[]
}

const ContextPicker = ({ isOpen, onClose, onSelectContexts, availableContexts }: ContextPickerProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContexts, setSelectedContexts] = useState<string[]>([])

  const filteredContexts = availableContexts.filter(context =>
    context.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    context.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    context.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleContextToggle = (contextId: string) => {
    setSelectedContexts(prev =>
      prev.includes(contextId)
        ? prev.filter(id => id !== contextId)
        : [...prev, contextId]
    )
  }

  const handleConfirm = () => {
    onSelectContexts(selectedContexts)
    setSelectedContexts([])
    setSearchTerm('')
  }

  const handleCancel = () => {
    onClose()
    setSelectedContexts([])
    setSearchTerm('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
      <motion.div
        className="w-full bg-white rounded-t-3xl max-h-[70vh] overflow-hidden"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Link Contexts</h3>
          <button
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search contexts..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Context List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid gap-3">
            {filteredContexts.map((context) => (
              <ContextCard
                key={context.id}
                context={context}
                onClick={() => handleContextToggle(context.id)}
                isSelected={selectedContexts.includes(context.id)}
                showUsage={false}
              />
            ))}
          </div>
          
          {filteredContexts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No contexts found</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-200 flex space-x-3">
          <button
            onClick={handleConfirm}
            disabled={selectedContexts.length === 0}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Link {selectedContexts.length} Context{selectedContexts.length !== 1 ? 's' : ''}
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default ContextPicker
