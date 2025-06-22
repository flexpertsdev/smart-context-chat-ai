
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Edit3, Share2, Download, Trash2, Eye, EyeOff } from 'lucide-react'
import { useContextStore } from '../stores/contextStore'

const ContextDetails = () => {
  const { contextId } = useParams<{ contextId: string }>()
  const navigate = useNavigate()
  const { contexts, updateContext, deleteContext } = useContextStore()
  const [isEditing, setIsEditing] = useState(false)
  
  const context = contexts.find(c => c.id === contextId)

  if (!context) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Context not found</p>
          <button
            onClick={() => navigate('/contexts')}
            className="mt-4 text-green-600 hover:text-green-700"
          >
            Back to Library
          </button>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this context?')) {
      deleteContext(context.id)
      navigate('/contexts')
    }
  }

  const togglePrivacy = () => {
    updateContext(context.id, { isPrivate: !context.isPrivate })
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
          <h2 className="text-lg font-semibold text-gray-900">Context Details</h2>
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              onClick={togglePrivacy}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {context.isPrivate ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.button>

            <motion.button
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-5 h-5" />
            </motion.button>

            <motion.button
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={handleDelete}
              className="p-2 rounded-lg bg-red-100 hover:bg-red-200 transition-colors text-red-600"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Context Info */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">{context.title}</h1>
          <p className="text-gray-600">{context.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {context.type}
            </span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {context.category}
            </span>
            {context.isPrivate && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Private
              </span>
            )}
            {context.autoSuggest && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Auto-suggest
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content</h3>
          
          {isEditing ? (
            <textarea
              defaultValue={context.content}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-gray-700">{context.content}</p>
            </div>
          )}
        </motion.div>

        {/* Tags */}
        {context.tags.length > 0 && (
          <motion.div
            className="bg-white rounded-lg p-6 shadow-sm mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {context.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Usage Statistics */}
        <motion.div
          className="bg-white rounded-lg p-6 shadow-sm mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Times Used</p>
              <p className="text-2xl font-bold text-gray-900">{context.usageCount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last Used</p>
              <p className="text-sm text-gray-900">{context.lastUsed.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-sm text-gray-900">{context.createdAt.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Size</p>
              <p className="text-sm text-gray-900">
                {context.size < 1024 ? `${context.size}B` :
                 context.size < 1024 * 1024 ? `${(context.size / 1024).toFixed(1)}KB` :
                 `${(context.size / (1024 * 1024)).toFixed(1)}MB`}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ContextDetails
