import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Edit3, Save, X, Tag, Calendar, FileText, Star, Trash2 } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import Card from '../foundations/Card'
import Button from '../foundations/Button'
import { Heading1, Heading3, Body, Caption } from '../foundations/Typography'

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

const NexusContextDetails: React.FC = () => {
  const { contextId } = useParams()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContext, setEditedContext] = useState<Context | null>(null)
  const [newTag, setNewTag] = useState('')

  // Mock context data
  const context: Context = {
    id: contextId || '1',
    title: 'React Best Practices',
    content: `## React Best Practices Guide

### 1. Component Structure
- Keep components small and focused on a single responsibility
- Use functional components with hooks
- Extract reusable logic into custom hooks

### 2. State Management
- Use local state for UI-only concerns
- Lift state up when needed by multiple components
- Consider Context API for cross-cutting concerns
- Use state management libraries for complex applications

### 3. Performance Optimization
- Use React.memo for expensive renders
- Implement useMemo and useCallback appropriately
- Lazy load components and routes
- Optimize bundle size with code splitting

### 4. Code Organization
- Group related files together
- Use consistent naming conventions
- Keep a clear folder structure
- Separate concerns (components, hooks, utils, services)

### 5. Testing
- Write unit tests for utility functions
- Use React Testing Library for component tests
- Test user interactions, not implementation details
- Maintain good test coverage`,
    category: 'Development',
    tags: ['react', 'frontend', 'javascript', 'best-practices'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isFavorite: true,
    wordCount: 1250
  }

  const handleEdit = () => {
    setEditedContext(context)
    setIsEditing(true)
  }

  const handleSave = () => {
    // Save logic here
    console.log('Saving context:', editedContext)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedContext(null)
    setIsEditing(false)
  }

  const handleAddTag = () => {
    if (newTag.trim() && editedContext) {
      setEditedContext({
        ...editedContext,
        tags: [...editedContext.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    if (editedContext) {
      setEditedContext({
        ...editedContext,
        tags: editedContext.tags.filter(tag => tag !== tagToRemove)
      })
    }
  }

  const handleToggleFavorite = () => {
    if (isEditing && editedContext) {
      setEditedContext({
        ...editedContext,
        isFavorite: !editedContext.isFavorite
      })
    }
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this context?')) {
      console.log('Deleting context:', context.id)
      navigate('/nexus/contexts')
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const displayContext = isEditing && editedContext ? editedContext : context

  return (
    <AdaptiveLayout onNewChat={() => navigate('/nexus/chats/new')}>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/nexus/contexts')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedContext?.title || ''}
                  onChange={(e) => setEditedContext(prev => prev ? {...prev, title: e.target.value} : null)}
                  className="text-3xl font-bold w-full bg-transparent border-b-2 border-blue-500 focus:outline-none"
                />
              ) : (
                <Heading1>{displayContext.title}</Heading1>
              )}
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="primary"
                    icon={<Save className="w-4 h-4" />}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    icon={<X className="w-4 h-4" />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    icon={<Edit3 className="w-4 h-4" />}
                    onClick={handleEdit}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    icon={<Star className={`w-4 h-4 ${displayContext.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />}
                    onClick={handleToggleFavorite}
                  />
                  <Button
                    variant="ghost"
                    icon={<Trash2 className="w-4 h-4 text-red-500" />}
                    onClick={handleDelete}
                  />
                </>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <Caption>{displayContext.category}</Caption>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <Caption>Updated {formatDate(displayContext.updatedAt)}</Caption>
            </div>
            <Caption>{displayContext.wordCount} words</Caption>
          </div>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card padding="md">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-gray-600" />
              <Heading3>Tags</Heading3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {displayContext.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="Add tag..."
                    className="px-3 py-1 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddTag}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card padding="lg">
            {isEditing ? (
              <textarea
                value={editedContext?.content || ''}
                onChange={(e) => setEditedContext(prev => prev ? {...prev, content: e.target.value} : null)}
                className="w-full min-h-[500px] bg-transparent resize-none focus:outline-none font-mono text-sm"
                placeholder="Enter context content..."
              />
            ) : (
              <div className="prose prose-gray max-w-none">
                <div className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                  {displayContext.content}
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Actions */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 flex items-center justify-center gap-4"
          >
            <Button
              variant="primary"
              onClick={() => navigate(`/nexus/chats/new?context=${context.id}`)}
            >
              Use in New Chat
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(context.content)
                alert('Context copied to clipboard!')
              }}
            >
              Copy to Clipboard
            </Button>
          </motion.div>
        )}
      </div>
    </AdaptiveLayout>
  )
}

export default NexusContextDetails