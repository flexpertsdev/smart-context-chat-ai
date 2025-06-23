import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, X, Plus, Check } from 'lucide-react'
import Button from '../../foundations/Button'
import { Body, Caption } from '../../foundations/Typography'

interface Context {
  id: string
  title: string
  category: string
  tags: string[]
}

interface ContextSelectorProps {
  contexts: Context[]
  selectedContexts: string[]
  onToggleContext: (contextId: string) => void
  onSelectAll?: () => void
  onClearAll?: () => void
  placeholder?: string
  maxSelections?: number
  showCategories?: boolean
}

const ContextSelector: React.FC<ContextSelectorProps> = ({
  contexts,
  selectedContexts,
  onToggleContext,
  onSelectAll,
  onClearAll,
  placeholder = 'Search contexts...',
  maxSelections,
  showCategories = true
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const categories = Array.from(new Set(contexts.map(c => c.category)))
  
  const filteredContexts = contexts.filter(context => {
    const matchesSearch = context.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         context.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = !selectedCategory || context.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const isSelected = (contextId: string) => selectedContexts.includes(contextId)
  const canSelectMore = !maxSelections || selectedContexts.length < maxSelections

  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-10 pr-10 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="w-4 h-4" />}
          >
            Filter
          </Button>
        </div>
        
        {/* Filter Options */}
        <AnimatePresence>
          {showFilters && showCategories && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 flex-wrap pt-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    !selectedCategory
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Selection Actions */}
        <div className="flex items-center justify-between mt-3">
          <Caption>
            {selectedContexts.length} of {contexts.length} selected
            {maxSelections && ` (max ${maxSelections})`}
          </Caption>
          
          <div className="flex items-center gap-2">
            {onSelectAll && (
              <button
                onClick={onSelectAll}
                className="text-sm text-green-600 hover:text-green-700"
                disabled={!canSelectMore}
              >
                Select All
              </button>
            )}
            {onClearAll && selectedContexts.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Context List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {filteredContexts.map(context => {
            const selected = isSelected(context.id)
            const disabled = !selected && !canSelectMore
            
            return (
              <motion.button
                key={context.id}
                onClick={() => !disabled && onToggleContext(context.id)}
                disabled={disabled}
                className={`w-full p-3 rounded-lg border transition-all text-left ${
                  selected
                    ? 'border-green-500 bg-green-50'
                    : disabled
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                whileHover={!disabled ? { scale: 1.02 } : undefined}
                whileTap={!disabled ? { scale: 0.98 } : undefined}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <Body className={selected ? 'text-green-900' : ''}>
                      {context.title}
                    </Body>
                    <Caption className={selected ? 'text-green-700' : 'text-gray-500'}>
                      {context.category}
                    </Caption>
                    {context.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {context.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`px-1.5 py-0.5 rounded text-xs ${
                              selected
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selected
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300'
                  }`}>
                    {selected && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
        
        {filteredContexts.length === 0 && (
          <div className="text-center py-8">
            <Caption>No contexts found</Caption>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContextSelector