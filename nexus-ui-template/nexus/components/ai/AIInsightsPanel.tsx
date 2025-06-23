import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Lightbulb, TrendingUp, AlertCircle, ChevronDown, ChevronUp, X } from 'lucide-react'
import Card from '../../foundations/Card'
import Button from '../../foundations/Button'
import { Heading4, Body, Caption } from '../../foundations/Typography'

interface Insight {
  id: string
  type: 'suggestion' | 'analysis' | 'warning' | 'trend'
  title: string
  description: string
  confidence: number
  actions?: Array<{
    label: string
    action: () => void
  }>
}

interface AIInsightsPanelProps {
  insights: Insight[]
  isOpen?: boolean
  onClose?: () => void
  position?: 'top' | 'bottom' | 'side'
  variant?: 'minimal' | 'detailed'
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights,
  isOpen = true,
  onClose,
  position = 'bottom',
  variant = 'detailed'
}) => {
  const [expandedInsights, setExpandedInsights] = useState<string[]>([])
  const [minimized, setMinimized] = useState(false)

  const toggleExpanded = (id: string) => {
    setExpandedInsights(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const getIcon = (type: Insight['type']) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />
      case 'analysis':
        return <Brain className="w-5 h-5 text-blue-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'trend':
        return <TrendingUp className="w-5 h-5 text-green-500" />
    }
  }

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return 'top-0 left-0 right-0'
      case 'bottom':
        return 'bottom-0 left-0 right-0'
      case 'side':
        return 'top-20 right-4 bottom-20 w-96'
      default:
        return 'bottom-0 left-0 right-0'
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: position === 'top' ? -20 : 20 }}
      className={`fixed ${getPositionStyles()} z-40 p-4`}
    >
      <Card shadow="lg" className="overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <Heading4>AI Insights</Heading4>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {insights.length}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            >
              {minimized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        {/* Content */}
        <AnimatePresence>
          {!minimized && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden"
            >
              <div className={`p-4 space-y-3 ${position === 'side' ? 'max-h-[600px]' : 'max-h-[300px]'} overflow-y-auto`}>
                {insights.map((insight) => {
                  const isExpanded = expandedInsights.includes(insight.id)
                  
                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                    >
                      <button
                        onClick={() => variant === 'detailed' && toggleExpanded(insight.id)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start gap-3">
                          {getIcon(insight.type)}
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <Body className="font-medium">{insight.title}</Body>
                              <Caption className="text-gray-500">
                                {Math.round(insight.confidence * 100)}% confidence
                              </Caption>
                            </div>
                            
                            {(variant === 'minimal' || isExpanded) && (
                              <Caption className="text-gray-600 mb-2">
                                {insight.description}
                              </Caption>
                            )}
                            
                            {isExpanded && insight.actions && (
                              <div className="flex items-center gap-2 mt-2">
                                {insight.actions.map((action, index) => (
                                  <Button
                                    key={index}
                                    size="sm"
                                    variant="ghost"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      action.action()
                                    }}
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {variant === 'detailed' && (
                            <ChevronDown 
                              className={`w-4 h-4 text-gray-400 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </div>
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}

export default AIInsightsPanel