import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nexusAnthropicClient, NexusMessage, NexusContext } from '../services/anthropicClient'

interface Chat {
  id: string
  title: string
  lastMessage?: NexusMessage
  lastActivity: Date
  contextIds: string[]
}

interface NexusChatStore {
  // State
  chats: Chat[]
  activeChat: Chat | null
  messages: Record<string, NexusMessage[]>
  contexts: NexusContext[]
  selectedContextIds: string[]
  isThinking: boolean
  error: string | null

  // Actions
  createNewChat: (title?: string) => Chat
  setActiveChat: (chatId: string | null) => void
  deleteChat: (chatId: string) => void
  
  // Message actions
  sendMessage: (content: string) => Promise<void>
  clearMessages: (chatId: string) => void
  
  // Context actions
  setSelectedContextIds: (contextIds: string[]) => void
  addContext: (context: NexusContext) => void
  updateContext: (contextId: string, updates: Partial<NexusContext>) => void
  deleteContext: (contextId: string) => void
  
  // Settings
  setApiKey: (apiKey: string) => void
  getApiKey: () => string | null
}

export const useNexusChatStore = create<NexusChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      chats: [],
      activeChat: null,
      messages: {},
      contexts: [
        {
          id: '1',
          title: 'React Best Practices',
          description: 'Guidelines for writing clean and maintainable React code',
          content: 'Use functional components with hooks. Avoid inline styles. Keep components small and focused.',
          category: 'Development',
          tags: ['react', 'frontend', 'best-practices']
        },
        {
          id: '2',
          title: 'TypeScript Guidelines',
          description: 'Best practices for TypeScript development',
          content: 'Use strict mode. Define interfaces for all data structures. Avoid using any type.',
          category: 'Development',
          tags: ['typescript', 'types', 'best-practices']
        }
      ],
      selectedContextIds: [],
      isThinking: false,
      error: null,

      // Chat actions
      createNewChat: (title) => {
        const newChat: Chat = {
          id: `chat-${Date.now()}`,
          title: title || `New Chat ${new Date().toLocaleDateString()}`,
          lastActivity: new Date(),
          contextIds: get().selectedContextIds
        }

        set(state => ({
          chats: [newChat, ...state.chats],
          activeChat: newChat
        }))

        return newChat
      },

      setActiveChat: (chatId) => {
        if (!chatId) {
          set({ activeChat: null })
          return
        }
        
        let chat = get().chats.find(c => c.id === chatId)
        
        // If chat doesn't exist, create it
        if (!chat) {
          chat = {
            id: chatId,
            title: `Chat ${new Date().toLocaleDateString()}`,
            lastActivity: new Date(),
            contextIds: get().selectedContextIds
          }
          set(state => ({
            chats: [chat!, ...state.chats],
            activeChat: chat
          }))
        } else {
          set({ activeChat: chat })
        }
      },

      deleteChat: (chatId) => {
        set(state => {
          const { [chatId]: _, ...remainingMessages } = state.messages
          return {
            chats: state.chats.filter(c => c.id !== chatId),
            messages: remainingMessages,
            activeChat: state.activeChat?.id === chatId ? null : state.activeChat
          }
        })
      },

      // Message actions
      sendMessage: async (content) => {
        const { activeChat, selectedContextIds, contexts } = get()
        if (!activeChat) {
          set({ error: 'No active chat' })
          return
        }

        // Create user message
        const userMessage: NexusMessage = {
          id: `msg-${Date.now()}`,
          content,
          sender: 'user',
          timestamp: new Date(),
          status: 'sent'
        }

        // Add user message to chat
        set(state => ({
          messages: {
            ...state.messages,
            [activeChat.id]: [...(state.messages[activeChat.id] || []), userMessage]
          }
        }))

        // Update message status
        setTimeout(() => {
          set(state => ({
            messages: {
              ...state.messages,
              [activeChat.id]: state.messages[activeChat.id].map(msg =>
                msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
              )
            }
          }))
        }, 100)

        // Get selected contexts
        const selectedContexts = contexts.filter(ctx => 
          selectedContextIds.includes(ctx.id)
        )

        // Set thinking state
        set({ isThinking: true, error: null })

        try {
          // Get all messages for this chat
          const chatMessages = get().messages[activeChat.id] || []
          
          // Create AI message placeholder
          const aiMessageId = `msg-${Date.now() + 1}`
          const aiMessage: NexusMessage = {
            id: aiMessageId,
            content: '',
            sender: 'ai',
            timestamp: new Date(),
            status: 'sending'
          }

          // Add placeholder
          set(state => ({
            messages: {
              ...state.messages,
              [activeChat.id]: [...state.messages[activeChat.id], aiMessage]
            }
          }))

          // Stream the response
          const stream = nexusAnthropicClient.streamMessage(chatMessages, selectedContexts)
          let fullContent = ''
          
          for await (const chunk of stream) {
            fullContent += chunk
            // Update message content as it streams
            set(state => ({
              messages: {
                ...state.messages,
                [activeChat.id]: state.messages[activeChat.id].map(msg =>
                  msg.id === aiMessageId ? { ...msg, content: fullContent } : msg
                )
              }
            }))
          }

          // Get thinking data from the completed stream
          const thinking = await stream.return(undefined)
          
          // Update final message with thinking data
          set(state => ({
            messages: {
              ...state.messages,
              [activeChat.id]: state.messages[activeChat.id].map(msg =>
                msg.id === aiMessageId 
                  ? { ...msg, status: 'delivered', thinking: thinking?.value }
                  : msg
              )
            },
            isThinking: false
          }))

          // Update chat's last message and activity
          set(state => ({
            chats: state.chats.map(chat =>
              chat.id === activeChat.id
                ? { 
                    ...chat, 
                    lastMessage: { ...aiMessage, content: fullContent, status: 'delivered' },
                    lastActivity: new Date()
                  }
                : chat
            )
          }))

        } catch (error) {
          console.error('Failed to send message:', error)
          set({ 
            error: error instanceof Error ? error.message : 'Failed to send message',
            isThinking: false
          })

          // Add error message
          const errorMessage: NexusMessage = {
            id: `msg-error-${Date.now()}`,
            content: `Error: ${error instanceof Error ? error.message : 'Failed to get AI response'}`,
            sender: 'ai',
            timestamp: new Date(),
            status: 'delivered'
          }

          set(state => ({
            messages: {
              ...state.messages,
              [activeChat.id]: [...state.messages[activeChat.id], errorMessage]
            }
          }))
        }
      },

      clearMessages: (chatId) => {
        set(state => ({
          messages: {
            ...state.messages,
            [chatId]: []
          }
        }))
      },

      // Context actions
      setSelectedContextIds: (contextIds) => {
        set({ selectedContextIds: contextIds })
      },

      addContext: (context) => {
        set(state => ({
          contexts: [...state.contexts, context]
        }))
      },

      updateContext: (contextId, updates) => {
        set(state => ({
          contexts: state.contexts.map(ctx =>
            ctx.id === contextId ? { ...ctx, ...updates } : ctx
          )
        }))
      },

      deleteContext: (contextId) => {
        set(state => ({
          contexts: state.contexts.filter(ctx => ctx.id !== contextId),
          selectedContextIds: state.selectedContextIds.filter(id => id !== contextId)
        }))
      },

      // Settings
      setApiKey: (apiKey) => {
        nexusAnthropicClient.setApiKey(apiKey)
      },

      getApiKey: () => {
        return nexusAnthropicClient.getApiKey()
      }
    }),
    {
      name: 'nexus-chat-store',
      partialize: (state) => ({
        chats: state.chats,
        contexts: state.contexts,
        selectedContextIds: state.selectedContextIds
      })
    }
  )
)