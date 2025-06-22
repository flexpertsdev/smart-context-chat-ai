
import React from 'react'
import { motion } from 'framer-motion'

type SortOption = 'recent' | 'alphabetical' | 'usage' | 'size'

interface SortIconsProps {
  currentSort: SortOption
  onSortChange: (sort: SortOption) => void
}

const SortIcons = ({ currentSort, onSortChange }: SortIconsProps) => {
  const sortOptions = [
    { key: 'recent' as const, label: 'Recent', icon: '🕒' },
    { key: 'alphabetical' as const, label: 'A-Z', icon: '🔤' },
    { key: 'usage' as const, label: 'Usage', icon: '📊' },
    { key: 'size' as const, label: 'Size', icon: '📏' }
  ]

  return (
    <div className="flex items-center space-x-1">
      {sortOptions.map((option) => (
        <motion.button
          key={option.key}
          onClick={() => onSortChange(option.key)}
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-colors ${
            currentSort === option.key
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-lg">{option.icon}</span>
          <span className="text-xs font-medium mt-0.5">{option.label}</span>
        </motion.button>
      ))}
    </div>
  )
}

export default SortIcons
