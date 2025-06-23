import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Brain, AlertCircle, Lightbulb, BarChart } from 'lucide-react'
import { Heading3, Body, Caption } from '../../foundations/Typography'
import Button from '../../foundations/Button'

interface ThinkingDrawerProps {
  isOpen: boolean
  onClose: () => void
  thinking?: {
    assumptions?: Array<{
      text: string
      confidence: 'high' | 'medium' | 'low'
      reasoning: string
    }>
    uncertainties?: Array<{
      question: string
      priority: 'high' | 'medium' | 'low'
      suggestedContexts: string[]
    }>
    confidenceLevel?: 'high' | 'medium' | 'low'
    reasoningSteps?: string[]
    contextUsage?: Array<{
      contextId: string
      influence: 'high' | 'medium' | 'low'
      howUsed: string
    }>
    suggestedContexts?: Array<{
      title: string
      description: string
      reason: string
    }>
  }
}

const ThinkingDrawer: React.FC<ThinkingDrawerProps> = ({ isOpen, onClose, thinking }) => {
  if (!thinking) return null

  const getConfidenceColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-red-600 bg-red-50'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40 md:hidden"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-green-600" />
                <Heading3>AI Thinking Process</Heading3>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Overall Confidence */}
              {thinking.confidenceLevel && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Caption className="uppercase">Overall Confidence</Caption>
                    <BarChart className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(thinking.confidenceLevel)}`}>
                    {thinking.confidenceLevel.charAt(0).toUpperCase() + thinking.confidenceLevel.slice(1)}
                  </span>
                </div>
              )}

              {/* Reasoning Steps */}
              {thinking.reasoningSteps && thinking.reasoningSteps.length > 0 && (
                <div>
                  <Caption className="uppercase mb-3">Reasoning Process</Caption>
                  <div className="space-y-2">
                    {thinking.reasoningSteps.map((step, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <Body className="text-gray-700">{step}</Body>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assumptions */}
              {thinking.assumptions && thinking.assumptions.length > 0 && (
                <div>
                  <Caption className="uppercase mb-3">Assumptions Made</Caption>
                  <div className="space-y-3">
                    {thinking.assumptions.map((assumption, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-1">
                          <Body className="font-medium">{assumption.text}</Body>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getConfidenceColor(assumption.confidence)}`}>
                            {assumption.confidence}
                          </span>
                        </div>
                        <Caption className="text-gray-600">{assumption.reasoning}</Caption>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uncertainties */}
              {thinking.uncertainties && thinking.uncertainties.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <Caption className="uppercase">Uncertainties</Caption>
                  </div>
                  <div className="space-y-3">
                    {thinking.uncertainties.map((uncertainty, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <Body className="font-medium text-yellow-900 mb-1">{uncertainty.question}</Body>
                        <Caption className="text-yellow-700">Priority: {uncertainty.priority}</Caption>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Contexts */}
              {thinking.suggestedContexts && thinking.suggestedContexts.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-4 h-4 text-green-600" />
                    <Caption className="uppercase">Suggested Contexts</Caption>
                  </div>
                  <div className="space-y-3">
                    {thinking.suggestedContexts.map((context, index) => (
                      <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <Body className="font-medium text-green-900">{context.title}</Body>
                        <Caption className="text-green-700 mt-1">{context.description}</Caption>
                        <Caption className="text-green-600 mt-2">Why: {context.reason}</Caption>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ThinkingDrawer