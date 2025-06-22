
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, XCircle, HelpCircle, Link, Edit3, Plus } from 'lucide-react'
import { AIThinking, Assumption, Uncertainty } from '../../types'
import { useContextStore } from '../../stores/contextStore'
import ContextPicker from './ContextPicker'

interface InteractiveAIThinkingDrawerProps {
  isOpen: boolean
  onClose: () => void
  thinking: AIThinking | null
  onUpdateThinking: (thinking: AIThinking) => void
}

const InteractiveAIThinkingDrawer = ({ 
  isOpen, 
  onClose, 
  thinking, 
  onUpdateThinking 
}: InteractiveAIThinkingDrawerProps) => {
  const [editingAssumption, setEditingAssumption] = useState<string | null>(null)
  const [editingUncertainty, setEditingUncertainty] = useState<string | null>(null)
  const [showContextPicker, setShowContextPicker] = useState<string | null>(null)
  const { contexts } = useContextStore()

  if (!thinking) return null

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleAssumptionEdit = (assumptionId: string, correction: string) => {
    const updatedAssumptions = thinking.assumptions.map(assumption =>
      assumption.id === assumptionId
        ? { ...assumption, userCorrection: correction, isConfirmed: true }
        : assumption
    )
    
    onUpdateThinking({
      ...thinking,
      assumptions: updatedAssumptions
    })
    setEditingAssumption(null)
  }

  const handleUncertaintyResponse = (uncertaintyId: string, response: string) => {
    const updatedUncertainties = thinking.uncertainties.map(uncertainty =>
      uncertainty.id === uncertaintyId
        ? { ...uncertainty, userResponse: response }
        : uncertainty
    )
    
    onUpdateThinking({
      ...thinking,
      uncertainties: updatedUncertainties
    })
    setEditingUncertainty(null)
  }

  const handleLinkContext = (itemId: string, contextIds: string[]) => {
    const updatedAssumptions = thinking.assumptions.map(assumption =>
      assumption.id === itemId
        ? { ...assumption, linkedContexts: [...(assumption.linkedContexts || []), ...contextIds] }
        : assumption
    )
    
    const updatedUncertainties = thinking.uncertainties.map(uncertainty =>
      uncertainty.id === itemId
        ? { ...uncertainty, linkedContexts: [...(uncertainty.linkedContexts || []), ...contextIds] }
        : uncertainty
    )
    
    onUpdateThinking({
      ...thinking,
      assumptions: updatedAssumptions,
      uncertainties: updatedUncertainties
    })
    setShowContextPicker(null)
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
                      <AssumptionCard
                        key={assumption.id}
                        assumption={assumption}
                        isEditing={editingAssumption === assumption.id}
                        onEdit={(correction) => handleAssumptionEdit(assumption.id, correction)}
                        onStartEdit={() => setEditingAssumption(assumption.id)}
                        onCancelEdit={() => setEditingAssumption(null)}
                        onLinkContext={() => setShowContextPicker(assumption.id)}
                        getConfidenceColor={getConfidenceColor}
                      />
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
                      <UncertaintyCard
                        key={uncertainty.id}
                        uncertainty={uncertainty}
                        isEditing={editingUncertainty === uncertainty.id}
                        onRespond={(response) => handleUncertaintyResponse(uncertainty.id, response)}
                        onStartEdit={() => setEditingUncertainty(uncertainty.id)}
                        onCancelEdit={() => setEditingUncertainty(null)}
                        onLinkContext={() => setShowContextPicker(uncertainty.id)}
                      />
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

            {/* Context Picker */}
            {showContextPicker && (
              <ContextPicker
                isOpen={!!showContextPicker}
                onClose={() => setShowContextPicker(null)}
                onSelectContexts={(contextIds) => handleLinkContext(showContextPicker, contextIds)}
                availableContexts={contexts}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Assumption Card Component
const AssumptionCard = ({ 
  assumption, 
  isEditing, 
  onEdit, 
  onStartEdit, 
  onCancelEdit, 
  onLinkContext, 
  getConfidenceColor 
}: {
  assumption: Assumption
  isEditing: boolean
  onEdit: (correction: string) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onLinkContext: () => void
  getConfidenceColor: (confidence: string) => string
}) => {
  const [editText, setEditText] = useState(assumption.userCorrection || assumption.text)

  return (
    <motion.div
      className="p-3 bg-gray-50 rounded-lg border-l-4 border-gray-300"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-start space-x-3">
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
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(editText)}
                  className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={onCancelEdit}
                  className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-700">
                {assumption.userCorrection || assumption.text}
              </p>
              {assumption.userCorrection && (
                <p className="text-xs text-gray-500 mt-1">
                  Original: {assumption.text}
                </p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs ${getConfidenceColor(assumption.confidence)}`}>
                  {assumption.confidence}
                </span>
                <button
                  onClick={onStartEdit}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={onLinkContext}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded"
                >
                  <Link className="w-3 h-3" />
                  <span>Add Context</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Uncertainty Card Component
const UncertaintyCard = ({ 
  uncertainty, 
  isEditing, 
  onRespond, 
  onStartEdit, 
  onCancelEdit, 
  onLinkContext 
}: {
  uncertainty: Uncertainty
  isEditing: boolean
  onRespond: (response: string) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onLinkContext: () => void
}) => {
  const [responseText, setResponseText] = useState(uncertainty.userResponse || '')

  return (
    <motion.div
      className="p-3 bg-orange-50 border border-orange-200 rounded-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <p className="text-sm text-gray-700 mb-2">{uncertainty.question}</p>
      
      {uncertainty.userResponse ? (
        <div className="bg-white p-2 rounded border-l-4 border-green-500 mb-2">
          <p className="text-sm text-gray-700">{uncertainty.userResponse}</p>
        </div>
      ) : isEditing ? (
        <div className="space-y-2">
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Provide information to help the AI..."
            className="w-full p-2 border border-gray-300 rounded text-sm"
            rows={2}
          />
          <div className="flex space-x-2">
            <button
              onClick={() => onRespond(responseText)}
              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
            >
              Submit
            </button>
            <button
              onClick={onCancelEdit}
              className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex items-center space-x-2">
        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
          uncertainty.priority === 'high' ? 'bg-red-100 text-red-700' :
          uncertainty.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {uncertainty.priority} priority
        </span>
        
        {!uncertainty.userResponse && !isEditing && (
          <button
            onClick={onStartEdit}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
          >
            <Plus className="w-3 h-3" />
            <span>Respond</span>
          </button>
        )}
        
        <button
          onClick={onLinkContext}
          className="flex items-center space-x-1 px-2 py-1 text-xs text-green-600 hover:bg-green-50 rounded"
        >
          <Link className="w-3 h-3" />
          <span>Add Context</span>
        </button>
      </div>
    </motion.div>
  )
}

export default InteractiveAIThinkingDrawer
