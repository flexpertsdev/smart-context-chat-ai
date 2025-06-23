import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nexusAnthropicClient, NexusMessage, NexusContext } from '../services/anthropicClient'
import { NexusStorageService } from '../services/nexusStorageService'

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
  
  // Data persistence
  loadFromStorage: () => Promise<void>
}

export const useNexusChatStore = create<NexusChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      chats: [],
      activeChat: null,
      messages: {},
      contexts: [],
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

        // Save to IndexedDB
        NexusStorageService.saveChat(newChat).catch(console.error)

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
          // Save new chat to IndexedDB
          NexusStorageService.saveChat(chat!).catch(console.error)
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
        
        // Save to IndexedDB
        await NexusStorageService.saveMessage(userMessage, activeChat.id)

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
          const finalAiMessage = {
            ...aiMessage,
            content: fullContent,
            status: 'delivered' as const,
            thinking: thinking?.value
          }
          
          set(state => ({
            messages: {
              ...state.messages,
              [activeChat.id]: state.messages[activeChat.id].map(msg =>
                msg.id === aiMessageId 
                  ? finalAiMessage
                  : msg
              )
            },
            isThinking: false
          }))
          
          // Save final AI message to IndexedDB
          await NexusStorageService.saveMessage(finalAiMessage, activeChat.id)

          // Update chat's last message and activity
          const updatedChat = {
            ...activeChat,
            lastMessage: finalAiMessage,
            lastActivity: new Date()
          }
          
          set(state => ({
            chats: state.chats.map(chat =>
              chat.id === activeChat.id ? updatedChat : chat
            )
          }))
          
          // Save updated chat to IndexedDB
          await NexusStorageService.saveChat(updatedChat)

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
        // Save to IndexedDB
        NexusStorageService.saveContext(context).catch(console.error)
      },

      updateContext: (contextId, updates) => {
        set(state => ({
          contexts: state.contexts.map(ctx =>
            ctx.id === contextId ? { ...ctx, ...updates } : ctx
          )
        }))
        // Update in IndexedDB
        NexusStorageService.updateContext(contextId, updates).catch(console.error)
      },

      deleteContext: (contextId) => {
        set(state => ({
          contexts: state.contexts.filter(ctx => ctx.id !== contextId),
          selectedContextIds: state.selectedContextIds.filter(id => id !== contextId)
        }))
        // Delete from IndexedDB
        NexusStorageService.deleteContext(contextId).catch(console.error)
      },

      // Settings
      setApiKey: (apiKey) => {
        nexusAnthropicClient.setApiKey(apiKey)
      },

      getApiKey: () => {
        return nexusAnthropicClient.getApiKey()
      },

      // Load data from IndexedDB
      loadFromStorage: async () => {
        try {
          // Load chats
          const chats = await NexusStorageService.loadChats()
          
          // Load contexts
          const contexts = await NexusStorageService.loadContexts()
          
          // Load messages for each chat
          const messages: Record<string, NexusMessage[]> = {}
          for (const chat of chats) {
            messages[chat.id] = await NexusStorageService.loadMessages(chat.id)
          }
          
          set({
            chats,
            contexts,
            messages
          })
        } catch (error) {
          console.error('Failed to load from storage:', error)
          set({ error: 'Failed to load data from storage' })
        }
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