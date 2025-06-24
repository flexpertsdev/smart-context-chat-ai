import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Chat, Message, Context, AIThinking, Assumption, Uncertainty, ReasoningStep } from '../types'
import { StorageService } from '../services/storageService'
import { netlifyAnthropicService } from '../services/netlifyAnthropicService'

interface ChatStore {
  chats: Chat[]
  activeChat: Chat | null
  messages: Record<string, Message[]>
  isTyping: boolean
  isLoading: boolean
  selectedTags: string[]
  availableTags: string[]
  selectedMessages: string[]
  selectionMode: boolean
  setActiveChat: (chat: Chat | null) => void
  sendMessage: (chatId: string, content: string, contexts?: Context[]) => Promise<void>
  addMessage: (message: Message) => void
  updateMessage: (messageId: string, updates: Partial<Message>) => void
  loadChatHistory: (chatId: string) => Promise<void>
  createNewChat: (title?: string) => Chat
  deleteChat: (chatId: string) => void
  updateChat: (chatId: string, updates: Partial<Chat>) => void
  loadChatsFromStorage: () => Promise<void>
  addTagToChat: (chatId: string, tag: string) => void
  removeTagFromChat: (chatId: string, tag: string) => void
  setSelectedTags: (tags: string[]) => void
  addAvailableTag: (tag: string) => void
  toggleMessageSelection: (messageId: string) => void
  clearMessageSelection: () => void
  setSelectionMode: (enabled: boolean) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chats: [],
      activeChat: null,
      messages: {},
      isTyping: false,
      isLoading: false,
      selectedTags: [],
      availableTags: ['Work', 'Personal', 'Research', 'Project', 'Important'],
      selectedMessages: [],
      selectionMode: false,

      setActiveChat: (chat) => {
        console.log('🎯 Setting active chat:', chat?.id)
        set({ activeChat: chat })
      },

