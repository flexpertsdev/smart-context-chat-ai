import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive, 
  Globe, 
  Database,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Share,
  Download,
  Tag,
  Calendar,
  User,
  Clock
} from 'lucide-react'
import { useBreakpoints } from '@/hooks/use-breakpoints'
import { cn } from '@/lib/utils'
import { Context } from '@/types'

interface AdaptiveContextCardProps {
  context: Context
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onShare?: () => void
  showUsage?: boolean
  showActions?: boolean
  variant?: 'compact' | 'default' | 'expanded'
  className?: string
}

/**
 * Adaptive context card that changes its layout and information density based on screen size:
 * - Mobile: Compact card with essential info only
 * - Tablet: Medium card with more details
 * - Desktop: Expanded card with full metadata and hover interactions
 */
const AdaptiveContextCard: React.FC<AdaptiveContextCardProps> = ({
  context,
  onClick,
  onEdit,
  onDelete,
  onShare,
  showUsage = true,
  showActions = true,
  variant,
  className
}) => {
  const { isMobile, isTablet, isDesktop, isTouchDevice } = useBreakpoints()
  const [showMenu, setShowMenu] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // Determine card variant based on screen size if not explicitly set
  const cardVariant = variant || (isMobile ? 'compact' : isTablet ? 'default' : 'expanded')

  // Get type-specific icon and color
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'document':
      case 'text':
        return FileText
      case 'image':
        return Image
      case 'video':
        return Video
      case 'audio':
        return Music
      case 'archive':
        return Archive
      case 'web':
      case 'url':
        return Globe
      default:
        return Database
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'document':
      case 'text':
        return 'text-blue-600 bg-blue-50'
      case 'image':
        return 'text-purple-600 bg-purple-50'
      case 'video':
        return 'text-red-600 bg-red-50'
      case 'audio':
        return 'text-green-600 bg-green-50'
      case 'archive':
        return 'text-yellow-600 bg-yellow-50'
      case 'web':
      case 'url':
        return 'text-indigo-600 bg-indigo-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date)
    return dateObj.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const TypeIcon = getTypeIcon(context.type)
  const typeColorClass = getTypeColor(context.type)

  // Mobile compact card
  if (cardVariant === 'compact') {
    return (
      <motion.div
        className={cn(
          "bg-white rounded-lg border border-gray-200 p-3 cursor-pointer transition-all duration-200",
          "active:scale-95 active:bg-gray-50",
          className
        )}
        onClick={onClick}
        whileTap={{ scale: 0.98 }}
        layout
      >
        <div className="flex items-start space-x-3">
          {/* Type Icon */}
          <div className={cn("p-2 rounded-lg flex-shrink-0", typeColorClass)}>
            <TypeIcon className="w-4 h-4" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate text-sm">
              {context.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {context.description}
            </p>
            
            {/* Compact metadata */}
            <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
              <span>{context.type}</span>
              {context.size && <span>{formatSize(context.size)}</span>}
              {showUsage && context.usageCount && (
                <span>{context.usageCount} uses</span>
              )}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Mobile action menu */}
        {showMenu && showActions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 pt-3 border-t border-gray-100 flex space-x-2"
          >
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                  setShowMenu(false)
                }}
                className="flex-1 flex items-center justify-center space-x-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-xs font-medium"
              >
                <Edit className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
            {onShare && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onShare()
                  setShowMenu(false)
                }}
                className="flex-1 flex items-center justify-center space-x-1 bg-green-50 text-green-600 px-3 py-2 rounded text-xs font-medium"
              >
                <Share className="w-3 h-3" />
                <span>Share</span>
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    )
  }

  // Tablet default card
  if (cardVariant === 'default') {
    return (
      <motion.div
        className={cn(
          "bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all duration-200",
          "hover:border-gray-300 hover:shadow-sm",
          className
        )}
        onClick={onClick}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -2 }}
        layout
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {/* Type Icon */}
            <div className={cn("p-2.5 rounded-lg flex-shrink-0", typeColorClass)}>
              <TypeIcon className="w-5 h-5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {context.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {context.description}
              </p>
              
              {/* Metadata */}
              <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Tag className="w-3 h-3" />
                  <span>{context.type}</span>
                </div>
                {context.size && (
                  <div className="flex items-center space-x-1">
                    <Database className="w-3 h-3" />
                    <span>{formatSize(context.size)}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(context.createdAt)}</span>
                </div>
              </div>

              {/* Usage stats */}
              {showUsage && (
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                  {context.usageCount && (
                    <span>{context.usageCount} uses</span>
                  )}
                  {context.lastUsed && (
                  <span>Last used {formatDate(context.lastUsed)}</span>
                )}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex items-center space-x-1 ml-3">
              {isHovered && !isTouchDevice && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex space-x-1"
                >
                  {onEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit()
                      }}
                      className="p-2 rounded hover:bg-gray-100 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                  {onShare && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onShare()
                      }}
                      className="p-2 rounded hover:bg-gray-100 transition-colors"
                      title="Share"
                    >
                      <Share className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </motion.div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMenu(!showMenu)
                }}
                className="p-2 rounded hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  // Desktop expanded card
  return (
    <motion.div
      className={cn(
        "bg-white rounded-lg border border-gray-200 p-5 cursor-pointer transition-all duration-200",
        "hover:border-gray-300 hover:shadow-md",
        className
      )}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      layout
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1 min-w-0">
          {/* Type Icon */}
          <div className={cn("p-3 rounded-xl flex-shrink-0", typeColorClass)}>
            <TypeIcon className="w-6 h-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {context.title}
              </h3>
              {context.tags && context.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 ml-3">
                  {context.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {context.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      +{context.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <p className="text-gray-600 mt-2 line-clamp-3">
              {context.description}
            </p>
            
            {/* Detailed metadata */}
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Tag className="w-4 h-4" />
                  <span>Type: {context.type}</span>
                </div>
                {context.size && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Database className="w-4 h-4" />
                    <span>Size: {formatSize(context.size)}</span>
                  </div>
                )}

              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Created: {formatDate(context.createdAt)}</span>
                </div>
                {context.lastUsed && (
                <div className="flex items-center space-x-2 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Last used: {formatDate(context.lastUsed)}</span>
                </div>
              )}
                {showUsage && context.usageCount && (
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>Used {context.usageCount} times</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Actions */}
        {showActions && (
          <div className="flex items-start space-x-2 ml-4">
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex space-x-2"
              >
                {onEdit && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit()
                    }}
                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    title="Edit Context"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {onShare && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onShare()
                    }}
                    className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                    title="Share Context"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    // Add download functionality
                  }}
                  className="p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </button>
              </motion.div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AdaptiveContextCard
export type { AdaptiveContextCardProps }