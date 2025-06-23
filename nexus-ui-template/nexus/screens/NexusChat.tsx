import React, { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import ChatHeader from '../components/chat/ChatHeader'
import MessageBubble from '../components/chat/MessageBubble'
import MessageComposer from '../components/chat/MessageComposer'
import ThinkingIndicator from '../components/ai/ThinkingIndicator'
import ContextSelector from '../components/context/ContextSelector'
import ContextBottomSheet from '../components/context/ContextBottomSheet'
import { AnimatePresence, motion } from 'framer-motion'
import { Library, ChevronRight } from 'lucide-react'
import Button from '../foundations/Button'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: Date
  status?: 'sending' | 'sent' | 'delivered' | 'read'
}

interface Context {
  id: string
  title: string
  category: string
  tags: string[]
}

const NexusChat: React.FC = () => {
  const { chatId } = useParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [showContextSelector, setShowContextSelector] = useState(false)
  const [selectedContexts, setSelectedContexts] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock contexts
  const contexts: Context[] = [
    { id: '1', title: 'React Best Practices', category: 'Development', tags: ['react', 'frontend'] },
    { id: '2', title: 'TypeScript Guidelines', category: 'Development', tags: ['typescript', 'types'] },
    { id: '3', title: 'API Documentation', category: 'Reference', tags: ['api', 'endpoints'] },
    { id: '4', title: 'Project Requirements', category: 'Planning', tags: ['requirements', 'specs'] },
  ]

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    }

    setMessages(prev => [...prev, userMessage])
    setIsThinking(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're asking about "${content}". Let me help you with that based on the selected contexts.`,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
      setIsThinking(false)
    }, 2000)
  }

  const toggleContext = (contextId: string) => {
    setSelectedContexts(prev => 
      prev.includes(contextId)
        ? prev.filter(id => id !== contextId)
        : [...prev, contextId]
    )
  }

  return (
    <AdaptiveLayout 
      mobileProps={{ 
        showHeader: false, 
        showBottomNav: false 
      }}
      desktopProps={{
        showSidebar: true
      }}
    >
      <div className="flex h-full">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          <ChatHeader
            title={chatId === 'new' ? 'New Chat' : 'AI Assistant'}
            subtitle={selectedContexts.length > 0 ? `${selectedContexts.length} contexts selected` : 'No contexts selected'}
            onBack={() => window.history.back()}
            onMenuClick={() => setShowContextSelector(!showContextSelector)}
          />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50"
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Start a new conversation
                </h3>
                <p className="text-gray-600 mb-6">
                  Select contexts to enhance AI responses
                </p>
                <Button
                  variant="secondary"
                  icon={<Library className="w-4 h-4" />}
                  onClick={() => setShowContextSelector(true)}
                >
                  Select Contexts
                </Button>
              </motion.div>
            )}

            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message, index) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  showAvatar={true}
                  isGrouped={false}
                />
              ))}
              
              <AnimatePresence>
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <MessageBubble
                      message={{
                        id: 'thinking',
                        content: '',
                        sender: 'ai',
                        timestamp: new Date(),
                        isThinking: true
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div ref={messagesEndRef} />
          </div>

          {/* Context Bar */}
          {selectedContexts.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="border-t border-gray-200 bg-white px-4 py-2"
            >
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-sm text-gray-600 flex-shrink-0">Contexts:</span>
                {selectedContexts.map(contextId => {
                  const context = contexts.find(c => c.id === contextId)
                  return context ? (
                    <span
                      key={contextId}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex-shrink-0"
                    >
                      {context.title}
                    </span>
                  ) : null
                })}
                <button
                  onClick={() => setShowContextSelector(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm flex-shrink-0"
                >
                  Edit
                </button>
              </div>
            </motion.div>
          )}

          {/* Message Composer */}
          <MessageComposer
            onSendMessage={handleSendMessage}
            placeholder="Type your message..."
            disabled={isThinking}
          />
        </div>

        {/* Desktop Context Selector Sidebar */}
        <AnimatePresence>
          {showContextSelector && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden md:block border-l border-gray-200 bg-white overflow-hidden"
            >
              <div className="h-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="font-semibold">Select Contexts</h3>
                  <button
                    onClick={() => setShowContextSelector(false)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
                <ContextSelector
                  contexts={contexts}
                  selectedContexts={selectedContexts}
                  onToggleContext={toggleContext}
                  onClearAll={() => setSelectedContexts([])}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Context Bottom Sheet */}
      <ContextBottomSheet
        isOpen={showContextSelector}
        onClose={() => setShowContextSelector(false)}
        contexts={contexts}
        selectedContexts={selectedContexts}
        onToggleContext={toggleContext}
        onClearAll={() => setSelectedContexts([])}
      />
    </AdaptiveLayout>
  )
}

export default NexusChat