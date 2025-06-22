
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, Database, MessageSquare, X, Tag as TagIcon, Sparkles } from 'lucide-react'
import { useContextStore } from '../stores/contextStore'
import { Context } from '../types'
import AIContextGeneratorSheet from '../components/chat/AIContextGeneratorSheet'

const CreateContext = () => {
  const navigate = useNavigate()
  const { addContext } = useContextStore()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState<Context['type']>('knowledge')
  const [category, setCategory] = useState('General')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [autoSuggest, setAutoSuggest] = useState(true)
  const [showAIGenerator, setShowAIGenerator] = useState(false)

  const contextTypes = [
    { id: 'knowledge', label: 'Knowledge', icon: Database, description: 'Facts, concepts, and information' },
    { id: 'document', label: 'Document', icon: FileText, description: 'Files, articles, and references' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, description: 'Conversation history and examples' }
  ]

  const categories = ['General', 'Development', 'AI', 'Business', 'Science', 'Personal']

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return

    const newContext = {
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      type,
      tags,
      category,
      size: new Blob([content]).size,
      usageCount: 0,
      lastUsed: new Date(),
      isPrivate,
      autoSuggest,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const context = addContext(newContext)
    navigate('/contexts')
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <motion.div
        className="bg-white border-b border-gray-200 px-4 py-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Create Context</h2>
          <div className="flex space-x-2">
            <motion.button
              onClick={() => setShowAIGenerator(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Generate</span>
            </motion.button>
            <motion.button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                title.trim() && content.trim()
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={{ scale: title.trim() && content.trim() ? 1.05 : 1 }}
              whileTap={{ scale: title.trim() && content.trim() ? 0.95 : 1 }}
            >
              Create
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Context Type Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-3">Context Type</label>
          <div className="grid grid-cols-1 gap-3">
            {contextTypes.map((contextType) => {
              const Icon = contextType.icon
              return (
                <motion.button
                  key={contextType.id}
                  onClick={() => setType(contextType.id as Context['type'])}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    type === contextType.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-6 h-6 ${type === contextType.id ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="font-semibold text-gray-900">{contextType.label}</h3>
                      <p className="text-sm text-gray-500">{contextType.description}</p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this context..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter the context content..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </motion.div>

        {/* Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </motion.div>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add tags..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <motion.button
                onClick={handleAddTag}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add
              </motion.button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <motion.div
                    key={tag}
                    className="flex items-center space-x-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <TagIcon className="w-3 h-3" />
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-blue-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Settings */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <h3 className="text-sm font-medium text-gray-700">Settings</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Auto-suggest</h4>
              <p className="text-sm text-gray-500">Allow AI to automatically suggest this context</p>
            </div>
            <button
              onClick={() => setAutoSuggest(!autoSuggest)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoSuggest ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoSuggest ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Private</h4>
              <p className="text-sm text-gray-500">Only visible to you</p>
            </div>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isPrivate ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPrivate ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>
      </div>

      {/* AI Generator Sheet */}
      <AIContextGeneratorSheet
        isOpen={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
        onContextCreated={() => {
          setShowAIGenerator(false)
          navigate('/contexts')
        }}
      />
    </div>
  )
}

export default CreateContext
