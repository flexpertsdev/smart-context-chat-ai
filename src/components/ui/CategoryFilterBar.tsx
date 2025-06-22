
import React from 'react'
import { motion } from 'framer-motion'

interface CategoryFilterBarProps {
  categories: string[]
  selectedCategory: string
  onCategorySelect: (category: string) => void
  className?: string
}

const CategoryFilterBar: React.FC<CategoryFilterBarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  className = ""
}) => {
  return (
    <div className={`bg-white border-b border-gray-100 px-4 py-2 ${className}`}>
      <div className="flex space-x-1 overflow-x-auto scrollbar-hidden">
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilterBar
