
import React from 'react'
import { motion } from 'framer-motion'

const TypingIndicator = () => {
  return (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="max-w-[80%]">
        <div className="bg-white text-gray-900 shadow-sm rounded-2xl rounded-bl-md border border-gray-100 px-4 py-3">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-500">AI is thinking</span>
            <div className="flex space-x-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-gray-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
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
        </div>
      </div>
    </motion.div>
  )
}

export default TypingIndicator
