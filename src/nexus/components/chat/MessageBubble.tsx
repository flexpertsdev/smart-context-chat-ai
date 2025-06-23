import React from 'react'
import { motion } from 'framer-motion'
import { Check, CheckCheck, Clock } from 'lucide-react'
import { Caption } from '../../foundations/Typography'

interface MessageBubbleProps {
  message: {
    id: string
    content: string
    sender: 'user' | 'ai'
    timestamp: Date
    status?: 'sending' | 'sent' | 'delivered' | 'read'
    isThinking?: boolean
  }
  showAvatar?: boolean
  isGrouped?: boolean
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  showAvatar = true,
  isGrouped = false
}) => {
  const isUser = message.sender === 'user'

  const statusIcon = () => {
    if (!isUser) return null
    
    switch (message.status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-gray-400" />
      case 'read':
        return <CheckCheck className="w-3 h-3 text-green-500" />
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isGrouped ? 'mt-1' : 'mt-4'}`}
    >
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%] gap-2`}>
        {showAvatar && !isUser && !isGrouped && (
          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-medium">AI</span>
          </div>
        )}
        
        <div className={`${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
          <div
            className={`
              px-4 py-2 rounded-2xl 
              ${isUser 
                ? 'bg-green-500 text-white rounded-br-md' 
                : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
              }
              ${message.isThinking ? 'min-w-[60px]' : ''}
            `}
          >
            {message.isThinking ? (
              <div className="flex gap-1 py-1">
                <motion.div
                  className="w-2 h-2 bg-current rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="w-2 h-2 bg-current rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-current rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            )}
          </div>
          
          {!isGrouped && (
            <div className={`flex items-center gap-1 mt-1 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <Caption className="text-gray-500">
                {formatTime(message.timestamp)}
              </Caption>
              {statusIcon()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default MessageBubble