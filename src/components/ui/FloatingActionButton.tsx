
import React from 'react'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'

interface FloatingActionButtonProps {
  onClick: () => void
  icon?: React.ReactNode
  className?: string
}

const FloatingActionButton = ({ 
  onClick, 
  icon = <Plus className="w-6 h-6" />,
  className = ""
}: FloatingActionButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className={`fixed bottom-20 right-4 bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-colors z-50 ${className}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 0.3 
      }}
    >
      {icon}
    </motion.button>
  )
}

export default FloatingActionButton
