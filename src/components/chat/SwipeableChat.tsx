
import React, { useState, useRef } from 'react'
import { motion, PanInfo } from 'framer-motion'
import { MessageCircle, Trash2, Tag, Archive } from 'lucide-react'
import { Chat } from '../../types'
import DeleteConfirmationSheet from './DeleteConfirmationSheet'

interface SwipeableChatProps {
  chat: Chat
  onNavigate: () => void
  onDelete: () => void
  onAddTag: () => void
  onArchive: () => void
  formatLastActivity: (date: Date | string | undefined) => string
}

const SwipeableChat: React.FC<SwipeableChatProps> = ({
  chat,
  onNavigate,
  onDelete,
  onAddTag,
  onArchive,
  formatLastActivity
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragX, setDragX] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const constraintsRef = useRef(null)

  const handleDragStart = () => {
    if (isLocked) return
    setIsDragging(true)
  }

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (isLocked) return
    
    setIsDragging(false)
    
    const threshold = -80
    if (info.offset.x < threshold * 2) {
      // Lock in the open position
      setDragX(-192)
      setIsLocked(true)
    } else {
      // Reset position
      setDragX(0)
    }
  }

  const handleDrag = (event: any, info: PanInfo) => {
    if (isLocked) return
    setDragX(info.offset.x)
  }

  const handleAction = (action: 'tag' | 'archive' | 'delete') => {
    if (action === 'delete') {
      setShowDeleteConfirmation(true)
    } else if (action === 'tag') {
      onAddTag()
      resetPosition()
    } else if (action === 'archive') {
      onArchive()
      resetPosition()
    }
  }

  const resetPosition = () => {
    setDragX(0)
    setIsLocked(false)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (isLocked && e.target === e.currentTarget) {
      resetPosition()
    }
  }

  const handleDeleteConfirm = () => {
    onDelete()
    resetPosition()
  }

  // Ensure tags is always an array
  const tags = chat.tags || []

  // Calculate how much of the actions should be revealed
  const actionWidth = Math.min(Math.abs(dragX), 192)

  return (
    <>
      <div 
        className="relative overflow-hidden bg-white border-b border-gray-100"
        onClick={handleBackdropClick}
      >
        {/* Action buttons - fixed position, revealed by drag */}
        <div 
          className="absolute right-0 top-0 h-full flex items-center z-0"
          style={{ 
            transform: `translateX(${192 - actionWidth}px)`,
            opacity: actionWidth > 20 ? 1 : 0,
            transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease'
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('tag')
            }}
            className="h-full w-16 bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors"
          >
            <Tag className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('archive')
            }}
            className="h-full w-16 bg-yellow-500 text-white flex items-center justify-center hover:bg-yellow-600 transition-colors"
          >
            <Archive className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleAction('delete')
            }}
            className="h-full w-16 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Chat item */}
        <motion.div
          ref={constraintsRef}
          drag={!isLocked ? "x" : false}
          dragConstraints={{ left: -192, right: 0 }}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDrag={handleDrag}
          onClick={!isDragging && !isLocked ? onNavigate : undefined}
          className={`px-4 py-4 cursor-pointer transition-colors relative z-10 bg-white ${
            !isDragging && !isLocked ? 'hover:bg-gray-50' : ''
          }`}
          style={{
            transform: `translateX(${Math.max(dragX, -192)}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease'
          }}
          whileTap={{ scale: isDragging || isLocked ? 1 : 0.99 }}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 truncate">{chat.title}</h3>
                <span className="text-xs text-gray-500">
                  {formatLastActivity(chat.lastActivity)}
                </span>
              </div>
              
              {chat.lastMessage && (
                <p className="text-sm text-gray-600 truncate mt-1">
                  {chat.lastMessage.content}
                </p>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {chat.unreadCount > 0 && (
              <div className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {chat.unreadCount}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <DeleteConfirmationSheet
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteConfirm}
        chatTitle={chat.title}
      />
    </>
  )
}

export default SwipeableChat
