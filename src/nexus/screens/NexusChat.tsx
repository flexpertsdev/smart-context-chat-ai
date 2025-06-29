import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AdaptiveLayout from '../layouts/AdaptiveLayout'
import ChatHeader from '../components/chat/ChatHeader'
import MessageBubble from '../components/chat/MessageBubble'
import MessageComposer from '../components/chat/MessageComposer'
import ThinkingIndicator from '../components/ai/ThinkingIndicator'
import ThinkingDrawer from '../components/ai/ThinkingDrawer'
import ContextSelector from '../components/context/ContextSelector'
import ContextBottomSheet from '../components/context/ContextBottomSheet'
import { AnimatePresence, motion } from 'framer-motion'
import { Library, ChevronRight, AlertCircle, CheckCircle, Sparkles } from 'lucide-react'
import Button from '../foundations/Button'
import { useNexusChatStore } from '../stores/nexusChatStore'
import { NexusMessage } from '../services/anthropicClient'

const NexusChat: React.FC = () => {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const [showContextSelector, setShowContextSelector] = useState(false)
  const [showThinkingDrawer, setShowThinkingDrawer] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<NexusMessage | null>(null)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([])
  const [isInitializing, setIsInitializing] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get store state and actions
  const {
    activeChat,
    messages,
    contexts,
    selectedContextIds,
    isThinking,
    error,
    sendMessage,
    setActiveChat,
    setSelectedContextIds,
    createNewChat,
    getApiKey
  } = useNexusChatStore()

  // Initialize chat
  useEffect(() => {
    setIsInitializing(true)
    if (chatId === 'new') {
      // Create a new chat
      const newChat = createNewChat()
      navigate(`/nexus/chats/${newChat.id}`, { replace: true })
    } else if (chatId) {
      // Set existing chat as active
      setActiveChat(chatId)
      // Give state time to update
      setTimeout(() => setIsInitializing(false), 100)
    }
  }, [chatId, createNewChat, navigate, setActiveChat])

  // Get messages for current chat
  const chatMessages = activeChat ? (messages[activeChat.id] || []) : []

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isThinking])

  const handleSendMessage = async (content: string) => {
    // Prevent sending while initializing
    if (isInitializing) {
      return
    }

    // Check if API key is configured
    if (!getApiKey()) {
      navigate('/nexus/settings', { 
        state: { message: 'Please set your Anthropic API key to start chatting' } 
      })
      return
    }

    // Ensure we have an active chat
    if (!activeChat && chatId && chatId !== 'new') {
      // Try to set the active chat again
      setActiveChat(chatId)
      // Give it a moment to update
      setTimeout(() => sendMessage(content), 100)
      return
    }

    await sendMessage(content)
  }

  const toggleContext = (contextId: string) => {
    setSelectedContextIds(
      selectedContextIds.includes(contextId)
        ? selectedContextIds.filter(id => id !== contextId)
        : [...selectedContextIds, contextId]
    )
  }

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessageIds(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    )
  }

  const handleGenerateContext = () => {
    const selectedMessages = chatMessages.filter(msg => 
      selectedMessageIds.includes(msg.id)
    )
    navigate('/nexus/contexts/generate', { 
      state: { messages: selectedMessages } 
    })
  }

  return (
    <AdaptiveLayout 
      mobileProps={{ 
        showHeader: false, 
        showBottomNav: false,
        fullHeight: true
      }}
      desktopProps={{
        showSidebar: true,
        fullHeight: true
      }}
    >
      <div className="flex h-full">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full">
          <ChatHeader
            title={activeChat?.title || 'New Chat'}
            subtitle={
              selectionMode 
                ? `${selectedMessageIds.length} messages selected`
                : selectedContextIds.length > 0 
                  ? `${selectedContextIds.length} contexts selected` 
                  : 'No contexts selected'
            }
            onBack={() => window.history.back()}
            onMenuClick={() => setShowContextSelector(!showContextSelector)}
            actions={
              <div className="flex items-center gap-2">
                {selectionMode ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectionMode(false)
                        setSelectedMessageIds([])
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Sparkles className="w-4 h-4" />}
                      onClick={handleGenerateContext}
                      disabled={selectedMessageIds.length === 0}
                    >
                      Generate Context
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectionMode(true)}
                    disabled={chatMessages.length === 0}
                  >
                    Select
                  </Button>
                )}
              </div>
            }
          />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50">
            {isInitializing ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Initializing chat...</p>
                </div>
              </div>
            ) : chatMessages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                {!getApiKey() ? (
                  <>
                    <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      API Key Required
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Please set your Anthropic API key in settings to start chatting
                    </p>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/nexus/settings')}
                    >
                      Go to Settings
                    </Button>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">Error</h4>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            <div className="space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className="relative">
                  {selectionMode && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8">
                      <button
                        onClick={() => toggleMessageSelection(message.id)}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedMessageIds.includes(message.id)
                            ? 'bg-green-500 border-green-500'
                            : 'bg-white border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {selectedMessageIds.includes(message.id) && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                      </button>
                    </div>
                  )}
                  <MessageBubble
                    message={message}
                    showAvatar={true}
                    isGrouped={false}
                    onClick={
                      selectionMode 
                        ? () => toggleMessageSelection(message.id)
                        : message.thinking 
                          ? () => {
                              setSelectedMessage(message)
                              setShowThinkingDrawer(true)
                            }
                          : undefined
                    }
                    className={selectionMode ? 'cursor-pointer' : ''}
                  />
                </div>
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
          {selectedContextIds.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="border-t border-gray-200 bg-white px-4 py-2"
            >
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-sm text-gray-600 flex-shrink-0">Contexts:</span>
                {selectedContextIds.map(contextId => {
                  const context = contexts.find(c => c.id === contextId)
                  return context ? (
                    <span
                      key={contextId}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex-shrink-0"
                    >
                      {context.title}
                    </span>
                  ) : null
                })}
                <button
                  onClick={() => setShowContextSelector(true)}
                  className="text-green-600 hover:text-green-700 text-sm flex-shrink-0"
                >
                  Edit
                </button>
              </div>
            </motion.div>
          )}

          {/* Message Composer */}
          <MessageComposer
            onSendMessage={handleSendMessage}
            placeholder={isInitializing ? "Initializing chat..." : "Type your message..."}
            disabled={isThinking || isInitializing}
          />
        </div>

        {/* Desktop Context Selector Sidebar */}
        <AnimatePresence>
          {showContextSelector && (
            <>
              {/* Backdrop for click outside */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="hidden md:block fixed inset-0 z-40"
                onClick={() => setShowContextSelector(false)}
              />
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 320, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden md:block relative z-50 border-l border-gray-200 bg-white overflow-hidden"
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
                    selectedContexts={selectedContextIds}
                    onToggleContext={toggleContext}
                    onClearAll={() => setSelectedContextIds([])}
                  />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Context Bottom Sheet */}
      <ContextBottomSheet
        isOpen={showContextSelector}
        onClose={() => setShowContextSelector(false)}
        contexts={contexts}
        selectedContexts={selectedContextIds}
        onToggleContext={toggleContext}
        onClearAll={() => setSelectedContextIds([])}
      />

      {/* Thinking Drawer */}
      <ThinkingDrawer
        isOpen={showThinkingDrawer}
        onClose={() => {
          setShowThinkingDrawer(false)
          setSelectedMessage(null)
        }}
        thinking={selectedMessage?.thinking}
      />
    </AdaptiveLayout>
  )
}

export default NexusChat