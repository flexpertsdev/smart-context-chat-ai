import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Brain, Library, Settings } from 'lucide-react'

// Foundation imports
import Button from './foundations/Button'
import Card from './foundations/Card'
import { Heading1, Heading2, Heading3, Body, Caption } from './foundations/Typography'

// Component imports
import MessageBubble from './components/chat/MessageBubble'
import MessageComposer from './components/chat/MessageComposer'
import ChatHeader from './components/chat/ChatHeader'
import ContextCard from './components/context/ContextCard'
import ContextSelector from './components/context/ContextSelector'
import ThinkingIndicator from './components/ai/ThinkingIndicator'
import AIInsightsPanel from './components/ai/AIInsightsPanel'

const NexusShowcase: React.FC = () => {
  const [selectedContexts, setSelectedContexts] = useState<string[]>(['1', '3'])
  const [showInsights, setShowInsights] = useState(true)

  // Sample data
  const sampleMessages = [
    {
      id: '1',
      content: 'Can you help me understand React hooks better?',
      sender: 'user' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: 'read' as const
    },
    {
      id: '2',
      content: 'Of course! React hooks are functions that let you use state and other React features in functional components. The most common hooks are useState and useEffect.',
      sender: 'ai' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 4)
    }
  ]

  const sampleContext = {
    id: '1',
    title: 'React Best Practices',
    content: 'A comprehensive guide to React development best practices.',
    category: 'Development',
    tags: ['react', 'frontend'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isFavorite: true,
    wordCount: 1250
  }

  const sampleContexts = [
    { id: '1', title: 'React Best Practices', category: 'Development', tags: ['react', 'frontend'] },
    { id: '2', title: 'TypeScript Guidelines', category: 'Development', tags: ['typescript'] },
    { id: '3', title: 'API Documentation', category: 'Reference', tags: ['api', 'rest'] },
    { id: '4', title: 'Project Requirements', category: 'Planning', tags: ['requirements'] },
  ]

  const sampleInsights = [
    {
      id: '1',
      type: 'suggestion' as const,
      title: 'Consider using React.memo',
      description: 'Your component re-renders frequently. Using React.memo could improve performance.',
      confidence: 0.85,
      actions: [
        { label: 'Learn More', action: () => console.log('Learn more') },
        { label: 'Apply Fix', action: () => console.log('Apply fix') }
      ]
    },
    {
      id: '2',
      type: 'analysis' as const,
      title: 'Code complexity analysis',
      description: 'Your useEffect hook has 5 dependencies. Consider breaking it down.',
      confidence: 0.92
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <Heading1 className="mb-4">Nexus UI System Showcase</Heading1>
          <Body color="secondary">
            A complete UI system built from scratch for the Smart Context Chat AI
          </Body>
        </motion.div>

        {/* Foundation Components */}
        <section className="mb-12">
          <Heading2 className="mb-6">Foundation Components</Heading2>
          
          <div className="space-y-6">
            {/* Typography */}
            <Card>
              <Heading3 className="mb-4">Typography</Heading3>
              <div className="space-y-2">
                <Heading1>Heading 1</Heading1>
                <Heading2>Heading 2</Heading2>
                <Heading3>Heading 3</Heading3>
                <Body>Body text - Regular paragraph text</Body>
                <Caption>Caption text - Small descriptive text</Caption>
              </div>
            </Card>

            {/* Buttons */}
            <Card>
              <Heading3 className="mb-4">Buttons</Heading3>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="danger">Danger Button</Button>
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="lg">Large</Button>
                <Button variant="primary" loading>Loading</Button>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="primary" icon={<MessageSquare className="w-4 h-4" />}>
                  With Icon
                </Button>
              </div>
            </Card>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <Body>Basic Card</Body>
              </Card>
              <Card hoverable onClick={() => console.log('Clicked')}>
                <Body>Hoverable Card</Body>
              </Card>
              <Card shadow="lg">
                <Body>Card with Shadow</Body>
              </Card>
            </div>
          </div>
        </section>

        {/* Chat Components */}
        <section className="mb-12">
          <Heading2 className="mb-6">Chat Components</Heading2>
          
          <Card className="overflow-hidden">
            <ChatHeader
              title="AI Assistant"
              subtitle="Online"
              isOnline={true}
              onBack={() => console.log('Back')}
              onMenuClick={() => console.log('Menu')}
            />
            
            <div className="p-6 bg-gray-50 space-y-4">
              {sampleMessages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <MessageBubble
                message={{
                  id: 'thinking',
                  content: '',
                  sender: 'ai',
                  timestamp: new Date(),
                  isThinking: true
                }}
              />
            </div>
            
            <MessageComposer
              onSendMessage={(msg) => console.log('Send:', msg)}
              placeholder="Type a message..."
            />
          </Card>
        </section>

        {/* Context Components */}
        <section className="mb-12">
          <Heading2 className="mb-6">Context Management</Heading2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Heading3 className="mb-4">Context Card</Heading3>
              <ContextCard
                context={sampleContext}
                onClick={() => console.log('Context clicked')}
                onFavorite={() => console.log('Toggle favorite')}
              />
            </div>
            
            <div>
              <Heading3 className="mb-4">Context Selector</Heading3>
              <Card className="h-96 overflow-hidden">
                <ContextSelector
                  contexts={sampleContexts}
                  selectedContexts={selectedContexts}
                  onToggleContext={(id) => {
                    setSelectedContexts(prev => 
                      prev.includes(id) 
                        ? prev.filter(i => i !== id)
                        : [...prev, id]
                    )
                  }}
                  onClearAll={() => setSelectedContexts([])}
                />
              </Card>
            </div>
          </div>
        </section>

        {/* AI Components */}
        <section className="mb-12">
          <Heading2 className="mb-6">AI Components</Heading2>
          
          <div className="space-y-6">
            <div>
              <Heading3 className="mb-4">Thinking Indicators</Heading3>
              <div className="space-y-4">
                <ThinkingIndicator variant="minimal" />
                <ThinkingIndicator variant="inline" />
              </div>
            </div>
          </div>
        </section>

        {/* AI Insights Panel */}
        <AIInsightsPanel
          insights={sampleInsights}
          isOpen={showInsights}
          onClose={() => setShowInsights(false)}
          position="bottom"
        />
      </div>
    </div>
  )
}

export default NexusShowcase