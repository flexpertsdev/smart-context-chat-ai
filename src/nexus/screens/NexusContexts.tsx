import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, Filter, Grid, List } from 'lucide-react'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import ContextCard from '../components/context/ContextCard'
import Button from '../foundations/Button'
import { Heading1, Body } from '../foundations/Typography'
import { useNavigate } from 'react-router-dom'

interface Context {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isFavorite?: boolean
  wordCount?: number
}

const NexusContexts: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Mock contexts
  const contexts: Context[] = [
    {
      id: '1',
      title: 'React Best Practices',
      content: 'A comprehensive guide to React development best practices including hooks, performance optimization, and component patterns.',
      category: 'Development',
      tags: ['react', 'frontend', 'javascript'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isFavorite: true,
      wordCount: 1250
    },
    {
      id: '2',
      title: 'TypeScript Configuration',
      content: 'Essential TypeScript configuration options and best practices for modern web applications.',
      category: 'Development',
      tags: ['typescript', 'config', 'tooling'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      wordCount: 850
    },
    {
      id: '3',
      title: 'API Design Guidelines',
      content: 'RESTful API design principles and patterns for building scalable web services.',
      category: 'Architecture',
      tags: ['api', 'rest', 'backend'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      wordCount: 2100
    },
    {
      id: '4',
      title: 'Project Roadmap Q1 2024',
      content: 'Quarterly objectives and key results for the product development team.',
      category: 'Planning',
      tags: ['roadmap', 'okr', 'planning'],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      isFavorite: true,
      wordCount: 1500
    }
  ]

  const categories = Array.from(new Set(contexts.map(c => c.category)))
  
  const filteredContexts = contexts.filter(context => {
    const matchesSearch = context.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         context.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         context.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = !selectedCategory || context.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleCreateContext = () => {
    navigate('/nexus/contexts/new')
  }

  const handleContextClick = (contextId: string) => {
    navigate(`/nexus/contexts/${contextId}`)
  }

  const toggleFavorite = (contextId: string) => {
    // Handle favorite toggle
    console.log('Toggle favorite:', contextId)
  }

  return (
    <AdaptiveLayout onNewChat={() => navigate('/nexus/chats/new')}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Heading1>Context Library</Heading1>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={handleCreateContext}
            >
              New Context
            </Button>
          </div>
          <Body color="secondary">
            {filteredContexts.length} contexts available
          </Body>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contexts..."
                className="w-full pl-10 pr-4 py-2 min-h-touch bg-gray-100 rounded-mobile touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              icon={<Filter className="w-4 h-4" />}
            >
              Filter
            </Button>
            
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Category Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="flex items-center gap-2 flex-wrap"
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  !selectedCategory
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Contexts Grid/List */}
        <div
          className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'space-y-3'
          }
        >
          {filteredContexts.map((context) => (
            <ContextCard
              key={context.id}
              context={context}
              onClick={() => handleContextClick(context.id)}
              onFavorite={() => toggleFavorite(context.id)}
              variant={viewMode === 'list' ? 'detailed' : 'compact'}
            />
          ))}
        </div>

        {filteredContexts.length === 0 && (
          <div className="text-center py-12">
            <Body color="secondary">No contexts found matching your search.</Body>
          </div>
        )}
      </div>
    </AdaptiveLayout>
  )
}

export default NexusContexts