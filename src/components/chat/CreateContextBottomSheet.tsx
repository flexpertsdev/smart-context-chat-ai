
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, FileText, MessageSquare } from 'lucide-react'
import { Message } from '../../types'
import { useContextStore } from '../../stores/contextStore'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer'
import { Textarea } from '../ui/textarea'

interface CreateContextBottomSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedMessages: Message[]
  onContextCreated: () => void
}

const CreateContextBottomSheet = ({ 
  isOpen, 
  onClose, 
  selectedMessages, 
  onContextCreated 
}: CreateContextBottomSheetProps) => {
  const { addContext } = useContextStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Conversation')
  const [tags, setTags] = useState('')

  const generateContent = () => {
    return selectedMessages
      .map(msg => `${msg.type === 'user' ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n\n')
  }

  const handleCreate = () => {
    if (!title.trim()) return

    const content = generateContent()
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean)
    const now = new Date()

    addContext({
      title: title.trim(),
      description: description.trim() || `Context created from ${selectedMessages.length} messages`,
      content,
      type: 'chat',
      tags: tagArray,
      category,
      size: content.length,
      usageCount: 0,
      lastUsed: now,
      isPrivate: false,
      autoSuggest: true,
      createdAt: now,
      updatedAt: now
    })

    onContextCreated()
    
    // Reset form
    setTitle('')
    setDescription('')
    setCategory('Conversation')
    setTags('')
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Create Context from Messages</span>
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-4 space-y-4">
          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {selectedMessages.length} Selected Messages
            </h4>
            <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
              {selectedMessages.slice(0, 2).map((msg, idx) => (
                <div key={msg.id} className="mb-1">
                  <span className="font-medium">
                    {msg.type === 'user' ? 'You' : 'AI'}:
                  </span>{' '}
                  {msg.content.slice(0, 50)}...
                </div>
              ))}
              {selectedMessages.length > 2 && (
                <div className="text-gray-500">
                  +{selectedMessages.length - 2} more messages...
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter context title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what this context contains..."
                className="w-full min-h-[60px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Conversation">Conversation</option>
                  <option value="Development">Development</option>
                  <option value="AI">AI</option>
                  <option value="Learning">Learning</option>
                  <option value="Project">Project</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="tag1, tag2, tag3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleCreate}
              disabled={!title.trim()}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Context
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default CreateContextBottomSheet
