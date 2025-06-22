
import React from 'react'
import { motion } from 'framer-motion'
import { Brain } from 'lucide-react'

interface ThinkingIndicatorProps {
  confidence: 'high' | 'medium' | 'low'
  hasThinking: boolean
  onClick: () => void
}

const ThinkingIndicator = ({ confidence, hasThinking, onClick }: ThinkingIndicatorProps) => {
  const getConfidenceColor = () => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (!hasThinking) return null

  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor()}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <Brain className="w-3 h-3" />
      <span>AI Thinking</span>
    </motion.button>
  )
}

export default ThinkingIndicator
