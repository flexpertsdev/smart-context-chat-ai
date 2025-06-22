
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle, HelpCircle } from 'lucide-react'
import { AIThinking } from '../../types'

interface AIThinkingDrawerProps {
  isOpen: boolean
  onClose: () => void
  thinking: AIThinking | null
}

const AIThinkingDrawer = ({ isOpen, onClose, thinking }: AIThinkingDrawerProps) => {
  if (!thinking) return null

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">AI Thinking Process</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(thinking.confidenceLevel)}`}>
                  {thinking.confidenceLevel} confidence
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto p-4 space-y-6">
              {/* Assumptions */}
              {thinking.assumptions.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Assumptions</h4>
                  <div className="space-y-2">
                    {thinking.assumptions.map((assumption) => (
                      <motion.div
                        key={assumption.id}
                        className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <div className={`p-1 rounded-full ${getConfidenceColor(assumption.confidence)}`}>
                          {assumption.isConfirmed === true ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : assumption.isConfirmed === false ? (
                            <XCircle className="w-4 h-4" />
                          ) : (
                            <HelpCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{assumption.text}</p>
                          <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${getConfidenceColor(assumption.confidence)}`}>
                            {assumption.confidence}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Uncertainties */}
              {thinking.uncertainties.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Uncertainties</h4>
                  <div className="space-y-2">
                    {thinking.uncertainties.map((uncertainty) => (
                      <motion.div
                        key={uncertainty.id}
                        className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <p className="text-sm text-gray-700 mb-2">{uncertainty.question}</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          uncertainty.priority === 'high' ? 'bg-red-100 text-red-700' :
                          uncertainty.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {uncertainty.priority} priority
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reasoning Chain */}
              {thinking.reasoningChain.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Reasoning Steps</h4>
                  <div className="space-y-3">
                    {thinking.reasoningChain.map((step, index) => (
                      <motion.div
                        key={step.id}
                        className="flex items-start space-x-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-700">{step.description}</p>
                          <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${getConfidenceColor(step.confidence)}`}>
                            {step.confidence}
                          </span>
                        </div>
                      </motion.div>
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

export default AIThinkingDrawer
