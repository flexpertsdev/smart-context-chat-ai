
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, MessageSquare, Sparkles, Loader2 } from 'lucide-react'
import { Message } from '../../types'
import { useContextStore } from '../../stores/contextStore'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer'
import { Textarea } from '../ui/textarea'
import { contextCreationService } from '../../services/contextCreationService'
import { toast } from 'sonner'

interface CreateContextFromMessagesSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedMessages: Message[]
  onContextCreated: () => void
}

const CreateContextFromMessagesSheet = ({ 
  isOpen, 
  onClose, 
  selectedMessages, 
  onContextCreated 
}: CreateContextFromMessagesSheetProps) => {
  const { addContext } = useContextStore()
  const [customInstruction, setCustomInstruction] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const instructionSuggestions = [
    'Summarize the key points',
    'Focus on technical details',
    'Create a how-to guide',
    'Extract actionable insights',
    'Explain the concepts clearly',
    'List the main takeaways'
  ]

  const handleGenerate = async () => {
    if (selectedMessages.length === 0) return

    setIsGenerating(true)
    setError('')

    try {
      const newContext = await contextCreationService.createContextFromMessages({
        selectedMessages,
        userTitle: customInstruction.trim() || undefined
      })

      addContext(newContext)
      toast.success('Context created successfully!')
      onContextCreated()
      setCustomInstruction('')
    } catch (err) {
      console.error('Failed to generate context from messages:', err)
      setError(err.message || 'Failed to generate context')
      toast.error('Failed to create context')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            <span>Create Context from Messages</span>
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-4 space-y-4">
          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              {selectedMessages.length} Selected Messages
            </h4>
            <div className="text-xs text-gray-600 max-h-32 overflow-y-auto space-y-1">
              {selectedMessages.slice(0, 3).map((msg, idx) => (
                <div key={msg.id} className="bg-white rounded p-2">
                  <span className="font-medium">
                    {msg.type === 'user' ? 'You' : 'AI'}:
                  </span>{' '}
                  {msg.content.slice(0, 80)}...
                </div>
              ))}
              {selectedMessages.length > 3 && (
                <div className="text-gray-500 text-center py-1">
                  +{selectedMessages.length - 3} more messages...
                </div>
              )}
            </div>
          </div>

          {/* Custom Instruction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How should AI process these messages? (optional)
            </label>
            <Textarea
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="e.g., 'Summarize the key points', 'Focus on technical details', 'Create a how-to guide'..."
              className="w-full min-h-[60px] resize-none"
            />
          </div>

          {/* Instruction Suggestions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick suggestions:
            </label>
            <div className="flex flex-wrap gap-2">
              {instructionSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setCustomInstruction(suggestion)}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleGenerate}
              disabled={selectedMessages.length === 0 || isGenerating}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Context...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Create Context</span>
                </>
              )}
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

export default CreateContextFromMessagesSheet
