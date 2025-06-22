
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, X } from 'lucide-react'
import { useContextStore } from '../stores/contextStore'
import { useBreakpoints } from '../hooks/use-breakpoints'
import AdaptiveLayout from '../components/layout/AdaptiveLayout'
import AdaptiveContextCard from '../components/context/AdaptiveContextCard'
import FloatingActionButton from '../components/ui/FloatingActionButton'
import SortIcons from '../components/ui/SortIcons'
import CategoryFilterBar from '../components/ui/CategoryFilterBar'

type SortOption = 'recent' | 'alphabetical' | 'usage' | 'size'

const ContextLibrary = () => {
  const navigate = useNavigate()
  const { isMobile, isTablet, isDesktop } = useBreakpoints()
  const { 
    contexts: storeContexts, 
    searchContexts, 
    searchQuery, 
    filteredContexts,
    loadContextsFromStorage 
  } = useContextStore()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [isSearching, setIsSearching] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState('')

  useEffect(() => {
    loadContextsFromStorage()
  }, [loadContextsFromStorage])

  const categories = ['All', 'Knowledge', 'Document', 'Chat']
  
  const displayContexts = useMemo(() => {
    let contexts = localSearchQuery ? filteredContexts : storeContexts
    
    // Filter by category
    if (selectedCategory !== 'All') {
      contexts = contexts.filter(context => context.category === selectedCategory)
    }
    
    // Sort contexts
    const sorted = [...contexts].sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        case 'usage':
          return b.usageCount - a.usageCount
        case 'size':
          return b.size - a.size
        case 'recent':
        default:
          const aDate = typeof a.lastUsed === 'string' ? new Date(a.lastUsed) : a.lastUsed
          const bDate = typeof b.lastUsed === 'string' ? new Date(b.lastUsed) : b.lastUsed
          return bDate.getTime() - aDate.getTime()
      }
    })
    
    return sorted
  }, [filteredContexts, storeContexts, localSearchQuery, selectedCategory, sortBy])

  const handleSearch = (query: string) => {
    setLocalSearchQuery(query)
    if (query.trim()) {
      setIsSearching(true)
      searchContexts(query)
    } else {
      setIsSearching(false)
    }
  }

  const clearSearch = () => {
    setLocalSearchQuery('')
    setIsSearching(false)
  }

  const handleContextClick = (contextId: string) => {
    navigate(`/contexts/${contextId}`)
  }

  // Determine grid columns based on screen size
  const gridCols = isMobile ? 1 : isTablet ? 2 : 3
  const gridClass = `grid grid-cols-${gridCols} gap-4 lg:gap-6`

  return (
    <AdaptiveLayout
      headerProps={{ title: 'Context Library' }}
    >
      <div className="h-full bg-gray-50 flex flex-col">
        {/* Search Header */}
        <div className="flex-shrink-0">
          <motion.div
            className="bg-white border-b border-gray-200 px-4 py-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search contexts..."
                value={localSearchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {localSearchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>

            {/* Sort Icons */}
            <div className="flex items-center justify-between">
              <SortIcons currentSort={sortBy} onSortChange={setSortBy} />
              
              <div className="text-sm text-gray-500">
                {displayContexts.length} context{displayContexts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </motion.div>

          {/* Category Filter */}
          <CategoryFilterBar
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* Contexts Grid */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {displayContexts.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isSearching ? 'No contexts found' : 'No contexts yet'}
              </h3>
              <p className="text-gray-500 mb-4">
                {isSearching 
                  ? 'Try adjusting your search terms' 
                  : 'Create your first context to get started'
                }
              </p>
              {isSearching ? (
                <button
                  onClick={clearSearch}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Clear search
                </button>
              ) : (
                <button
                  onClick={() => navigate('/contexts/new')}
                  className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors"
                >
                  Create Context
                </button>
              )}
            </motion.div>
          ) : (
            <div className={gridClass}>
              {displayContexts.map((context, index) => (
                <motion.div
                  key={context.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <AdaptiveContextCard 
                    context={context} 
                    onClick={() => handleContextClick(context.id)}
                    showUsage={true}
                    showActions={true}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <FloatingActionButton 
          onClick={() => navigate('/contexts/new')}
          icon={<Plus className="w-6 h-6" />}
        />
      </div>
    </AdaptiveLayout>
  )
}

export default ContextLibrary
