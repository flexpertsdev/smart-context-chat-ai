import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { onboardingService } from '../services/onboardingService'

// Import stores for demo reset functionality
import { useChatStore } from './chatStore'
import { useContextStore } from './contextStore'

interface UserProfile {
  name: string
  email: string
  avatar?: string
  bio?: string
}

interface Preferences {
  theme: 'light' | 'dark' | 'system'
  notifications: boolean
  autoSave: boolean
  liveThinking?: boolean
  autoSuggestContexts?: boolean
}

interface AppState {
  isFirstTime: boolean
  hasCompletedOnboarding: boolean
  currentGradient: string
  firstChatId: string | null
  user: UserProfile | null
  preferences: Preferences
  setFirstTime: (isFirstTime: boolean) => void
  completeOnboarding: () => void
  setGradient: (gradient: string) => void
  setFirstChatId: (chatId: string) => void
  updateUser: (user: Partial<UserProfile>) => void
  updatePreferences: (preferences: Partial<Preferences>) => void
  resetForDemo: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isFirstTime: true,
      hasCompletedOnboarding: false,
      currentGradient: 'from-emerald-400 via-green-500 to-teal-600',
      firstChatId: null,
      user: null,
      preferences: {
        theme: 'system',
        notifications: true,
        autoSave: true,
        liveThinking: false,
        autoSuggestContexts: false
      },
      
      setFirstTime: (isFirstTime) => set({ isFirstTime }),
      
      completeOnboarding: async () => {
        // Create the first chat when onboarding completes
        try {
          const firstChatId = await onboardingService.createFirstChat()
          set({ 
            hasCompletedOnboarding: true, 
            isFirstTime: false,
            firstChatId 
          })
          return firstChatId // Return the chat ID for direct navigation
        } catch (error) {
          console.error('Failed to create first chat:', error)
          // Still complete onboarding even if chat creation fails
          set({ 
            hasCompletedOnboarding: true, 
            isFirstTime: false 
          })
          return null
        }
      },
      
      setGradient: (gradient) => set({ currentGradient: gradient }),
      
      setFirstChatId: (chatId) => set({ firstChatId: chatId }),
      
      updateUser: (userData) => set(state => ({
        user: state.user ? { ...state.user, ...userData } : userData as UserProfile
      })),
      
      updatePreferences: (preferences) => set(state => ({
        preferences: { ...state.preferences, ...preferences }
      })),
      
      resetForDemo: async () => {
        // Clear all stored data
        try {
          const { StorageService } = await import('../services/storageService')
          await StorageService.clearAllData()
        } catch (error) {
          console.error('Failed to clear storage:', error)
        }
        
        // Clear chat store
        try {
          const chatStore = useChatStore.getState()
          // Reset chat store to initial state
          chatStore.loadChatsFromStorage = async () => {} // Prevent auto-loading
        } catch (error) {
          console.error('Failed to reset chat store:', error)
        }
        
        // Clear context store  
        try {
          const contextStore = useContextStore.getState()
          // Reset context store to initial state
          contextStore.loadContextsFromStorage = async () => {} // Prevent auto-loading
        } catch (error) {
          console.error('Failed to reset context store:', error)
        }
        
        // Reset app state
        set({
          isFirstTime: true,
          hasCompletedOnboarding: false,
          firstChatId: null,
          user: null,
          preferences: {
            theme: 'system',
            notifications: true,
            autoSave: true,
            liveThinking: false,
            autoSuggestContexts: false
          }
        })
      }
    }),
    {
      name: 'app-store'
    }
  )
)
