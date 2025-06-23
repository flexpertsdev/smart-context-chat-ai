import React, { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Paperclip, 
  Mic, 
  Camera,
  Smile,
  MoreVertical,
  CheckCheck,
  Check
} from 'lucide-react'
import MobileLayout from '../layouts/MobileLayout'
import { useChatStore } from '../../stores/chatStore'
import { format } from 'date-fns'

const MobileChat: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>()
  const navigate = useNavigate()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  
  const { 
    chats, 
    messages, 
    sendMessage, 
    loadChatHistory,
    isTyping 
  } = useChatStore()
  
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
  const currentChat = chats.find(chat => chat.id === chatId)
  const chatMessages = chatId ? messages[chatId] || [] : []

  useEffect(() => {
    if (chatId) {
      loadChatHistory(chatId)
    }
  }, [chatId, loadChatHistory])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isTyping])

  const handleSend = async () => {
    if (message.trim() && chatId) {
      const messageText = message
      setMessage('')
      await sendMessage(chatId, messageText)
      inputRef.current?.focus()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const formatMessageTime = (date: Date) => {
    return format(new Date(date), 'HH:mm')
  }

  const groupMessagesByDate = (messages: any[]) => {
    const groups: { [key: string]: any[] } = {}
    
    messages.forEach(msg => {
      const date = new Date(msg.timestamp).toDateString()
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(msg)
    })
    
    return groups
  }

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date().toDateString()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (dateString === today) return 'Today'
    if (dateString === yesterday.toDateString()) return 'Yesterday'
    return format(date, 'MMMM d, yyyy')
  }

  const messageGroups = groupMessagesByDate(chatMessages)

  return (
    <MobileLayout
      headerProps={{
        title: currentChat?.title || 'Chat',
        subtitle: isTyping ? 'typing...' : 'online',
        variant: 'chat',
        onBack: () => navigate('/mobile'),
        profileImage: '/placeholder.svg',
        isOnline: true
      }}
      showBottomNav={false}
    >
      <div className="flex flex-col h-full bg-[#e5ddd5]">
        {/* Chat Background Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-3 py-2 relative">
          <AnimatePresence>
            {Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex justify-center my-2">
                  <span className="bg-white/80 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatDateHeader(date)}
                  </span>
                </div>

                {/* Messages */}
                {msgs.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`flex mb-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-lg shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-[#dcf8c6] rounded-br-none'
                          : 'bg-white rounded-bl-none'
                      }`}
                    >
                      <p className="text-gray-800 text-sm whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(msg.timestamp)}
                        </span>
                        {msg.role === 'user' && (
                          <CheckCheck className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start mb-2"
            >
              <div className="bg-white px-4 py-3 rounded-lg rounded-bl-none shadow-sm">
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-2 py-2 safe-area-bottom">
          <div className="flex items-end gap-2">
            {/* Emoji Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="p-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-6 h-6" />
            </motion.button>

            {/* Input Field */}
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-end">
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message"
                className="flex-1 bg-transparent outline-none resize-none max-h-32 text-gray-700 placeholder-gray-400"
                rows={1}
                style={{
                  minHeight: '24px',
                  maxHeight: '96px'
                }}
              />
              
              {/* Attachment Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                <Paperclip className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Send/Voice Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={message.trim() ? handleSend : undefined}
              className={`p-2 rounded-full ${
                message.trim() 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {message.trim() ? (
                <Send className="w-6 h-6" />
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </MobileLayout>
  )
}

export default MobileChat