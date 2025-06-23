import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X, Edit3, Trash2, Hash } from 'lucide-react'
import { useChatStore } from '../stores/chatStore'
import { Badge } from '../components/ui/badge'
import AdaptiveLayout from '../components/layout/AdaptiveLayout'

const TagManagement = () => {
  const { 
    availableTags, 
    chats, 
    addAvailableTag, 
    setSelectedTags 
  } = useChatStore()
  
  const [newTag, setNewTag] = useState('')
  const [editingTag, setEditingTag] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const getTagUsageCount = (tag: string) => {
    return chats.filter(chat => chat.tags.includes(tag)).length
  }

  const handleAddTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      addAvailableTag(newTag.trim())
      setNewTag('')
    }
  }

  const handleEditTag = (tag: string) => {
    setEditingTag(tag)
    setEditValue(tag)
  }

  const handleSaveEdit = () => {
    // For now, we'll just cancel editing since updating tag names
    // would require updating all chats that use this tag
    setEditingTag(null)
    setEditValue('')
  }

  const handleCancelEdit = () => {
    setEditingTag(null)
    setEditValue('')
  }

  return (
    <AdaptiveLayout>
      <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Add New Tag */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Tag</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTag()
                }}
                placeholder="Enter tag name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <motion.button
                onClick={handleAddTag}
                disabled={!newTag.trim() || availableTags.includes(newTag.trim())}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="w-5 h-5" />
                <span>Add Tag</span>
              </motion.button>
            </div>
          </div>

          {/* Existing Tags */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Manage Tags ({availableTags.length})
            </h2>
            
            {availableTags.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Hash className="w-8 h-8 text-gray-400" />
                </div>
                <p>No tags created yet</p>
                <p className="text-sm">Add your first tag above to get started</p>
              </div>
            ) : (
              <div className="space-y-3">
                {availableTags.map((tag) => {
                  const usageCount = getTagUsageCount(tag)
                  const isEditing = editingTag === tag

                  return (
                    <motion.div
                      key={tag}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit()
                              if (e.key === 'Escape') handleCancelEdit()
                            }}
                            className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            autoFocus
                          />
                        ) : (
                          <>
                            <Badge variant="outline" className="text-sm">
                              {tag}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              Used in {usageCount} chat{usageCount !== 1 ? 's' : ''}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {isEditing ? (
                          <>
                            <button
                              onClick={handleSaveEdit}
                              className="p-1 text-green-600 hover:text-green-700"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditTag(tag)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-red-600"
                              disabled={usageCount > 0}
                              title={usageCount > 0 ? 'Cannot delete tag that is in use' : 'Delete tag'}
                            >
                              <Trash2 className={`w-4 h-4 ${usageCount > 0 ? 'opacity-30' : ''}`} />
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
    </AdaptiveLayout>
  )
}

export default TagManagement