      sendMessage: async (chatId, content, contexts = []) => {
        console.log('📤 Starting sendMessage', {
          chatId,
          contentLength: content.length,
          contextCount: contexts.length,
          timestamp: new Date().toISOString()
        })

        const userMessage: Message = {
          id: Date.now().toString(),
          chatId,
          content,
          type: 'user',
          timestamp: new Date(),
          status: 'sending'
        }

        console.log('👤 Created user message:', {
          id: userMessage.id,
          contentPreview: content.substring(0, 50) + (content.length > 50 ? '...' : '')
        })

        // Add user message
        get().addMessage(userMessage)
        await StorageService.saveMessage(userMessage)
        console.log('💾 Saved user message to storage')

        // Update message status to delivered (changed from 'sent')
        get().updateMessage(userMessage.id, { status: 'delivered' })
        console.log('✅ Updated user message status to delivered')

        console.log('🔑 Starting AI response generation via Supabase function')
        console.log('⏳ Setting isTyping to true')
        set({ isTyping: true })

        try {
          // Create AI message placeholder
          const aiMessage: Message = {
            id: (Date.now() + 2).toString(),
            chatId,
            content: '',
            type: 'ai',
            timestamp: new Date(),
            status: 'sending'
          }

          console.log('🤖 Created AI message placeholder:', aiMessage.id)
          get().addMessage(aiMessage)
          // DON'T save placeholder to Dexie yet - wait until API completes

          // Get message history for context (exclude the current placeholder)
          const chatMessages = (get().messages[chatId] || [])
            .filter(msg => msg.id !== aiMessage.id) // Exclude the placeholder we just created
          
          console.log('📚 Retrieved chat history for Supabase function:', { 
            messageCount: chatMessages.length,
            deliveredCount: chatMessages.filter(m => m.status === 'delivered').length,
            allMessages: chatMessages.map(m => ({ id: m.id, type: m.type, status: m.status, contentPreview: m.content.substring(0, 30) })),
            excludedPlaceholderId: aiMessage.id
          })
          
          // Try to get structured response from Supabase function
          try {
            console.log('🔍 Message state before API call:', {
              totalMessages: get().messages[chatId]?.length || 0,
              placeholderExists: !!get().messages[chatId]?.find(m => m.id === aiMessage.id),
              allMessageIds: get().messages[chatId]?.map(m => m.id) || []
            })
            
            const structuredResponse = await netlifyAnthropicService.getStructuredResponse(chatMessages, contexts)
            
            console.log('🔍 Message state after API call:', {
              totalMessages: get().messages[chatId]?.length || 0,
              placeholderExists: !!get().messages[chatId]?.find(m => m.id === aiMessage.id),
              allMessageIds: get().messages[chatId]?.map(m => m.id) || []
            })
            
            console.log('🧠 Received structured response with thinking data from Supabase')
            
            // Create AI thinking data from the structured response
            const aiThinking: AIThinking = {
              messageId: aiMessage.id,
              assumptions: structuredResponse.thinking.assumptions.map((assumption, index) => ({
                id: `${aiMessage.id}-assumption-${index}`,
                text: assumption.text,
                confidence: assumption.confidence,
                needsUserInput: false
              })),
              uncertainties: structuredResponse.thinking.uncertainties.map((uncertainty, index) => ({
                id: `${aiMessage.id}-uncertainty-${index}`,
                question: uncertainty.question,
                suggestedContexts: uncertainty.suggestedContexts || [],
                priority: uncertainty.priority
              })),
              confidenceLevel: structuredResponse.thinking.confidenceLevel,
              reasoningChain: structuredResponse.thinking.reasoningSteps.map((step, index) => ({
                id: `${aiMessage.id}-reasoning-${index}`,
                step: index + 1,
                description: step,
                confidence: 'medium' as const
              })),
              suggestedContexts: structuredResponse.thinking.suggestedContexts.map(sc => sc.title)
            }

            // Update message with response and thinking data using a fresh reference
            const currentMessages = get().messages[chatId] || []
            const targetMessage = currentMessages.find(m => m.id === aiMessage.id)
            
            if (!targetMessage) {
              console.error('❌ Target message lost during API call, recreating...', {
                targetId: aiMessage.id,
                existingIds: currentMessages.map(m => m.id)
              })
              
              // Recreate the message if it was lost
              const recreatedMessage: Message = {
                id: aiMessage.id,
                chatId,
                content: structuredResponse.response,
                type: 'ai',
                timestamp: new Date(),
                status: 'delivered',
                aiThinking: aiThinking
              }
              
              get().addMessage(recreatedMessage)
            } else {
              // Normal update path
              get().updateMessage(aiMessage.id, { 
                content: structuredResponse.response,
                status: 'delivered',
                aiThinking: aiThinking
              })
            }
            
            console.log('💬 AI Response Details:', {
              responseLength: structuredResponse.response?.length || 0,
              responsePreview: structuredResponse.response?.substring(0, 100) || 'EMPTY',
              hasThinking: !!aiThinking,
              messageId: aiMessage.id
            })
            
            const finalMessage = get().messages[chatId]?.find(m => m.id === aiMessage.id)
            if (finalMessage) {
              await StorageService.saveMessage(finalMessage)
              console.log('💾 Saved final AI message with thinking data to storage')
            }
            
          } catch (supabaseError) {
            console.warn('⚠️ Supabase function failed, falling back to mock data:', supabaseError)
            
            // Fallback to mock response if Supabase function fails
            const mockResponse = "I apologize, but I'm currently unable to connect to the AI service. This is a fallback response to demonstrate the interface."
            
            // Create mock thinking data for demonstration
            const aiThinking: AIThinking = {
              messageId: aiMessage.id,
              assumptions: [
                {
                  id: `${aiMessage.id}-assumption-0`,
                  text: 'Service is temporarily unavailable',
                  confidence: 'high' as const,
                  needsUserInput: false
                },
                {
                  id: `${aiMessage.id}-assumption-1`,
                  text: 'User understands this is a fallback response',
                  confidence: 'medium' as const,
                  needsUserInput: false
                }
              ],
              uncertainties: [
                {
                  id: `${aiMessage.id}-uncertainty-0`,
                  question: 'When will the AI service be restored?',
                  suggestedContexts: ['System Status', 'Service Updates'],
                  priority: 'high' as const
                }
              ],
              confidenceLevel: 'low' as const,
              reasoningChain: [
                {
                  id: `${aiMessage.id}-reasoning-0`,
                  step: 1,
                  description: 'Detected service unavailability',
                  confidence: 'high' as const
                },
                {
                  id: `${aiMessage.id}-reasoning-1`,
                  step: 2,
                  description: 'Activated fallback response system',
                  confidence: 'high' as const
                }
              ],
              suggestedContexts: ['Service Status', 'Alternative Solutions']
            }

            // Update message with fallback response and thinking data
            get().updateMessage(aiMessage.id, { 
              content: mockResponse,
              status: 'delivered',
              aiThinking: aiThinking
            })
            
            const finalMessage = get().messages[chatId]?.find(m => m.id === aiMessage.id)
            if (finalMessage) {
              await StorageService.saveMessage(finalMessage)
              console.log('💾 Saved fallback message with thinking data to storage')
            }
          }

        } catch (error) {
          console.error('❌ Error during AI response generation:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          })
          
          const errorMessage: Message = {
            id: (Date.now() + 3).toString(),
            chatId,
            content: `Error: ${error instanceof Error ? error.message : 'Failed to get AI response'}`,
            type: 'system',
            timestamp: new Date(),
            status: 'delivered'
          }
          get().addMessage(errorMessage)
          await StorageService.saveMessage(errorMessage)
        } finally {
          console.log('🛑 Setting isTyping to false')
          set({ isTyping: false })
        }
      },

      addMessage: (message) => {
        console.log('➕ Adding message to store:', { messageId: message.id, type: message.type })
        const { messages, chats } = get()
        const chatMessages = messages[message.chatId] || []
        
        set({
          messages: {
            ...messages,
            [message.chatId]: [...chatMessages, message]
          }
        })

        // Update chat's last message
        if (message.type !== 'system') {
          const updatedChats = chats.map(chat =>
            chat.id === message.chatId
              ? { ...chat, lastMessage: message, lastActivity: new Date() }
              : chat
          )
          set({ chats: updatedChats })
          
          // Save updated chat to storage
          const updatedChat = updatedChats.find(c => c.id === message.chatId)
          if (updatedChat) {
            StorageService.saveChat(updatedChat)
          }
        }
      },

      updateMessage: (messageId, updates) => {
        console.log('🔄 Updating message:', { messageId, updates: Object.keys(updates) })
        const { messages } = get()
        const updatedMessages = { ...messages }
        
        let messageFound = false
        for (const chatId in updatedMessages) {
          const originalLength = updatedMessages[chatId].length
          updatedMessages[chatId] = updatedMessages[chatId].map(message => {
            if (message.id === messageId) {
              messageFound = true
              const updatedMessage = { ...message, ...updates }
              console.log('✅ Message updated:', {
                messageId,
                oldContent: message.content?.substring(0, 50) || 'EMPTY',
                newContent: updatedMessage.content?.substring(0, 50) || 'EMPTY',
                oldStatus: message.status,
                newStatus: updatedMessage.status
              })
              return updatedMessage
            }
            return message
          })
          const newLength = updatedMessages[chatId].length
          if (originalLength !== newLength) {
            console.error('❌ Message array length changed!', { chatId, originalLength, newLength })
          }
        }
        
        if (!messageFound) {
          console.error('❌ Message not found for update:', messageId)
        }
        
        set({ messages: updatedMessages })
      },

      loadChatHistory: async (chatId) => {
        set({ isLoading: true })
        try {
          const messages = await StorageService.loadMessages(chatId)
          set(state => ({
            messages: {
              ...state.messages,
              [chatId]: messages
            }
          }))
        } catch (error) {
          console.error('Failed to load chat history:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      createNewChat: (title) => {
        const newChat: Chat = {
          id: Date.now().toString(),
          title: title || `Chat ${Date.now()}`,
          lastActivity: new Date(),
          contextIds: [],
          unreadCount: 0,
          isArchived: false,
          tags: []
        }

        set(state => ({
          chats: [newChat, ...state.chats],
          activeChat: newChat
        }))

        StorageService.saveChat(newChat)
        return newChat
      },

      deleteChat: async (chatId) => {
        const { chats, messages, activeChat } = get()
        const updatedChats = chats.filter(chat => chat.id !== chatId)
        const updatedMessages = { ...messages }
        delete updatedMessages[chatId]

        set({
          chats: updatedChats,
          messages: updatedMessages,
          activeChat: activeChat?.id === chatId ? null : activeChat
        })

        await StorageService.deleteChat(chatId)
      },

      updateChat: async (chatId, updates) => {
        const updatedChats = get().chats.map(chat =>
          chat.id === chatId ? { ...chat, ...updates } : chat
        )
        set({ chats: updatedChats })

        const updatedChat = updatedChats.find(c => c.id === chatId)
        if (updatedChat) {
          await StorageService.saveChat(updatedChat)
        }
      },

      loadChatsFromStorage: async () => {
        set({ isLoading: true })
        try {
          const chats = await StorageService.loadChats()
          set({ chats })
        } catch (error) {
          console.error('Failed to load chats from storage:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      addTagToChat: (chatId, tag) => {
        const { chats } = get()
        const updatedChats = chats.map(chat =>
          chat.id === chatId
            ? { ...chat, tags: [...new Set([...chat.tags, tag])] }
            : chat
        )
        set({ chats: updatedChats })

        const updatedChat = updatedChats.find(c => c.id === chatId)
        if (updatedChat) {
          StorageService.saveChat(updatedChat)
        }

        // Add to available tags if not already there
        const { availableTags } = get()
        if (!availableTags.includes(tag)) {
          set({ availableTags: [...availableTags, tag] })
        }
      },

      removeTagFromChat: (chatId, tag) => {
        const { chats } = get()
        const updatedChats = chats.map(chat =>
          chat.id === chatId
            ? { ...chat, tags: chat.tags.filter(t => t !== tag) }
            : chat
        )
        set({ chats: updatedChats })

        const updatedChat = updatedChats.find(c => c.id === chatId)
        if (updatedChat) {
          StorageService.saveChat(updatedChat)
        }
      },

      setSelectedTags: (tags) => {
        set({ selectedTags: tags })
      },

      addAvailableTag: (tag) => {
        const { availableTags } = get()
        if (!availableTags.includes(tag)) {
          set({ availableTags: [...availableTags, tag] })
        }
      },

      toggleMessageSelection: (messageId) => {
        const { selectedMessages } = get()
        const isSelected = selectedMessages.includes(messageId)
        
        if (isSelected) {
          const newSelection = selectedMessages.filter(id => id !== messageId)
          set({ 
            selectedMessages: newSelection,
            selectionMode: newSelection.length > 0
          })
        } else {
          set({ 
            selectedMessages: [...selectedMessages, messageId],
            selectionMode: true
          })
        }
      },

      clearMessageSelection: () => {
        set({ selectedMessages: [], selectionMode: false })
      },

      setSelectionMode: (enabled) => {
        set({ 
          selectionMode: enabled,
          selectedMessages: enabled ? get().selectedMessages : []
        })
      }
    }),
    {
      name: 'chat-store',
      partialize: (state) => ({
        activeChat: state.activeChat,
        availableTags: state.availableTags
      })
    }
  )
)
