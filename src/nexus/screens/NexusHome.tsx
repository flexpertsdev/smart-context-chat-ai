import React from 'react'
import { motion } from 'framer-motion'
import { Plus, MessageSquare, Clock, TrendingUp } from 'lucide-react'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import Card from '../foundations/Card'
import Button from '../foundations/Button'
import { Heading1, Heading3, Body, Caption } from '../foundations/Typography'
import { useNavigate } from 'react-router-dom'
import { useNexusChatStore } from '../stores/nexusChatStore'

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  action: () => void
}

const NexusHome: React.FC = () => {
  const navigate = useNavigate()
  const { chats } = useNexusChatStore()

  // Get recent chats sorted by last activity
  const recentChats = [...chats]
    .sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())
    .slice(0, 3)

  const quickActions: QuickAction[] = [
    {
      id: 'new-chat',
      title: 'Start New Chat',
      description: 'Begin a fresh conversation with AI',
      icon: MessageSquare,
      color: 'green',
      action: () => navigate('/nexus/chats/new')
    },
    {
      id: 'recent',
      title: 'Recent Activity',
      description: 'View your conversation history',
      icon: Clock,
      color: 'purple',
      action: () => navigate('/nexus/chats')
    },
    {
      id: 'insights',
      title: 'AI Insights',
      description: 'Discover patterns and suggestions',
      icon: TrendingUp,
      color: 'green',
      action: () => navigate('/nexus/insights')
    }
  ]

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <AdaptiveLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <Heading1 className="mb-2">Welcome back!</Heading1>
          <Body color="secondary">How can I help you today?</Body>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <Heading3 className="mb-4">Quick Actions</Heading3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Card
                  key={action.id}
                  hoverable
                  onClick={action.action}
                  className="h-full"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-${action.color}-100`}>
                      <Icon className={`w-6 h-6 text-${action.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <Caption>{action.description}</Caption>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Chats */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <Heading3>Recent Chats</Heading3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/nexus/chats')}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <Card
                  key={chat.id}
                  hoverable
                  onClick={() => navigate(`/nexus/chats/${chat.id}`)}
                  padding="md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium truncate">{chat.title}</h4>
                      </div>
                      <Caption className="line-clamp-1">
                        {chat.lastMessage?.content || 'No messages yet'}
                      </Caption>
                    </div>
                    <Caption className="flex-shrink-0 ml-4">
                      {formatTimestamp(chat.lastActivity)}
                    </Caption>
                  </div>
                </Card>
              ))
            ) : (
              <Card padding="lg">
                <div className="text-center py-4">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <Body color="secondary">No chats yet</Body>
                  <Caption>Start a new conversation to get started</Caption>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/nexus/chats/new')}
          className="fixed bottom-6 right-6 w-fab h-fab bg-green-500 text-white rounded-fab shadow-fab flex items-center justify-center hover:bg-green-600 md:hidden z-fab"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </AdaptiveLayout>
  )
}

export default NexusHome