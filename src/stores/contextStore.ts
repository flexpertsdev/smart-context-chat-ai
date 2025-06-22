
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Context } from '../types'
import { StorageService } from '../services/storageService'

interface ContextStore {
  contexts: Context[]
  activeContexts: Record<string, string[]>
  selectedContexts: string[]
  searchQuery: string
  filteredContexts: Context[]
  isLoading: boolean
  addContext: (context: Omit<Context, 'id'>) => Context
  updateContext: (id: string, updates: Partial<Context>) => void
  deleteContext: (id: string) => void
  attachContextsToChat: (chatId: string, contextIds: string[]) => void
  detachContextFromChat: (chatId: string, contextId: string) => void
  searchContexts: (query: string) => void
  setSelectedContexts: (contextIds: string[]) => void
  getContextsByIds: (ids: string[]) => Context[]
  loadContextsFromStorage: () => Promise<void>
}

export const useContextStore = create<ContextStore>()(
  persist(
    (set, get) => ({
      contexts: [
        {
          id: '1',
          title: 'React Best Practices',
          description: 'Guidelines for writing clean React code',
          content: 'React best practices include using functional components, hooks for state management, and proper component composition.',
          type: 'knowledge',
          tags: ['react', 'frontend', 'best-practices'],
          category: 'Development',
          size: 1024,
          usageCount: 5,
          lastUsed: new Date(),
          isPrivate: false,
          autoSuggest: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          title: 'AI Ethics Guidelines',
          description: 'Ethical considerations for AI development',
          content: 'AI ethics involves ensuring fairness, transparency, accountability, and privacy in AI systems.',
          type: 'document',
          tags: ['ai', 'ethics', 'guidelines'],
          category: 'AI',
          size: 2048,
          usageCount: 3,
          lastUsed: new Date(),
          isPrivate: false,
          autoSuggest: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      activeContexts: {},
      selectedContexts: [],
      searchQuery: '',
      filteredContexts: [],
      isLoading: false,

      addContext: (contextData) => {
        const newContext: Context = {
          ...contextData,
          id: Date.now().toString(),
          usageCount: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        set(state => ({
          contexts: [newContext, ...state.contexts]
        }))

        // Save to storage
        StorageService.saveContext(newContext)

        return newContext
      },

      updateContext: async (id, updates) => {
        const updatedContexts = get().contexts.map(context =>
          context.id === id
            ? { ...context, ...updates, updatedAt: new Date() }
            : context
        )
        set({ contexts: updatedContexts })

        // Save to storage
        const updatedContext = updatedContexts.find(c => c.id === id)
        if (updatedContext) {
          await StorageService.saveContext(updatedContext)
        }
      },

      deleteContext: async (id) => {
        set(state => ({
          contexts: state.contexts.filter(context => context.id !== id)
        }))

        // Delete from storage
        await StorageService.deleteContext(id)
      },

      attachContextsToChat: (chatId, contextIds) => {
        set(state => ({
          activeContexts: {
            ...state.activeContexts,
            [chatId]: [...(state.activeContexts[chatId] || []), ...contextIds]
          }
        }))

        // Update usage count for attached contexts
        contextIds.forEach(id => {
          get().updateContext(id, {
            usageCount: get().contexts.find(c => c.id === id)?.usageCount! + 1,
            lastUsed: new Date()
          })
        })
      },

      detachContextFromChat: (chatId, contextId) => {
        set(state => ({
          activeContexts: {
            ...state.activeContexts,
            [chatId]: (state.activeContexts[chatId] || []).filter(id => id !== contextId)
          }
        }))
      },

      searchContexts: async (query) => {
        set({ searchQuery: query, isLoading: !!query })
        
        try {
          if (query.trim()) {
            const filtered = await StorageService.searchContexts(query)
            set({ filteredContexts: filtered })
          } else {
            set({ filteredContexts: [] })
          }
        } catch (error) {
          console.error('Search failed:', error)
          set({ filteredContexts: [] })
        } finally {
          set({ isLoading: false })
        }
      },

      setSelectedContexts: (contextIds) => {
        set({ selectedContexts: contextIds })
      },

      getContextsByIds: (ids) => {
        const { contexts } = get()
        return contexts.filter(context => ids.includes(context.id))
      },

      loadContextsFromStorage: async () => {
        set({ isLoading: true })
        try {
          const contexts = await StorageService.loadContexts()
          set({ contexts })
        } catch (error) {
          console.error('Failed to load contexts from storage:', error)
        } finally {
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'context-store',
      partialize: (state) => ({
        activeContexts: state.activeContexts,
        selectedContexts: state.selectedContexts
      })
    }
  )
)
