import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Search, MessageSquare, Clock } from 'lucide-react'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import Card from '../foundations/Card'
import Button from '../foundations/Button'
import { Heading1, Body, Caption } from '../foundations/Typography'
import { useNavigate } from 'react-router-dom'

interface Chat {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  unread?: boolean
  contextCount?: number
}

const NexusChatList: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const chats: Chat[] = [
    {
      id: '1',
      title: 'Project Planning Assistant',
      lastMessage: 'Here\'s the timeline breakdown for your new feature...',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      unread: true,
      contextCount: 3
    },
    {
      id: '2',
      title: 'Code Review Helper',
      lastMessage: 'I\'ve analyzed the pull request and found 3 suggestions...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      contextCount: 2
    },
    {
      id: '3',
      title: 'Learning Path Guide',
      lastMessage: 'Based on your goals, I recommend starting with React hooks...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      contextCount: 5
    },
    {
      id: '4',
      title: 'API Design Discussion',
      lastMessage: 'The RESTful approach would work well for this use case...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      contextCount: 1
    },
    {
      id: '5',
      title: 'Bug Investigation',
      lastMessage: 'I found the issue in the authentication middleware...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
    }
  ]

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <AdaptiveLayout onNewChat={() => navigate('/nexus/chats/new')}>
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <Heading1>Chats</Heading1>
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => navigate('/nexus/chats/new')}
            >
              New Chat
            </Button>
          </div>
          <Body color="secondary">
            {filteredChats.length} conversations
          </Body>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 min-h-touch bg-gray-100 rounded-mobile touch-manipulation focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="space-y-3">
          {filteredChats.map((chat) => (
            <Card
              key={chat.id}
              hoverable
              onClick={() => navigate(`/nexus/chats/${chat.id}`)}
              padding="md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate">{chat.title}</h3>
                    {chat.unread && (
                      <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    )}
                  </div>
                  <Caption className="line-clamp-1 mb-2">{chat.lastMessage}</Caption>
                  <div className="flex items-center gap-4 text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <Caption>Chat</Caption>
                      </div>
                      {chat.contextCount && (
                        <Caption>{chat.contextCount} contexts</Caption>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Caption className="flex-shrink-0">
                      {formatTimestamp(chat.timestamp)}
                    </Caption>
                  </div>
                </div>
              </Card>
          ))}
        </div>

        {filteredChats.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <Body color="secondary">No chats found</Body>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate('/nexus/chats/new')}
            >
              Start a New Chat
            </Button>
          </div>
        )}
      </div>
    </AdaptiveLayout>
  )
}

export default NexusChatList