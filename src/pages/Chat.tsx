import React, { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useChatStore } from '../stores/chatStore'
import { useContextStore } from '../stores/contextStore'
import { useBreakpoints } from '../hooks/use-breakpoints'
import AdaptiveLayout from '../components/layout/AdaptiveLayout'
import ChatBubble from '../components/chat/ChatBubble'
import MessageComposer from '../components/chat/MessageComposer'
import ContextBar from '../components/chat/ContextBar'
import TypingIndicator from '../components/chat/TypingIndicator'
import LiveThinkingDrawer from '../components/ai/LiveThinkingDrawer'
import ContextManagementDrawer from '../components/chat/ContextManagementDrawer'
import ChatContextPanel from '../components/chat/ChatContextPanel'
import MessageActionsBottomSheet from '../components/chat/MessageActionsBottomSheet'
import CreateContextFromMessagesSheet from '../components/chat/CreateContextFromMessagesSheet'
import { AIThinking } from '../types'
import { contextCreationService } from '../services/contextCreationService'
import { toast } from 'sonner'

const Chat = () => {
  const { chatId } = useParams<{ chatId: string }>()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showThinkingDrawer, setShowThinkingDrawer] = useState(false)
  const [selectedThinking, setSelectedThinking] = useState<AIThinking | null>(null)
  const [showMessageActions, setShowMessageActions] = useState(false)
  const [showCreateContext, setShowCreateContext] = useState(false)
  const [showContextPanel, setShowContextPanel] = useState(false)
  const [showContextDrawer, setShowContextDrawer] = useState(false)
  
  const { isMobile, isTablet, isDesktop } = useBreakpoints()
  
  const { 
    chats, 
    messages, 
    sendMessage, 
    setActiveChat, 
    loadChatHistory, 
    isTyping,
    selectedMessages,
    selectionMode,
    toggleMessageSelection,
    clearMessageSelection,
    setSelectionMode
  } = useChatStore()
  
  const { activeContexts, getContextsByIds, attachContextsToChat, detachContextFromChat, addContext } = useContextStore()
  
  const currentChat = chats.find(chat => chat.id === chatId)
  const chatMessages = chatId ? messages[chatId] || [] : []
  const attachedContexts = chatId ? getContextsByIds(activeContexts[chatId] || []) : []

  console.log('🎬 Chat component render:', {
    chatId,
    messageCount: chatMessages.length,
    isTyping,
    hasCurrentChat: !!currentChat,
    selectedMessagesCount: selectedMessages.length,
    selectionMode
  })

  useEffect(() => {
    if (currentChat) {
      setActiveChat(currentChat)
      loadChatHistory(chatId!)
    } else if (chatId) {
      navigate('/')
    }
  }, [currentChat, chatId, setActiveChat, navigate, loadChatHistory])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isTyping])

  const handleSendMessage = async (message: string, attachments?: any[]) => {
    if (chatId) {
      console.log('📤 Chat component sending message:', {
        chatId,
        messageLength: message.length,
        contextCount: attachedContexts.length
      })
      await sendMessage(chatId, message, attachedContexts)
    }
  }

  const handleThinkingClick = (messageId: string) => {
    console.log('🧠 Opening live thinking drawer')
    setShowThinkingDrawer(true)
  }

  const handleUpdateThinking = (updatedThinking: AIThinking) => {
    setSelectedThinking(updatedThinking)
    // Here you would typically save the updated thinking to your backend
    console.log('Updated thinking:', updatedThinking)
  }

  const handleMessageSelect = (messageId: string) => {
    toggleMessageSelection(messageId)
  }

  const handleAttachContexts = (contextIds: string[]) => {
    if (chatId) {
      attachContextsToChat(chatId, contextIds)
    }
  }

  const handleDetachContext = (contextId: string) => {
    if (chatId) {
      detachContextFromChat(chatId, contextId)
    }
  }

  const handleCreateContextFromMessages = () => {
    if (selectedMessages.length > 0) {
      setShowCreateContext(true)
      setShowMessageActions(false)
    }
  }

  const handleSuggestContext = async (suggestion: { title: string; description: string; reason: string; }) => {
    console.log('🧠 Creating context from AI suggestion:', suggestion.title)
    
    try {
      const newContext = await contextCreationService.createContextFromSuggestion(suggestion.title, suggestion.description)
      addContext(newContext)
      
      // Optionally attach it to the current chat
      if (chatId) {
        attachContextsToChat(chatId, [newContext.id])
      }
      
      toast.success('Context created from AI suggestion!')
      setShowThinkingDrawer(false)
    } catch (error) {
      console.error('Failed to create context from suggestion:', error)
      toast.error('Failed to create context from suggestion')
    }
  }

  // Show message actions when messages are selected
  useEffect(() => {
    if (selectedMessages.length > 0 && !showMessageActions) {
      setShowMessageActions(true)
    } else if (selectedMessages.length === 0 && showMessageActions) {
      setShowMessageActions(false)
    }
  }, [selectedMessages.length, showMessageActions])

  if (!currentChat) {
    return (
      <AdaptiveLayout
        headerProps={{ title: 'Chat Not Found' }}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Chat not found</p>
          </div>
        </div>
      </AdaptiveLayout>
    )
  }

  const messageComposer = (
    <>
      {/* Selection Actions */}
      {selectedMessages.length > 0 && (
        <div className="bg-green-100 border-t border-green-200 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-green-700">
            {selectedMessages.length} message{selectedMessages.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handleCreateContextFromMessages}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors touch-target"
            >
              Create Context
            </button>
            <button
              onClick={clearMessageSelection}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors touch-target"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <MessageComposer onSendMessage={handleSendMessage} />
    </>
  )

  return (
    <AdaptiveLayout
      contextPanel={isDesktop ? (
        <ChatContextPanel
          isOpen={true}
          onClose={() => {}}
          attachedContexts={attachedContexts}
          onRemoveContext={handleDetachContext}
          onAddContext={() => setShowContextDrawer(true)}
        />
      ) : undefined}
      footer={messageComposer}
      headerProps={{
        title: currentChat?.title || 'Chat',
        onAddContext: () => setShowContextDrawer(true),
        onShowContextPanel: () => setShowContextPanel(true)
      }}
    >
      <div className="h-full flex flex-col">
        {/* Context Bar - only show on mobile/tablet */}
        {!isDesktop && attachedContexts.length > 0 && (
          <div className="flex-shrink-0">
            <ContextBar
              contexts={attachedContexts}
              onRemoveContext={(contextId) => detachContextFromChat(chatId!, contextId)}
              onAddContext={() => setShowContextDrawer(true)}
            />
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6">
        {chatMessages.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center h-full text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <motion.div
                className="w-8 h-8 bg-green-600 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start the conversation
            </h3>
            <p className="text-gray-600 max-w-sm mb-4">
              Send a message to begin chatting with AI. Add contexts to get more relevant responses.
            </p>
            <button
              onClick={() => setShowContextDrawer(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add Context
            </button>
          </motion.div>
        ) : (
          <>
            {chatMessages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                onThinkingClick={() => handleThinkingClick(message.id)}
                isSelected={selectedMessages.includes(message.id)}
                onSelect={() => handleMessageSelect(message.id)}
                selectionMode={selectionMode}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
        </div>

      {/* Drawers and Bottom Sheets */}
      <LiveThinkingDrawer
        isOpen={showThinkingDrawer}
        onClose={() => setShowThinkingDrawer(false)}
        onSuggestContext={handleSuggestContext}
      />

      <ContextManagementDrawer
        isOpen={showContextDrawer}
        onClose={() => setShowContextDrawer(false)}
        chatId={chatId}
        onAttachContexts={handleAttachContexts}
        attachedContexts={attachedContexts}
      />

      {/* Context Panel - only show as drawer on mobile/tablet */}
      {!isDesktop && (
        <ChatContextPanel
          isOpen={showContextPanel}
          onClose={() => setShowContextPanel(false)}
          attachedContexts={attachedContexts}
          onRemoveContext={handleDetachContext}
          onAddContext={() => {
            setShowContextPanel(false)
            setShowContextDrawer(true)
          }}
        />
      )}

      <MessageActionsBottomSheet
        isOpen={showMessageActions}
        onClose={() => setShowMessageActions(false)}
        selectedMessages={selectedMessages.map(id => chatMessages.find(m => m.id === id)!).filter(Boolean)}
        onCreateContext={handleCreateContextFromMessages}
      />

      <CreateContextFromMessagesSheet
        isOpen={showCreateContext}
        onClose={() => setShowCreateContext(false)}
        selectedMessages={selectedMessages.map(id => chatMessages.find(m => m.id === id)!).filter(Boolean)}
        onContextCreated={() => {
          clearMessageSelection()
          setShowCreateContext(false)
        }}
      />
      </div>
    </AdaptiveLayout>
  )
}

export default Chat
