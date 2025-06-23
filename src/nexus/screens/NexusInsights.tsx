import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Brain, TrendingUp, Lightbulb, BarChart3, Calendar, Filter } from 'lucide-react'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import Card from '../foundations/Card'
import Button from '../foundations/Button'
import { Heading1, Heading3, Body, Caption } from '../foundations/Typography'
import AIInsightsPanel from '../components/ai/AIInsightsPanel'
import { useNavigate } from 'react-router-dom'

interface InsightMetric {
  id: string
  title: string
  value: string
  change: number
  icon: React.ElementType
  color: string
}

interface Insight {
  id: string
  type: 'suggestion' | 'analysis' | 'warning' | 'trend'
  title: string
  description: string
  confidence: number
  category: string
  timestamp: Date
  actions?: Array<{
    label: string
    action: () => void
  }>
}

const NexusInsights: React.FC = () => {
  const navigate = useNavigate()
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week')
  const [showInsightsPanel, setShowInsightsPanel] = useState(false)

  const metrics: InsightMetric[] = [
    {
      id: 'conversations',
      title: 'Total Conversations',
      value: '128',
      change: 12,
      icon: Brain,
      color: 'blue'
    },
    {
      id: 'insights',
      title: 'Insights Generated',
      value: '342',
      change: 23,
      icon: Lightbulb,
      color: 'yellow'
    },
    {
      id: 'productivity',
      title: 'Productivity Score',
      value: '87%',
      change: 5,
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 'time-saved',
      title: 'Time Saved',
      value: '14.5h',
      change: 8,
      icon: Calendar,
      color: 'purple'
    }
  ]

  const insights: Insight[] = [
    {
      id: '1',
      type: 'trend',
      title: 'Increased React Hook Usage',
      description: 'You\'ve been using React hooks 40% more this week. Consider exploring custom hooks for repeated patterns.',
      confidence: 0.92,
      category: 'Development',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      actions: [
        { label: 'View Patterns', action: () => console.log('View patterns') },
        { label: 'Learn More', action: () => console.log('Learn more') }
      ]
    },
    {
      id: '2',
      type: 'suggestion',
      title: 'Context Organization Opportunity',
      description: 'You have 15 similar contexts that could be grouped into a "Frontend Development" category.',
      confidence: 0.85,
      category: 'Organization',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2)
    },
    {
      id: '3',
      type: 'analysis',
      title: 'Peak Productivity Hours',
      description: 'Your most productive conversations happen between 2-4 PM. Schedule complex tasks during this time.',
      confidence: 0.88,
      category: 'Productivity',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5)
    },
    {
      id: '4',
      type: 'warning',
      title: 'Unused Contexts',
      description: '8 contexts haven\'t been used in over 30 days. Consider archiving or updating them.',
      confidence: 0.95,
      category: 'Maintenance',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
    }
  ]

  const filteredInsights = insights.filter(insight => {
    if (selectedPeriod === 'week') {
      const weekAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
      return insight.timestamp > weekAgo
    }
    if (selectedPeriod === 'month') {
      const monthAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
      return insight.timestamp > monthAgo
    }
    return true
  })

  return (
    <AdaptiveLayout onNewChat={() => navigate('/nexus/chats/new')}>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <Heading1>AI Insights</Heading1>
            <Button
              variant="secondary"
              icon={<Filter className="w-4 h-4" />}
              onClick={() => setShowInsightsPanel(!showInsightsPanel)}
            >
              Filter
            </Button>
          </div>
          <Body color="secondary">Discover patterns and optimize your workflow</Body>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            {(['week', 'month', 'all'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-md capitalize transition-colors ${
                  selectedPeriod === period
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {period === 'all' ? 'All Time' : `This ${period}`}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Card>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                      <Icon className={`w-5 h-5 text-${metric.color}-600`} />
                    </div>
                    <span className={`text-sm font-medium ${
                      metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {metric.change >= 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
                    <Caption>{metric.title}</Caption>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Insights List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Heading3 className="mb-4">Recent Insights</Heading3>
          
          <div className="space-y-4">
            {filteredInsights.map((insight, index) => {
              const iconMap = {
                suggestion: Lightbulb,
                analysis: BarChart3,
                warning: Brain,
                trend: TrendingUp
              }
              const Icon = iconMap[insight.type]
              const colorMap = {
                suggestion: 'yellow',
                analysis: 'blue',
                warning: 'red',
                trend: 'green'
              }
              const color = colorMap[insight.type]
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <Card hoverable>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg bg-${color}-100 flex-shrink-0`}>
                        <Icon className={`w-6 h-6 text-${color}-600`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold mb-1">{insight.title}</h3>
                            <Caption className="text-gray-600">
                              {insight.description}
                            </Caption>
                          </div>
                          <div className="text-right ml-4">
                            <Caption className="text-gray-500">
                              {Math.round(insight.confidence * 100)}% confidence
                            </Caption>
                            <Caption className="text-gray-400">
                              {insight.category}
                            </Caption>
                          </div>
                        </div>
                        {insight.actions && (
                          <div className="flex items-center gap-2 mt-3">
                            {insight.actions.map((action, actionIndex) => (
                              <Button
                                key={actionIndex}
                                size="sm"
                                variant={actionIndex === 0 ? 'primary' : 'ghost'}
                                onClick={action.action}
                              >
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Show live insights panel */}
        {showInsightsPanel && (
          <AIInsightsPanel
            insights={filteredInsights.slice(0, 3)}
            isOpen={showInsightsPanel}
            onClose={() => setShowInsightsPanel(false)}
            position="bottom"
            variant="detailed"
          />
        )}
      </div>
    </AdaptiveLayout>
  )
}

export default NexusInsights