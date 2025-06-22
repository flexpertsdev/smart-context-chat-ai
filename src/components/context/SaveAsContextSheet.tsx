import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, Sparkles, MessageSquare, FileText, Brain } from 'lucide-react'
import { Message } from '../../types'
import { contextCreationService } from '../../services/contextCreationService'
import { useContextStore } from '../../stores/contextStore'

interface SaveAsContextSheetProps {
  isOpen: boolean
  onClose: () => void
  selectedMessages: Message[]
  onContextCreated?: () => void
}

const SaveAsContextSheet = ({ isOpen, onClose, selectedMessages, onContextCreated }: SaveAsContextSheetProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'preview' | 'customize' | 'saving' | 'success'>('preview')
  const [customTitle, setCustomTitle] = useState('')
  const [customDescription, setCustomDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('knowledge')
  const [generatedPreview, setGeneratedPreview] = useState<any>(null)
  
  const { addContext } = useContextStore()

  const categories = [
    { id: 'knowledge', label: 'Knowledge', icon: Brain, description: 'Facts, concepts, and explanations' },
    { id: 'reference', label: 'Reference', icon: FileText, description: 'Documentation and guides' },
    { id: 'example', label: 'Example', icon: MessageSquare, description: 'Examples and use cases' },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: Sparkles, description: 'Solutions and fixes' }
  ]

  const handleQuickSave = async () => {
    setIsLoading(true)
    setStep('saving')
    
    try {
      const newContext = await contextCreationService.createContextFromMessages({
        selectedMessages
      })
      
      await addContext(newContext)
      setStep('success')
      
      setTimeout(() => {
        onContextCreated?.()
        handleClose()
      }, 1500)
      
    } catch (error) {
      console.error('Error creating context:', error)
      setIsLoading(false)
      setStep('preview')
    }
  }

  const handleCustomSave = async () => {
    setIsLoading(true)
    setStep('saving')
    
    try {
      const newContext = await contextCreationService.createContextFromMessages({
        selectedMessages,
        userTitle: customTitle,
        userDescription: customDescription,
        category: selectedCategory
      })
      
      await addContext(newContext)
      setStep('success')
      
      setTimeout(() => {
        onContextCreated?.()
        handleClose()
      }, 1500)
      
    } catch (error) {
      console.error('Error creating context:', error)
      setIsLoading(false)
      setStep('customize')
    }
  }

  const handleClose = () => {
    setStep('preview')
    setCustomTitle('')
    setCustomDescription('')
    setSelectedCategory('knowledge')
    setGeneratedPreview(null)
    onClose()
  }

  const getMessagePreview = () => {
    if (selectedMessages.length === 0) return ''
    
    const preview = selectedMessages
      .map(msg => {
        const role = msg.type === 'user' ? 'You' : 'AI'
        const content = msg.content.length > 100 ? msg.content.substring(0, 100) + '...' : msg.content
        return `${role}: ${content}`
      })
      .join('\n\n')
    
    return preview
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Save className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Save as Context</h2>
                  <p className="text-sm text-gray-500">
                    {selectedMessages.length} message{selectedMessages.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                disabled={isLoading}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                {/* Preview Step */}
                {step === 'preview' && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4"
                  >
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Message Preview</h3>
                      <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                          {getMessagePreview()}
                        </pre>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <motion.button
                        onClick={handleQuickSave}
                        disabled={isLoading || selectedMessages.length === 0}
                        className="w-full bg-green-600 text-white p-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>Quick Save with AI</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => setStep('customize')}
                        disabled={isLoading || selectedMessages.length === 0}
                        className="w-full bg-gray-100 text-gray-700 p-4 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FileText className="w-5 h-5" />
                        <span>Customize Details</span>
                      </motion.button>
                    </div>

                    <p className="text-xs text-gray-500 text-center mt-4">
                      Quick Save uses AI to automatically generate a title, description, and tags
                    </p>
                  </motion.div>
                )}

                {/* Customize Step */}
                {step === 'customize' && (
                  <motion.div
                    key="customize"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-4 space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title (optional)
                      </label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder="AI will generate if left empty"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (optional)
                      </label>
                      <textarea
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder="AI will generate if left empty"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Category
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => {
                          const Icon = category.icon
                          return (
                            <motion.button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`p-3 rounded-lg border-2 transition-colors text-left ${
                                selectedCategory === category.id
                                  ? 'border-green-500 bg-green-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-2 mb-1">
                                <Icon className={`w-4 h-4 ${
                                  selectedCategory === category.id ? 'text-green-600' : 'text-gray-600'
                                }`} />
                                <span className={`text-sm font-medium ${
                                  selectedCategory === category.id ? 'text-green-900' : 'text-gray-900'
                                }`}>
                                  {category.label}
                                </span>
                              </div>
                              <p className={`text-xs ${
                                selectedCategory === category.id ? 'text-green-700' : 'text-gray-500'
                              }`}>
                                {category.description}
                              </p>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        onClick={() => setStep('preview')}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleCustomSave}
                        disabled={isLoading}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? 'Saving...' : 'Save Context'}
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Saving Step */}
                {step === 'saving' && (
                  <motion.div
                    key="saving"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 flex flex-col items-center justify-center"
                  >
                    <motion.div
                      className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full mb-4"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Context</h3>
                    <p className="text-gray-600 text-center">
                      AI is processing your messages and generating a structured context...
                    </p>
                  </motion.div>
                )}

                {/* Success Step */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-8 flex flex-col items-center justify-center"
                  >
                    <motion.div
                      className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring" }}
                      >
                        <Save className="w-8 h-8 text-green-600" />
                      </motion.div>
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Context Saved!</h3>
                    <p className="text-gray-600 text-center">
                      Your conversation has been saved to your context library
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SaveAsContextSheet
