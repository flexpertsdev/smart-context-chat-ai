import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles } from 'lucide-react'
import { Caption } from '../../foundations/Typography'

interface ThinkingIndicatorProps {
  variant?: 'inline' | 'overlay' | 'minimal'
  text?: string
  showIcon?: boolean
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  variant = 'inline',
  text = 'AI is thinking...',
  showIcon = true
}) => {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Brain className="w-4 h-4 text-green-500" />
        </motion.div>
        <Caption className="text-green-600">{text}</Caption>
      </div>
    )
  }

  if (variant === 'overlay') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-6 shadow-xl max-w-sm mx-4"
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0"
              >
                <Sparkles className="w-16 h-16 text-green-400" />
              </motion.div>
              <Brain className="w-16 h-16 text-green-600 relative z-10" />
            </div>
            
            <h3 className="text-lg font-semibold mb-2">{text}</h3>
            
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ 
                    y: [0, -10, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    )
  }

  // Default inline variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-green-50 border border-green-200 rounded-lg p-3"
    >
      <div className="flex items-center gap-3">
        {showIcon && (
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0"
            >
              <div className="w-8 h-8 rounded-full border-2 border-green-300 border-t-transparent" />
            </motion.div>
            <Brain className="w-8 h-8 text-green-600 relative z-10" />
          </div>
        )}
        
        <div className="flex-1">
          <p className="text-green-900 font-medium">{text}</p>
          <div className="flex items-center gap-2 mt-1">
            <motion.div
              className="h-1 bg-green-300 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ maxWidth: '200px' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ThinkingIndicator