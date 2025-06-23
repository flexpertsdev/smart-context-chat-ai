import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, Search, X, Plus } from 'lucide-react'
import { useChatStore } from '../stores/chatStore'
import { useAppStore } from '../stores/appStore'
import { useBreakpoints } from '../hooks/use-breakpoints'
import AdaptiveLayout from '../components/layout/AdaptiveLayout'
import ResponsiveNavigation from '../components/layout/ResponsiveNavigation'
import FloatingActionButton from '../components/ui/FloatingActionButton'
import SwipeableChat from '../components/chat/SwipeableChat'
import { Badge } from '../components/ui/badge'
import AddTagBottomSheet from '../components/chat/AddTagBottomSheet'

const Home = () => {
  const navigate = useNavigate()
  const { isMobile, isTablet, isDesktop } = useBreakpoints()
  const { firstChatId, hasCompletedOnboarding, isFirstTime } = useAppStore()
  const { 
    chats, 
    createNewChat, 
    loadChatsFromStorage, 
    deleteChat, 
    updateChat,
    selectedTags,
    availableTags,
    setSelectedTags,
    addTagToChat,
    removeTagFromChat,
    addAvailableTag
  } = useChatStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [customTag, setCustomTag] = useState('')
  const [tagBottomSheet, setTagBottomSheet] = useState<{ isOpen: boolean; chatId: string | null }>({
    isOpen: false,
    chatId: null
  })

  useEffect(() => {
    loadChatsFromStorage()
  }, [loadChatsFromStorage])


  // Handle first-time user redirect to onboarding
  useEffect(() => {
    if (isFirstTime && !hasCompletedOnboarding) {
      navigate('/onboarding', { replace: true })
      return
    }
  }, [isFirstTime, hasCompletedOnboarding, navigate])

  // Removed auto-navigation to first chat - users should choose when to enter a chat

  const filteredChats = useMemo(() => {
    let filtered = chats

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(chat => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by selected tags - ensure we're working with string values only
    if (selectedTags.length > 0) {
      filtered = filtered.filter(chat => {
        // Ensure chat.tags is an array of strings
        const chatTags = Array.isArray(chat.tags) 
          ? chat.tags.filter(tag => typeof tag === 'string') 
          : []
        
        // Ensure selectedTags are strings
        const validSelectedTags = selectedTags.filter(tag => typeof tag === 'string')
        
        return validSelectedTags.every(tag => chatTags.includes(tag))
      })
    }

    return filtered
  }, [chats, searchQuery, selectedTags])

  const handleNewChat = () => {
    const newChat = createNewChat()
    navigate(`/chat/${newChat.id}`)
  }

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId)
  }

  const handleArchiveChat = (chatId: string) => {
    updateChat(chatId, { isArchived: true })
  }

  const handleAddTagToChat = (chatId: string) => {
    setTagBottomSheet({ isOpen: true, chatId })
  }

  const handleTagSelect = (tag: string) => {
    if (typeof tag === 'string' && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleTagDeselect = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  const handleAddCustomTag = () => {
    const trimmedTag = customTag.trim()
    if (trimmedTag && !availableTags.includes(trimmedTag)) {
      addAvailableTag(trimmedTag)
      setCustomTag('')
      setShowCustomInput(false)
    }
  }

  const formatLastActivity = (date: Date | string | undefined) => {
    if (!date) return 'No activity'
    
    const dateObj = typeof date === 'string' ? new Date(date) : date
    
    if (!dateObj || isNaN(dateObj.getTime())) return 'No activity'
    
    const now = new Date()
    const diffMs = now.getTime() - dateObj.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`
    if (diffDays < 7) return `${Math.floor(diffDays)}d ago`
    return dateObj.toLocaleDateString()
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  // Ensure availableTags and selectedTags are arrays of strings
  const safeAvailableTags = Array.isArray(availableTags) 
    ? availableTags.filter(tag => typeof tag === 'string') 
    : []
  
  const safeSelectedTags = Array.isArray(selectedTags) 
    ? selectedTags.filter(tag => typeof tag === 'string') 
    : []

  if (chats.length === 0) {
    return (
      <AdaptiveLayout
        sidebar={isDesktop ? <ResponsiveNavigation /> : undefined}
        showTabBar={isMobile}
        headerProps={{ title: 'Smart Context Chat' }}
      >
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Welcome to AI Chat
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-sm">
              Start conversations with AI and manage contexts to get better, more relevant responses.
            </p>

            <motion.button
              onClick={handleNewChat}
              className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors touch-target"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your First Chat
            </motion.button>
          </motion.div>
        </div>
      </AdaptiveLayout>
    )
  }

  return (
    <AdaptiveLayout
      sidebar={isDesktop ? <ResponsiveNavigation /> : undefined}
      showTabBar={isMobile}
      headerProps={{ title: 'Chats' }}
    >
      <div className="h-full flex flex-col">
        {/* Search Header */}
        <div className="flex-shrink-0">
          <motion.div
            className="bg-white border-b border-gray-200 px-4 py-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            {searchQuery && (
              <motion.div
                className="mt-2 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {filteredChats.length} result{filteredChats.length !== 1 ? 's' : ''} found
              </motion.div>
            )}
          </motion.div>

          {/* Tag Filter Bar */}
          <div className="bg-white border-b border-gray-100 px-4 py-2">
            <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hidden">
              {/* Selected tags */}
              {safeSelectedTags.map((tag) => (
                <motion.button
                  key={`selected-${tag}`}
                  onClick={() => handleTagDeselect(tag)}
                  className="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center space-x-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{tag}</span>
                  <X className="w-3 h-3" />
                </motion.button>
              ))}

              {/* Available tags */}
              {safeAvailableTags
                .filter(tag => !safeSelectedTags.includes(tag))
                .map((tag) => (
                  <motion.button
                    key={`available-${tag}`}
                    onClick={() => handleTagSelect(tag)}
                    className="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {tag}
                  </motion.button>
                ))}

              {/* Add custom tag */}
              {showCustomInput ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCustomTag()
                      if (e.key === 'Escape') setShowCustomInput(false)
                    }}
                    placeholder="New tag"
                    className="text-sm border border-gray-300 rounded px-2 py-1 w-20"
                    autoFocus
                  />
                  <button
                    onClick={handleAddCustomTag}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <motion.button
                  onClick={() => setShowCustomInput(true)}
                  className="px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center px-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No chats found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search terms or tags</p>
              <button
                onClick={() => {
                  clearSearch()
                  setSelectedTags([])
                }}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            filteredChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <SwipeableChat
                  chat={chat}
                  onNavigate={() => navigate(`/chat/${chat.id}`)}
                  onDelete={() => handleDeleteChat(chat.id)}
                  onAddTag={() => handleAddTagToChat(chat.id)}
                  onArchive={() => handleArchiveChat(chat.id)}
                  formatLastActivity={formatLastActivity}
                />
              </motion.div>
            ))
          )}
        </div>

        {isMobile && <FloatingActionButton onClick={handleNewChat} />}

        {/* Add Tag Bottom Sheet */}
        <AddTagBottomSheet
          isOpen={tagBottomSheet.isOpen}
          onClose={() => setTagBottomSheet({ isOpen: false, chatId: null })}
          availableTags={safeAvailableTags}
          chatTags={tagBottomSheet.chatId ? chats.find(c => c.id === tagBottomSheet.chatId)?.tags?.filter(tag => typeof tag === 'string') || [] : []}
          onAddTag={(tag) => {
            if (tagBottomSheet.chatId && typeof tag === 'string') {
              addTagToChat(tagBottomSheet.chatId, tag)
            }
          }}
          onRemoveTag={(tag) => {
            if (tagBottomSheet.chatId && typeof tag === 'string') {
              removeTagFromChat(tagBottomSheet.chatId, tag)
            }
          }}
          onAddCustomTag={(tag) => {
            if (typeof tag === 'string') {
              addAvailableTag(tag)
            }
          }}
        />
      </div>
    </AdaptiveLayout>
  )
}

export default Home
