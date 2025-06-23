import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Clock, Tag, MoreHorizontal, Star } from 'lucide-react'
import Card from '../../foundations/Card'
import { Heading4, Body, Caption } from '../../foundations/Typography'

interface ContextCardProps {
  context: {
    id: string
    title: string
    content: string
    category: string
    tags: string[]
    createdAt: Date
    updatedAt: Date
    isFavorite?: boolean
    wordCount?: number
  }
  onClick?: () => void
  onFavorite?: () => void
  onMenu?: () => void
  variant?: 'compact' | 'detailed'
}

const ContextCard: React.FC<ContextCardProps> = ({
  context,
  onClick,
  onFavorite,
  onMenu,
  variant = 'compact'
}) => {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  return (
    <Card
      onClick={onClick}
      hoverable
      padding={variant === 'compact' ? 'sm' : 'md'}
      className="relative group"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Heading4 className="truncate flex-1">{context.title}</Heading4>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onFavorite && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation()
                    onFavorite()
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <Star 
                    className={`w-4 h-4 ${context.isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`}
                  />
                </motion.button>
              )}
              {onMenu && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onMenu()
                  }}
                  className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          
          {variant === 'detailed' && (
            <Body className="text-gray-600 line-clamp-2 mb-3">
              {context.content}
            </Body>
          )}
          
          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              <Caption>{context.category}</Caption>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <Caption>{formatDate(context.updatedAt)}</Caption>
            </div>
            
            {context.wordCount && (
              <Caption>{context.wordCount} words</Caption>
            )}
          </div>
          
          {context.tags.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <Tag className="w-3 h-3 text-gray-400" />
              {context.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default ContextCard