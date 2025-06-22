
import React from 'react'
import { motion } from 'framer-motion'
import { Check, CheckCheck, Clock } from 'lucide-react'
import { Message } from '../../types'
import ThinkingIndicator from '../ai/ThinkingIndicator'

interface ChatBubbleProps {
  message: Message
  onThinkingClick?: () => void
  isSelected?: boolean
  onSelect?: () => void
  selectionMode?: boolean
}

const ChatBubble = ({ 
  message, 
  onThinkingClick, 
  isSelected = false, 
  onSelect, 
  selectionMode = false 
}: ChatBubbleProps) => {
  const isUser = message.type === 'user'
  const isAI = message.type === 'ai'

  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-gray-400" />
      case 'sent':
        return <Check className="w-3 h-3 text-gray-400" />
      case 'delivered':
      case 'read':
        return <CheckCheck className="w-3 h-3 text-blue-500" />
      default:
        return null
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(new Date(date))
  }

  const handleClick = () => {
    if (selectionMode && onSelect) {
      onSelect()
    }
  }

  return (
    <motion.div
      className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
    >
      {/* AI Avatar */}
      {isAI && (
        <div className="w-8 h-8 mr-3 flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center border border-green-200 shadow-sm">
            <img 
              src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/flexpertsdev-pb6ym6/assets/me6dq415a2oq/askflexiRightTransparent500.png" 
              alt="WhatsFLEX AI Assistant" 
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>
      )}

      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'} relative`}>
        {/* Selection checkbox */}
        {selectionMode && (
          <div className={`absolute -top-2 ${isUser ? '-left-8' : '-right-8'} z-10`}>
            <motion.div
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                isSelected 
                  ? 'bg-green-600 border-green-600' 
                  : 'bg-white border-gray-300'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isSelected && <Check className="w-4 h-4 text-white" />}
            </motion.div>
          </div>
        )}

        {/* Message Bubble */}
        <motion.div
          className={`relative px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-green-600 text-white rounded-br-md'
              : 'bg-white text-gray-900 shadow-sm rounded-bl-md border border-gray-100'
          } ${selectionMode ? 'cursor-pointer' : ''} ${
            isSelected ? 'ring-2 ring-green-500' : ''
          }`}
          layout
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          
          {/* Message Info */}
          <div className={`flex items-center justify-between mt-2 space-x-2 ${
            isUser ? 'text-green-100' : 'text-gray-400'
          }`}>
            <span className="text-xs">
              {formatTime(message.timestamp)}
            </span>
            
            <div className="flex items-center space-x-1">
              {isAI && message.aiThinking && onThinkingClick && (
                <ThinkingIndicator
                  confidence={message.aiThinking.confidenceLevel}
                  hasThinking={true}
                  onClick={onThinkingClick}
                />
              )}
              {isUser && getStatusIcon()}
            </div>
          </div>
        </motion.div>

        {/* AI Thinking Summary (if available) */}
        {isAI && message.aiThinking && (
          <motion.div
            className="mt-2 text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="bg-gray-100 px-2 py-1 rounded-full">
              {message.aiThinking.assumptions.length} assumptions • {message.aiThinking.reasoningChain.length} steps
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ChatBubble
