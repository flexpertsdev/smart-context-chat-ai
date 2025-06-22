
import React, { useState } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '../ui/badge'

interface AddTagBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  availableTags: string[]
  chatTags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  onAddCustomTag: (tag: string) => void
}

const AddTagBottomSheet: React.FC<AddTagBottomSheetProps> = ({
  isOpen,
  onClose,
  availableTags,
  chatTags,
  onAddTag,
  onRemoveTag,
  onAddCustomTag
}) => {
  const [customTag, setCustomTag] = useState('')

  const handleAddCustomTag = () => {
    if (customTag.trim() && !availableTags.includes(customTag.trim())) {
      onAddCustomTag(customTag.trim())
      onAddTag(customTag.trim())
      setCustomTag('')
    }
  }

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
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 500 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl z-50 max-h-[70vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Manage Tags</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto">
              {/* Custom tag input */}
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCustomTag()
                    }}
                    placeholder="Create new tag"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleAddCustomTag}
                    disabled={!customTag.trim()}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Available tags */}
              <div className="space-y-2">
                <h4 className="font-medium text-gray-700">Available Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = chatTags.includes(tag)
                    return (
                      <button
                        key={tag}
                        onClick={() => isSelected ? onRemoveTag(tag) : onAddTag(tag)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{tag}</span>
                        {isSelected && <Check className="w-3 h-3" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddTagBottomSheet
