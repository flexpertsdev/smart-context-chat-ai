import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, MoreVertical, Phone, Video, Search } from 'lucide-react'
import { Heading4, Caption } from '../../foundations/Typography'

interface ChatHeaderProps {
  title: string
  subtitle?: string
  avatar?: string
  onBack?: () => void
  onMenuClick?: () => void
  onCallClick?: () => void
  onVideoClick?: () => void
  onSearchClick?: () => void
  showActions?: boolean
  isOnline?: boolean
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  title,
  subtitle,
  avatar,
  onBack,
  onMenuClick,
  onCallClick,
  onVideoClick,
  onSearchClick,
  showActions = true,
  isOnline = false
}) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-gray-200 px-4 py-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          
          {avatar ? (
            <img
              src={avatar}
              alt={title}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <span className="text-white font-medium">
                {title.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          
          <div className="flex-1">
            <Heading4 className="leading-tight">{title}</Heading4>
            {subtitle && (
              <Caption>
                {isOnline && (
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1" />
                )}
                {subtitle}
              </Caption>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="flex items-center gap-1">
            {onSearchClick && (
              <button
                onClick={onSearchClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            )}
            {onVideoClick && (
              <button
                onClick={onVideoClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Video className="w-5 h-5 text-gray-600" />
              </button>
            )}
            {onCallClick && (
              <button
                onClick={onCallClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
            )}
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        )}
      </div>
    </motion.header>
  )
}

export default ChatHeader