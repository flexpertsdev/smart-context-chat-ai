import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Brain, Check, AlertCircle, ChevronRight, Lightbulb } from 'lucide-react'
import { useChatStore } from '../../stores/chatStore'

interface LiveThinkingData {
  assumptions: Array<{
    text: string
    confidence: 'high' | 'medium' | 'low'
    reasoning?: string
  }>
  uncertainties: Array<{
    question: string
    priority: 'high' | 'medium' | 'low'
    suggestedContexts?: string[]
  }>
  confidenceLevel: 'high' | 'medium' | 'low'
  reasoningSteps: string[]
  contextUsage: Array<{
    contextId: string
    contextTitle: string
    influence: 'high' | 'medium' | 'low'
    howUsed: string
  }>
  suggestedContexts: Array<{
    title: string
    description: string
    reason: string
    priority: 'high' | 'medium' | 'low'
  }>
}

interface LiveThinkingDrawerProps {
  isOpen: boolean
  onClose: () => void
  onSuggestContext?: (suggestion: { title: string; description: string; reason: string }) => void
}

const LiveThinkingDrawer = ({ isOpen, onClose, onSuggestContext }: LiveThinkingDrawerProps) => {
  const [thinkingData, setThinkingData] = useState<LiveThinkingData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'assumptions' | 'uncertainties' | 'reasoning' | 'contexts'>('assumptions')
  
  const { messages, activeChat } = useChatStore()
  
  // Get the latest AI message with thinking data
  useEffect(() => {
    if (!isOpen || !activeChat) return
    
    const chatMessages = messages[activeChat.id] || []
    const latestAIMessage = [...chatMessages]
      .reverse()
      .find(msg => msg.type === 'ai' && msg.aiThinking)
    
    if (latestAIMessage?.aiThinking) {
      const aiThinking = latestAIMessage.aiThinking
      
      // Convert AIThinking to LiveThinkingData format
      const convertedData: LiveThinkingData = {
        assumptions: aiThinking.assumptions.map(assumption => ({
          text: assumption.text,
          confidence: assumption.confidence,
          reasoning: assumption.feedback
        })),
        uncertainties: aiThinking.uncertainties.map(uncertainty => ({
          question: uncertainty.question,
          priority: uncertainty.priority,
          suggestedContexts: uncertainty.suggestedContexts
        })),
        confidenceLevel: aiThinking.confidenceLevel,
        reasoningSteps: aiThinking.reasoningChain.map(step => step.description),
        contextUsage: [], // TODO: Context usage tracking to be implemented
        suggestedContexts: aiThinking.suggestedContexts.map(title => ({
          title,
          description: `Context suggestion: ${title}`,
          reason: 'AI suggested this context could help',
          priority: 'medium' as const
        }))
      }
      
      setThinkingData(convertedData)
      setIsLoading(false)
    } else {
      setThinkingData(null)
      setIsLoading(false)
    }
  }, [isOpen, activeChat, messages])

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-red-600 bg-red-50'
    }
  }

  const getConfidenceIcon = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high': return <Check className="w-4 h-4" />
      case 'medium': return <AlertCircle className="w-4 h-4" />
      case 'low': return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'border-red-300 bg-red-50'
      case 'medium': return 'border-yellow-300 bg-yellow-50'
      case 'low': return 'border-gray-300 bg-gray-50'
    }
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
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">AI Thinking Process</h2>
                  <p className="text-sm text-gray-500">Live insights into reasoning</p>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Overall Confidence */}
            {thinkingData && (
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Overall Confidence</span>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(thinkingData.confidenceLevel)}`}>
                    {getConfidenceIcon(thinkingData.confidenceLevel)}
                    <span className="capitalize">{thinkingData.confidenceLevel}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs - Now scrollable */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex overflow-x-auto scrollbar-hidden">
                {[
                  { id: 'assumptions', label: 'Assumptions', count: thinkingData?.assumptions.length || 0 },
                  { id: 'uncertainties', label: 'Questions', count: thinkingData?.uncertainties.length || 0 },
                  { id: 'reasoning', label: 'Reasoning', count: thinkingData?.reasoningSteps.length || 0 },
                  { id: 'contexts', label: 'Contexts', count: (thinkingData?.contextUsage.length || 0) + (thinkingData?.suggestedContexts.length || 0) }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600 bg-white'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-1 bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {!thinkingData ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                  <Brain className="w-12 h-12 mb-3 opacity-50" />
                  <p className="text-center">
                    {isLoading ? 'Loading AI thinking data...' : 'Start a conversation with AI to see thinking process'}
                  </p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  {/* Assumptions Tab */}
                  {activeTab === 'assumptions' && (
                    <motion.div
                      key="assumptions"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      {thinkingData.assumptions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No assumptions identified</p>
                      ) : (
                        thinkingData.assumptions.map((assumption, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border-l-4 ${
                              assumption.confidence === 'high' ? 'border-green-400 bg-green-50' :
                              assumption.confidence === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                              'border-red-400 bg-red-50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{assumption.text}</p>
                                {assumption.reasoning && (
                                  <p className="text-xs text-gray-600 mt-2">{assumption.reasoning}</p>
                                )}
                              </div>
                              <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${getConfidenceColor(assumption.confidence)}`}>
                                {getConfidenceIcon(assumption.confidence)}
                                <span className="capitalize">{assumption.confidence}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {/* Uncertainties Tab */}
                  {activeTab === 'uncertainties' && (
                    <motion.div
                      key="uncertainties"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      {thinkingData.uncertainties.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No uncertainties identified</p>
                      ) : (
                        thinkingData.uncertainties.map((uncertainty, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-4 rounded-lg border ${getPriorityColor(uncertainty.priority)}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <p className="text-sm font-medium text-gray-900">{uncertainty.question}</p>
                              <span className="text-xs font-medium text-gray-500 uppercase">
                                {uncertainty.priority}
                              </span>
                            </div>
                            {uncertainty.suggestedContexts && uncertainty.suggestedContexts.length > 0 && (
                              <div className="mt-3">
                                <p className="text-xs text-gray-600 mb-2">Suggested contexts to help:</p>
                                <div className="flex flex-wrap gap-1">
                                  {uncertainty.suggestedContexts.map((context, idx) => (
                                    <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                      {context}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {/* Reasoning Tab */}
                  {activeTab === 'reasoning' && (
                    <motion.div
                      key="reasoning"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      {thinkingData.reasoningSteps.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No reasoning steps captured</p>
                      ) : (
                        thinkingData.reasoningSteps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-purple-600">{index + 1}</span>
                            </div>
                            <p className="text-sm text-gray-900 flex-1">{step}</p>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {/* Contexts Tab */}
                  {activeTab === 'contexts' && (
                    <motion.div
                      key="contexts"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      {/* Used Contexts */}
                      {thinkingData.contextUsage.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <Check className="w-4 h-4 text-green-600 mr-2" />
                            Used Contexts
                          </h3>
                          <div className="space-y-2">
                            {thinkingData.contextUsage.map((usage, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-3 bg-green-50 border border-green-200 rounded-lg"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-medium text-gray-900">{usage.contextTitle}</p>
                                  <span className={`text-xs px-2 py-1 rounded ${getConfidenceColor(usage.influence)}`}>
                                    {usage.influence} influence
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600">{usage.howUsed}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggested Contexts */}
                      {thinkingData.suggestedContexts.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                            <Lightbulb className="w-4 h-4 text-yellow-600 mr-2" />
                            Suggested Contexts
                          </h3>
                          <div className="space-y-2">
                            {thinkingData.suggestedContexts.map((suggestion, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{suggestion.title}</p>
                                    <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                                    <p className="text-xs text-blue-600 mt-2 italic">{suggestion.reason}</p>
                                  </div>
                                  <div className="flex flex-col items-end space-y-2">
                                    <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(suggestion.priority)}`}>
                                      {suggestion.priority}
                                    </span>
                                    {onSuggestContext && (
                                      <button
                                        onClick={() => onSuggestContext(suggestion)}
                                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                                      >
                                        Add
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {thinkingData.contextUsage.length === 0 && thinkingData.suggestedContexts.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No context information available</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default LiveThinkingDrawer
