import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check, CheckCheck, Camera, Search } from 'lucide-react'
import MobileLayout from '../layouts/MobileLayout'
import { useChatStore } from '../../stores/chatStore'
import { format } from 'date-fns'

const MobileChatList: React.FC = () => {
  const navigate = useNavigate()
  const { chats, createNewChat, loadChatsFromStorage } = useChatStore()
  const [searchMode, setSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadChatsFromStorage()
  }, [loadChatsFromStorage])

  const handleNewChat = () => {
    const newChat = createNewChat('New Chat')
    navigate(`/mobile/chat/${newChat.id}`)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const messageDate = new Date(date)
    
    // If today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'HH:mm')
    }
    
    // If yesterday
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    
    // If within a week, show day name
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    if (messageDate > weekAgo) {
      return format(messageDate, 'EEEE')
    }
    
    // Otherwise show date
    return format(messageDate, 'dd/MM/yyyy')
  }

  const filteredChats = searchQuery 
    ? chats.filter(chat => 
        chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats

  return (
    <MobileLayout
      headerProps={{
        title: searchMode ? '' : 'WhatsApp',
        variant: 'home',
        searchMode,
        onSearchToggle: () => setSearchMode(!searchMode)
      }}
    >
      <div className="flex-1 flex flex-col bg-white">
        {/* Search Input (when in search mode) */}
        {searchMode && (
          <div className="px-4 py-2 bg-white border-b border-gray-100">
            <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-3 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence>
            {filteredChats.length === 0 ? (
              <motion.div 
                className="flex flex-col items-center justify-center h-full px-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">No chats yet</h3>
                <p className="text-gray-500 text-sm">
                  Tap the button below to start a new conversation
                </p>
              </motion.div>
            ) : (
              filteredChats.map((chat, index) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => navigate(`/mobile/chat/${chat.id}`)}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
                >
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-xl font-medium text-gray-600">
                      {chat.title.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate pr-2">
                        {chat.title}
                      </h3>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {chat.lastMessage && formatTime(chat.lastMessage.timestamp)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate pr-2">
                        {chat.lastMessage?.role === 'user' && (
                          <span className="text-gray-500">You: </span>
                        )}
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                      
                      {/* Message Status Icons */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {chat.unreadCount > 0 && (
                          <span className="bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                            {chat.unreadCount}
                          </span>
                        )}
                        {chat.lastMessage?.role === 'user' && (
                          <CheckCheck className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Floating Action Button */}
        <motion.button
          onClick={handleNewChat}
          className="fixed bottom-20 right-4 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 active:scale-95 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
    </MobileLayout>
  )
}

export default MobileChatList