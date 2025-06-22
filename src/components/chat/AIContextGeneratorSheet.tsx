
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Sparkles, FileText, MessageSquare, Loader2 } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '../ui/drawer'
import { Textarea } from '../ui/textarea'
import { useContextStore } from '../../stores/contextStore'
import { supabase } from '../../integrations/supabase/client'

interface AIContextGeneratorSheetProps {
  isOpen: boolean
  onClose: () => void
  onContextCreated: () => void
}

const AIContextGeneratorSheet = ({ 
  isOpen, 
  onClose, 
  onContextCreated 
}: AIContextGeneratorSheetProps) => {
  const { addContext } = useContextStore()
  const [prompt, setPrompt] = useState('')
  const [customInstruction, setCustomInstruction] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const suggestions = [
    'Beginner Spanish vocabulary',
    'React best practices',
    'Stripe API documentation',
    'Machine learning basics',
    'CSS Grid layout guide',
    'JavaScript array methods'
  ]

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setError('')

    try {
      const { data, error } = await supabase.functions.invoke('generate-context', {
        body: {
          mode: 'from_prompt',
          prompt: prompt.trim(),
          customInstruction: customInstruction.trim() || undefined
        }
      })

      if (error) throw error

      if (data?.context) {
        addContext(data.context)
        onContextCreated()
        setPrompt('')
        setCustomInstruction('')
      } else {
        throw new Error('No context data received')
      }
    } catch (err) {
      console.error('Failed to generate context:', err)
      setError(err.message || 'Failed to generate context')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>Generate Context with AI</span>
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-4 space-y-4">
          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to create?
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Beginner Spanish vocabulary', 'React best practices', 'Stripe API documentation'..."
              className="w-full min-h-[80px] resize-none"
            />
          </div>

          {/* Suggestions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick suggestions:
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instruction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional instructions (optional)
            </label>
            <Textarea
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="e.g., 'Focus on practical examples', 'Include code snippets', 'Beginner-friendly explanations'..."
              className="w-full min-h-[60px] resize-none"
            />
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
              disabled={!prompt.trim() || isGenerating}
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Context</span>
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

export default AIContextGeneratorSheet
