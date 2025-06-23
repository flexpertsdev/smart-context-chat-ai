import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Sparkles, Save, X } from 'lucide-react'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import Card from '../foundations/Card'
import Button from '../foundations/Button'
import { Heading1, Heading3, Body, Caption } from '../foundations/Typography'
import { useNexusChatStore } from '../stores/nexusChatStore'
import { NexusMessage } from '../services/anthropicClient'

const NexusContextGeneration: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { addContext } = useNexusChatStore()
  
  // Get selected messages from navigation state
  const selectedMessages = (location.state?.messages || []) as NexusMessage[]
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('General')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate initial content from messages
  React.useEffect(() => {
    if (selectedMessages.length > 0) {
      const generatedContent = selectedMessages
        .map(msg => `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.content}`)
        .join('\n\n')
      setContent(generatedContent)
    }
  }, [selectedMessages])

  const handleGenerateContext = async () => {
    setIsGenerating(true)
    
    // Simulate AI generation (in real app, would call AI service)
    setTimeout(() => {
      // Generate a title based on content
      const words = content.split(' ').slice(0, 5).join(' ')
      setTitle(`Context: ${words}...`)
      
      // Generate description
      setDescription('Generated context from chat conversation')
      
      // Suggest tags based on content
      const suggestedTags = ['conversation', 'generated']
      setTags(suggestedTags)
      
      setIsGenerating(false)
    }, 1500)
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      return
    }

    const newContext = {
      id: `ctx-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      content: content.trim(),
      category,
      tags
    }

    addContext(newContext)
    navigate('/nexus/contexts')
  }

  const categories = ['General', 'Development', 'Reference', 'Planning', 'Personal']

  return (
    <AdaptiveLayout 
      mobileProps={{ showHeader: false, showBottomNav: false }}
      desktopProps={{ showSidebar: true }}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <Heading1>Generate Context</Heading1>
            <Caption>Create a reusable context from your conversation</Caption>
          </div>
        </div>

        {/* Selected Messages Preview */}
        {selectedMessages.length > 0 && (
          <Card padding="md" className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Caption>Selected Messages</Caption>
              <Caption>{selectedMessages.length} messages</Caption>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {selectedMessages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <span className="font-medium">
                    {msg.sender === 'user' ? 'You: ' : 'AI: '}
                  </span>
                  <span className="text-gray-600 line-clamp-1">
                    {msg.content}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* AI Generation Button */}
        <div className="mb-6">
          <Button
            variant="secondary"
            fullWidth
            icon={<Sparkles className="w-4 h-4" />}
            onClick={handleGenerateContext}
            disabled={isGenerating || !content}
          >
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </Button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter context title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this context"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-green-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add a tag"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Button
                variant="secondary"
                onClick={handleAddTag}
                disabled={!tagInput.trim()}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Context content"
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
            className="flex-1"
          >
            Save Context
          </Button>
        </div>
      </div>
    </AdaptiveLayout>
  )
}

export default NexusContextGeneration