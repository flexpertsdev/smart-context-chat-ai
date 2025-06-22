
import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Database, MessageSquare, Tag } from 'lucide-react'
import { Context } from '../../types'

interface ContextCardProps {
  context: Context
  onClick?: () => void
  isSelected?: boolean
  showUsage?: boolean
}

const ContextCard = ({ context, onClick, isSelected = false, showUsage = true }: ContextCardProps) => {
  const getTypeIcon = () => {
    switch (context.type) {
      case 'knowledge':
        return <Database className="w-4 h-4" />
      case 'document':
        return <FileText className="w-4 h-4" />
      case 'chat':
        return <MessageSquare className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getTypeColor = () => {
    switch (context.type) {
      case 'knowledge':
        return 'text-blue-600 bg-blue-100'
      case 'document':
        return 'text-purple-600 bg-purple-100'
      case 'chat':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
  }

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString()
  }

  // Ensure we have valid string values for rendering
  const safeTitle = typeof context.title === 'string' ? context.title : 'Untitled Context'
  const safeDescription = typeof context.description === 'string' ? context.description : 'No description available'
  const safeType = typeof context.type === 'string' ? context.type : 'document'
  const safeCategory = typeof context.category === 'string' ? context.category : 'General'
  const safeUsageCount = typeof context.usageCount === 'number' ? context.usageCount : 0
  const safeSize = typeof context.size === 'number' ? context.size : 0
  const safeTags = Array.isArray(context.tags) ? context.tags : []

  return (
    <motion.div
      onClick={onClick}
      className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
        isSelected 
          ? 'border-green-500 bg-green-50' 
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${getTypeColor()}`}>
            {getTypeIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{safeTitle}</h3>
            <p className="text-xs text-gray-500 capitalize">{safeType}</p>
          </div>
        </div>
        
        {showUsage && (
          <div className="text-right">
            <div className="text-xs text-gray-500">
              Used {safeUsageCount} times
            </div>
            <div className="text-xs text-gray-400">
              {formatSize(safeSize)}
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
        {safeDescription}
      </p>

      {safeTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {safeTags.slice(0, 3).map((tag, index) => (
            <div
              key={`${tag}-${index}`}
              className="inline-flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
            >
              <Tag className="w-3 h-3" />
              <span>{typeof tag === 'string' ? tag : 'Tag'}</span>
            </div>
          ))}
          {safeTags.length > 3 && (
            <div className="text-xs text-gray-400 px-2 py-1">
              +{safeTags.length - 3} more
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>
          {formatDate(context.lastUsed)}
        </span>
        {context.autoSuggest && (
          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            Auto-suggest
          </span>
        )}
      </div>
    </motion.div>
  )
}

export default ContextCard
